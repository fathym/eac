import { color } from '@oclif/color';
import {
  EaCApplicationAsCode,
  EaCDevOpsAction,
  EaCDFSModifier,
  EaCEnterpriseDetails,
  EaCLicense,
  EaCProjectAsCode,
  EaCSourceControl,
  EnterpriseAsCode,
} from '@semanticjs/common';
import axios from 'axios';
import { createWriteStream, createReadStream } from 'fs-extra';
import {
  ListrRenderer,
  ListrTask,
  ListrTaskWrapper,
  PromptOptions,
} from 'listr2';
import loadAxios from './axios';
import { withConfig } from './config-helpers';
import './prompts/az-sshkey-create-prompts';
import './prompts/eac-env-cloud-resource-groups-prompts';
import './prompts/eac-env-clouds-prompts';
import './prompts/eac-env-pipelines-prompts';
import './prompts/eac-env-sources-prompts';
import { Config } from '@oclif/core';
import { Draft } from 'immer';
import {
  AzureCLITaskContext,
  AzureSubscription,
  ensureAzureCliLogin,
  ensureAzureCliSetupTask,
  ensurePromptValue,
  FathymTaskContext,
  loadActieEnterpriseLookup,
  merge,
  removeUndefined,
  SubscriptionTaskContext,
} from './core-helpers';
import { runProc } from './task-helpers';
import { randomUUID } from 'node:crypto';

export type DepthOption = string | (string | Record<string, unknown> | [])[];

export interface EaCTaskContext {
  EaC: EnterpriseAsCode;
}

export interface EnsureSelectionOptions<TContext, TEaC> {
  addFromDraft?: boolean;

  create?: () => Promise<string>;

  enabled?: (ctx: TContext) => boolean;

  filterLookups?: (
    ctx: TContext,
    draftEaC: EnterpriseAsCode,
    lookups: string[]
  ) => Promise<string[]>;

  loadFromEaC: (
    ctx: TContext,
    eac: EnterpriseAsCode
  ) => Promise<{
    [lookup: string]: TEaC;
  }>;

  loadEaCName: (teac: TEaC) => string;

  setContext: (ctx: TContext, lookup: string) => void;

  shouldCreate?: boolean;

  type: string;
}

export interface EaCRemovalsTaskContext {
  EaCRemovals: EnterpriseAsCode;
}

export interface ApplicationTaskContext {
  ApplicationLookup: string;
}

export interface ActiveEnterpriseTaskContext {
  ActiveEnterpriseLookup: string;
}

export interface DFSModifierTaskContext {
  DFSModifierLookup: string;
}

export interface PipelineTaskContext {
  PipelineLookup: string;
}

export interface ProjectTaskContext {
  ProjectLookup: string;
}

export interface SourceTaskContext {
  SourceLookup: string;
}

export interface CloudTaskContext {
  CloudLookup: string;
}

export interface CloudResourceGroupTaskContext {
  CloudResourceGroupLookup: string;
}

export interface SSHKeyTaskContext {
  SSHPublicKey: string;
}

export interface EaCDraft {
  EaC?: EnterpriseAsCode;

  HasChanges: boolean;

  Name?: string;

  Description?: string;
}

export function ensureDepthInitialized<T>(obj: T, path: DepthOption[]): T {
  if (path?.length > 0) {
    const [lead, ...tail] = path;

    let headOpts = lead;

    if (typeof lead === 'string') {
      headOpts = [lead as string, {}];
    }

    const [head, init] = headOpts;

    obj[head as string] = obj[head as string] || init || {};

    return ensureDepthInitialized(obj[head as string], tail);
  }

  return obj;
}

export function azSshKeyCreateTask<
  TContext extends SSHKeyTaskContext &
    EaCTaskContext &
    CloudTaskContext &
    CloudResourceGroupTaskContext
>(config: Config, keyName: string): ListrTask<TContext> {
  return {
    title: 'Establish Azure SSH Key',
    task: async (ctx, task) => {
      ctx.SSHPublicKey = await task.prompt([
        {
          type: 'az:sshkey:create|confirm',
          eac: ctx.EaC,
          resourceGroup: ctx.CloudResourceGroupLookup,
          cloudLookup: ctx.CloudLookup,
          config: config,
          keyName: keyName,
        } as any,
      ]);

      if (ctx.SSHPublicKey) {
        task.title = `Azure SSH key established`;
      } else {
        throw new Error('Azure SSH key was not established');
      }
    },
  };
}

export function commitDraftTask<
  TContext extends FathymTaskContext & ActiveEnterpriseTaskContext
>(configDir: string, message: string): ListrTask<TContext> {
  return {
    title: 'Commiting EaC Draft',
    task: async (ctx, task) => {
      message = (await ensurePromptValue(
        task,
        'Message for the EaC commit:',
        message
      )) as string;

      const axios = await loadAxios(configDir);

      const eacDraft = await withEaCDraft(configDir);

      try {
        const response = await axios.post(
          `${ctx.ActiveEnterpriseLookup}/eac/commit`,
          {
            ...eacDraft,
            Message: message,
          }
        );

        const resp = response.data;

        if (resp.Status.Code === 0) {
          task.title = `EaC Draft Committed`;

          await withEaCDraft(configDir, 'clear');

          await withEaCDraft(configDir, ctx.ActiveEnterpriseLookup);
        } else {
          if (resp.Status.Code === 501) {
            ctx.Fathym.Instructions = [
              ...(ctx.Fathym.Instructions || []),
              {
                Instruction: 'fathym dev billing manage',
                Description: `Open the billing page and complete subscription purchase to use
these features. Once purchase is complete, re-run the command`,
              },
            ];
          }

          throw new Error(resp.Status.Message);
        }
      } catch {
        ctx.Fathym.Instructions = [
          ...(ctx.Fathym.Instructions || []),
          {
            Instruction: 'ftm dev billing manage',
            Description: `Open the billing page and complete subscription prchase to use
these features. Once purchase is complete, rerun the command`,
          },
        ];

        throw new Error('There was an issue. Follow the instructions.');
      }
    },
  };
}

export async function createAzureSubscription(
  configDir: string,
  entLookup: string,
  subName: string
): Promise<AzureSubscription> {
  const axios = await loadAxios(configDir);

  const response = await axios.post(`${entLookup}/azure/subscription/create`, {
    Name: subName,
  });

  return response.data.Model as AzureSubscription;
}

export function deleteFromEaCTask<
  TContext extends ActiveEnterpriseTaskContext & EaCRemovalsTaskContext
>(configDir: string, name: string, description: string): ListrTask<TContext> {
  return {
    title: 'Removing from EaC',
    skip: (ctx) => !ctx.EaCRemovals,
    task: async (ctx, task) => {
      const axios = await loadAxios(configDir);

      const response = await axios.put(
        `${ctx.ActiveEnterpriseLookup}/eac/removals`,
        {
          EaC: ctx.EaCRemovals,
          Name: name,
          Description: description || name,
        }
      );

      const resp = response.data;

      if (resp.Status.Code === 0) {
        task.title = `EaC Removals Committed`;
      } else {
        throw new Error(resp.Status.Message);
      }
    },
  };
}

export async function downloadContents(url: string): Promise<string> {
  const response = await axios.get(url);

  return response.data;
}

export async function downloadFile(url: string, file: string): Promise<void> {
  const response = await axios({
    method: 'get',
    url: url,
    responseType: 'stream',
  });

  response.data.pipe(createWriteStream(file));

  return new Promise((resolve, reject) => {
    response.data.on('end', () => {
      resolve();
    });

    response.data.on('error', (error: any) => {
      reject(error);
    });
  });
}

export function ensureSelection<
  TContext extends ActiveEnterpriseTaskContext & EaCTaskContext,
  TEaC
>(
  configDir: string,
  lookup?: string,
  options?: EnsureSelectionOptions<TContext, TEaC>
): ListrTask<TContext> {
  const {
    addFromDraft,
    create,
    enabled,
    filterLookups,
    loadFromEaC,
    loadEaCName,
    setContext,
    shouldCreate,
    type,
  } = options || {};

  return {
    title: `Ensuring ${type} set`,
    enabled: enabled,
    task: async (ctx, task) => {
      const draft: EaCDraft = addFromDraft
        ? await withEaCDraft(configDir, ctx.ActiveEnterpriseLookup)
        : ({} as EaCDraft);

      const fromEaC = (await loadFromEaC?.(ctx, ctx.EaC)) || {};

      const fromDraftEaC = (await loadFromEaC?.(ctx, draft.EaC!)) || {};

      const eac = removeUndefined(fromEaC);

      merge(removeUndefined(fromDraftEaC), eac);

      let eacLookups = Object.keys(eac);

      if (!lookup) {
        if (filterLookups) {
          eacLookups = await filterLookups!(ctx, draft.EaC!, eacLookups);
        }

        lookup = (await ensurePromptValue(
          task,
          `Choose EaC ${type}:`,
          lookup!,
          eacLookups.map((eacLookup) => {
            const fromEaCLooked = fromEaC[eacLookup];

            const fromDraftEaCLooked = fromDraftEaC[eacLookup];

            const eacName =
              loadEaCName!(fromDraftEaCLooked) || loadEaCName!(fromEaCLooked);

            const draftText = fromDraftEaCLooked ? color.yellow('draft') : '';

            return {
              message: `${eacName} ${draftText}`,
              name: eacLookup,
            };
          }),
          shouldCreate ? create || (async () => randomUUID()) : undefined
        )) as string;
      }

      task.title = `Selected ${type}: ${
        loadEaCName!(eac[lookup!]) || 'Creating New'
      }`;

      setContext!(ctx, lookup!);
    },
  };
}

export function ensureActiveEnterpriseTask<
  TContext extends ActiveEnterpriseTaskContext
>(configDir: string): ListrTask<TContext> {
  return {
    title: `Ensuring active enterprise`,
    task: async (ctx, task) => {
      ctx.ActiveEnterpriseLookup = await loadActieEnterpriseLookup(configDir);
      
      if (ctx.ActiveEnterpriseLookup) {
        const licenses = await ensureLicense(configDir, "fathym");
        
        if (licenses.length === 0){
          throw new Error(
            "You currently don't have an active license. Please visit https://fathym.com/dashboard/billing to purchase a license"
            );       
        }
        else{
          task.title = `License found. Active enterprise is currently set to ${ctx.ActiveEnterpriseLookup}`;
        }
      } else {
        throw new Error(
          `Active enterprise must be set with 'fathym enterprises set' command.`
        );
      }
    },
  };
}

export function ensureApplicationTask<
  TContext extends ActiveEnterpriseTaskContext &
    EaCTaskContext &
    ProjectTaskContext &
    ApplicationTaskContext &
    ProjectTaskContext
>(
  configDir: string,
  appLookup?: string,
  create?: boolean,
  addFromDraft?: boolean,
  projectFilter?: boolean,
  enabled?: (ctx: TContext) => boolean
): ListrTask<TContext> {
  return ensureSelection<TContext, EaCApplicationAsCode>(configDir, appLookup, {
    type: 'Application',
    shouldCreate: create,
    addFromDraft: addFromDraft,
    enabled: enabled,
    loadEaCName: (app) => {
      return app?.Application?.Name!;
    },
    loadFromEaC: async (ctx, eac) => {
      return eac?.Applications || {};
    },
    filterLookups: projectFilter
      ? async (ctx, draftEaC, lookups) => {
          const projectAppLookups = Array.from(
            new Set([
              ...(ctx.EaC.Projects?.[ctx.ProjectLookup]?.ApplicationLookups ||
                []),
              ...(draftEaC?.Projects?.[ctx.ProjectLookup]?.ApplicationLookups ||
                []),
            ]).values()
          );

          return lookups.filter((app) => projectAppLookups.includes(app));
        }
      : undefined,
    setContext: (ctx, lookup) => {
      ctx.ApplicationLookup = lookup || '';
    },
  });
}

export function ensureModifierTask<
  TContext extends DFSModifierTaskContext &
    ActiveEnterpriseTaskContext &
    EaCTaskContext &
    ProjectTaskContext &
    ApplicationTaskContext
>(
  configDir: string,
  mdfrLookup?: string,
  create?: boolean,
  addFromDraft?: boolean,
  projectFilter?: boolean,
  applicationFilter?: boolean,
  enabled?: (ctx: TContext) => boolean
): ListrTask<TContext> {
  return ensureSelection<TContext, EaCDFSModifier>(configDir, mdfrLookup, {
    type: 'DFS Modifier',
    shouldCreate: create,
    addFromDraft: addFromDraft,
    enabled: enabled,
    loadEaCName: (mdf) => {
      return mdf?.Name!;
    },
    loadFromEaC: async (ctx, eac) => {
      return eac?.Modifiers || {};
    },
    filterLookups: projectFilter
      ? async (ctx, draftEaC, lookups) => {
          const projectModifierLookups = Array.from(
            new Set([
              ...ctx.EaC.Projects?.[ctx.ProjectLookup]?.ModifierLookups!,
              ...draftEaC?.Projects?.[ctx.ProjectLookup]?.ModifierLookups!,
            ]).values()
          );

          return lookups.filter((lookup) =>
            projectModifierLookups.includes(lookup)
          );
        }
      : applicationFilter
      ? async (ctx, draftEaC, lookups) => {
          const appModifierLookups = Array.from(
            new Set([
              ...ctx.EaC.Applications![ctx.ApplicationLookup].ModifierLookups!,
              ...(draftEaC.Applications
                ? draftEaC.Applications[ctx.ApplicationLookup].ModifierLookups!
                : []),
            ]).values()
          );

          return lookups.filter((lookup) =>
            appModifierLookups.includes(lookup)
          );
        }
      : undefined,
    setContext: (ctx, lookup) => {
      ctx.DFSModifierLookup = lookup || '';
    },
  });
}

export function ensureProjectTask<
  TContext extends ProjectTaskContext &
    EaCTaskContext &
    ActiveEnterpriseTaskContext
>(
  configDir: string,
  projectLookup?: string,
  create?: boolean,
  addFromDraft?: boolean,
  enabled?: (ctx: TContext) => boolean
): ListrTask<TContext> {
  return ensureSelection<TContext, EaCProjectAsCode>(configDir, projectLookup, {
    type: 'Project',
    shouldCreate: create,
    addFromDraft: addFromDraft,
    enabled: enabled,
    loadEaCName: (proj) => {
      return proj?.Project?.Name!;
    },
    loadFromEaC: async (ctx, eac) => {
      return eac?.Projects || {};
    },
    setContext: (ctx, lookup) => {
      ctx.ProjectLookup = lookup || '';
    },
  });
}

export function ensurePipelineTask<
  TContext extends PipelineTaskContext &
    EaCTaskContext &
    ActiveEnterpriseTaskContext
>(
  configDir: string,
  projectLookup?: string,
  create?: boolean,
  addFromDraft?: boolean,
  enabled?: (ctx: TContext) => boolean
): ListrTask<TContext> {
  return ensureSelection<TContext, EaCDevOpsAction>(configDir, projectLookup, {
    type: 'Build Pipeline',
    shouldCreate: create,
    addFromDraft: addFromDraft,
    enabled: enabled,
    loadEaCName: (doa) => {
      return doa?.Name!;
    },
    loadFromEaC: async (ctx, eac) => {
      const env = eac?.Environments
        ? eac.Environments![ctx.EaC.Enterprise!.PrimaryEnvironment!]
        : {};

      return env.DevOpsActions || {};
    },
    setContext: (ctx, lookup) => {
      ctx.PipelineLookup = lookup || '';
    },
  });
}

export function ensureSourceTask<
  TContext extends SourceTaskContext &
    EaCTaskContext &
    ActiveEnterpriseTaskContext
>(
  configDir: string,
  projectLookup?: string,
  create?: boolean,
  addFromDraft?: boolean,
  enabled?: (ctx: TContext) => boolean
): ListrTask<TContext> {
  return ensureSelection<TContext, EaCSourceControl>(configDir, projectLookup, {
    type: 'Source Control',
    shouldCreate: create,
    addFromDraft: addFromDraft,
    enabled: enabled,
    loadEaCName: (doa) => {
      return doa?.Name!;
    },
    loadFromEaC: async (ctx, eac) => {
      const env = eac?.Environments
        ? eac.Environments![ctx.EaC.Enterprise!.PrimaryEnvironment!]
        : {};

      return env.Sources || {};
    },
    setContext: (ctx, lookup) => {
      ctx.SourceLookup = lookup || '';
    },
  });
}

// export function ensurePipelineTask<
//   TContext extends EaCTaskContext & PipelineTaskContext
// >(pipelineLookup?: string): ListrTask<TContext> {
//   return {
//     title: 'Select pipeline',
//     task: async (ctx, task) => {
//       ctx.PipelineLookup = pipelineLookup || '';

//       if (!ctx.PipelineLookup) {
//         ctx.PipelineLookup = await task.prompt([
//           {
//             type: 'eac:env:pipelines|select',
//             eac: ctx.EaC,
//           } as any,
//         ]);
//       }

//       if (ctx.PipelineLookup) {
//         task.title = `Pipeline selected: ${ctx.PipelineLookup}`;
//       } else {
//         throw new Error('Pipeline lookup is required');
//       }
//     },
//   };
// }

// export function ensureSourceTask<
//   TContext extends EaCTaskContext & SourceTaskContext
// >(sourceLookup?: string): ListrTask<TContext> {
//   return {
//     title: 'Select source',
//     task: async (ctx, task) => {
//       ctx.SourceLookup = sourceLookup || '';

//       if (!ctx.SourceLookup) {
//         ctx.SourceLookup = await task.prompt([
//           {
//             type: 'eac:env:sources|select',
//             eac: ctx.EaC,
//           } as any,
//         ]);
//       }

//       if (ctx.SourceLookup) {
//         task.title = `Source selected: ${ctx.SourceLookup}`;
//       } else {
//         throw new Error('Source lookup is required');
//       }
//     },
//   };
// }

// export function ensureSourceControl<
//   TContext extends ActiveEnterpriseTaskContext &
//     EaCTaskContext &
//     GitHubTaskContext &
//     SourceTaskContext
// >(configDir: string): ListrTask<TContext> {
//   return {
//     title: 'Create cloud subscription connection',
//     task: async (ctx, task) => {
//       let sourceLookup = `github://${ctx.GitHubOrganization}/${ctx.GitHubRepository}`;

//       if (!sourceLookup) {
//         const draft: EaCDraft =
//           (await withEaCDraft(configDir, ctx.ActiveEnterpriseLookup)) ||
//           ({} as EaCDraft);

//         const env =
//           ctx.EaC.Environments![ctx.EaC.Enterprise!.PrimaryEnvironment!];

//         const draftEnv = draft.EaC.Environments
//           ? draft.EaC.Environments![ctx.EaC.Enterprise!.PrimaryEnvironment!]
//           : {};

//         const sourceLookups = Object.keys({
//           ...env?.Sources,
//           ...draftEnv?.Sources,
//         });

//         sourceLookup = await ensurePromptValue(
//           task,
//           'Choose source control',
//           sourceLookup,
//           sourceLookups.map((sl) => {
//             const drfatSource = (draftEnv?.Sources || {})[sl];

//             const sourceName = drfatSource?.Name || env.Sources![sl]?.Name;

//             const draftText = drfatSource ? color.yellow('draft') : '';

//             return {
//               message: `${sourceName} ${draftText}`,
//               name: sl,
//             };
//           }),
//           async () =>
//             `github://${ctx.GitHubOrganization}/${ctx.GitHubRepository}`
//         );
//       }

//       ctx.SourceLookup = sourceLookup || '';

//       task.title = `Selected source: ${
//         ctx.EaC.Projects![ctx.SourceLookup]?.Project?.Name || 'Creating New'
//       }`;
//     },
//   };
// }

export function ensureCloudTask<
  TContext extends EaCTaskContext & CloudTaskContext
>(cloudLookup?: string): ListrTask<TContext> {
  return {
    title: 'Select Cloud',
    task: async (ctx, task) => {
      ctx.CloudLookup = cloudLookup || '';

      if (!ctx.CloudLookup) {
        ctx.CloudLookup = await task.prompt([
          {
            type: 'eac:env:clouds|select',
            eac: ctx.EaC,
          } as any,
        ]);
      }

      if (ctx.CloudLookup) {
        task.title = `Cloud selected: ${ctx.CloudLookup}`;
      } else {
        throw new Error('Cloud lookup is required');
      }
    },
  };
}

export function ensureCloudResourceGroupTask<
  TContext extends EaCTaskContext &
    CloudTaskContext &
    CloudResourceGroupTaskContext
>(configDir: string, cloudResGroupLookup?: string): ListrTask<TContext> {
  return {
    title: 'Select Cloud Resource Group',
    task: async (ctx, task) => {
      ctx.CloudResourceGroupLookup = cloudResGroupLookup || '';

      if (!ctx.CloudResourceGroupLookup) {
        ctx.CloudResourceGroupLookup = await task.prompt([
          {
            type: 'eac:env:clouds:groups|select',
            eac: ctx.EaC,
            cloudLookup: ctx.CloudLookup,
          } as any,
        ]);
      }

      if (ctx.CloudResourceGroupLookup) {
        task.title = `Cloud Resource Group selected: ${ctx.CloudResourceGroupLookup}`;
      } else {
        throw new Error('Cloud Resource Group lookup is required');
      }
    },
  };
}

export async function ensureLicense(
  configDir: string,
  licenseType?: string
): Promise<EaCLicense[]> {
  const axios = await loadAxios(configDir);

  let config = {};

  if (licenseType !== undefined) {
    config = {
      params: { licenseType: licenseType },
    };
  }

  const response = await axios.get(`user/licenses`, config);

  if (response.data?.Model == null){
    throw new Error("You currently don't have an active license. Please visit https://fathym.com/dashboard/billing to purchase a license");
  }
  return response.data?.Model || [];
}
// export async function listEnterprises(
//   configDir: string
// ): Promise<{ [lookup: string]: EaCEnterpriseDetails }> {
//   const axios = await loadAxios(configDir);

//   const response = await axios.get('user/enterprises');

//   return response.data;
// }

export async function listEnterprises(
  configDir: string
): Promise<(EaCEnterpriseDetails & { Lookup: string })[]> {
  const axios = await loadAxios(configDir);

  const response = await axios.get(`user/enterprises`);

  return response.data?.Model || [];
}

export async function listLicenseTypes(configDir: string): Promise<string[]> {
  const axios = await loadAxios(configDir);

  const response = await axios.get(`enterprises/licenseTypes`);

  return response.data?.Model || [];
}

export async function listLicensesByEmail(
  configDir: string,
  licenseType?: string
): Promise<(EaCLicense & {Lookup: string}) []> {
  const axios = await loadAxios(configDir);

  let config = {};

  if (licenseType !== undefined) {
    config = {
      params: { licenseType: licenseType },
    };
  }

  const response = await axios.get(`user/licenses`, config);

  return response.data?.Model || [];
}

export async function loadEaC(
  configDir: string,
  entLookup: string
): Promise<EnterpriseAsCode> {
  const axios = await loadAxios(configDir);

  const response = await axios.get(`${entLookup}/eac`);

  return response.data?.Model || [];
}

export function loadEaCTask<
  TContext extends EaCTaskContext & ActiveEnterpriseTaskContext
>(configDir: string): ListrTask<TContext> {
  return {
    title: `Load EaC for active enterprise`,
    task: async (ctx, task) => {
      ctx.EaC = await loadEaC(configDir, ctx.ActiveEnterpriseLookup);
    },
  };
}

export async function setAzureSubTask<
  TContext extends SubscriptionTaskContext &
    AzureCLITaskContext &
    ActiveEnterpriseTaskContext
>(configDir: string): Promise<ListrTask<TContext, any>> {
  return {
    title: `Setting Azure Subscription`,
    task: (ctx, task) => {
      return task.newListr((parent) => [
        ensureAzureCliSetupTask(),
        {
          title: 'Select Azure Subscription',
          skip: (ctx) => !ctx.AzureCLIInstalled,
          task: async (ctx, task) => {
            const subsList: AzureSubscription[] = JSON.parse(
              (await runProc('az', ['account', 'list', '--refresh'])) || '[]'
            );

            subsList.unshift({
              id: '-- Create New Subscription --',
              name: '-- Create New Subscription --',
              tenantId: '',
            });

            const subCheck: string = (
              await task.prompt({
                type: 'Select',
                name: 'subId',
                message: 'Choose Azure subscription:',
                choices: subsList.map((account) => {
                  return {
                    message: `${account.name}`,
                    name: account.id,
                  };
                }),
                validate: (v) => Boolean(v),
              } as PromptOptions<true>)
            ).trim();

            ctx.SubscriptionID =
              subCheck === '-- Create New Subscription --' ? '' : subCheck;

            if (ctx.SubscriptionID) {
              const sub = subsList.find((al) => al.id === ctx.SubscriptionID);

              ctx.TenantID = sub?.tenantId || '';

              ctx.SubscriptionName = sub?.name || ctx.SubscriptionID;

              task.title = `Azure subscription selected: ${ctx.SubscriptionID}`;
            } else {
              task.title = `Creating azure subscription`;

              ctx.SubscriptionName = await task.prompt({
                type: 'input',
                name: 'subName',
                message: 'Enter name for new Azure subscription name:',
              });

              task.title = `Creating azure subscription: ${ctx.SubscriptionName}`;
              
              const sub = await createAzureSubscription(
                configDir,
                ctx.ActiveEnterpriseLookup,
                ctx.SubscriptionName
              );

              ctx.SubscriptionID = sub.id;

              ctx.SubscriptionName = sub.name;

              ctx.TenantID = sub.tenantId;

              ctx.ApplicationID = sub.appId;

              ctx.AuthKey = sub.authKey;
            
              // await runProc('az', ['account', 'list', '--refresh'])
              
              // await runProc('az', [
              //   'account',
              //   'set',
              //   `--subscription ${ctx.SubscriptionName}`,
              // ]);

              // //TODO: Hardcoded common MS Resource Provider registrations. Need to make this dynamic in the future
              // await runProc('az', [
              //   'provider', 
              //   'register', 
              //   '--namespace Microsoft.Compute']);
              
              // await runProc('az', [
              //   'provider', 
              //   'register', 
              //   '--namespace Microsoft.Network']);
            }             

            parent.title = `Azure subscription created: ${ctx.SubscriptionName}`;
          },
        },
      ]);
    },
  };
}

export async function uploadFile(
  inputFile: string,
  entLookup: string,
  filePath: string
): Promise<void> {
  const fileStream = await createReadStream(inputFile);

  const response = await axios({
    method: 'post',
    url: `${entLookup}/dfs${filePath}`,
    responseType: 'json',
    data: fileStream,
  });
}

export async function withEaCDraft(
  configDir: string,
  activeEntLookup?: string,
  action?: (config: Draft<EaCDraft>) => Promise<void>
): Promise<EaCDraft> {
  return withConfig<EaCDraft>('eac.draft.json', configDir, async (draft) => {
    if (activeEntLookup && draft?.EaC?.EnterpriseLookup !== activeEntLookup) {
      delete draft.EaC;

      delete draft.Description;

      delete draft.EaC;

      merge(
        {
          EaC: { EnterpriseLookup: activeEntLookup },
          HasChanges: false,
        },
        draft
      );
    }

    const workCheck = JSON.stringify(draft);

    await action?.(draft);

    draft.HasChanges = draft.HasChanges || workCheck !== JSON.stringify(draft);
  });
}

export type DraftEditOptions<TEaC> = {
  applyPatch?: (current: TEaC, draft: TEaC, patch: TEaC) => void;

  draftPatch?: () => TEaC | TEaC[] | undefined;

  prepare?: () => Promise<void>;
};

export type DraftContextEditOptions<TContext, TEaC> = {
  applyPatch?: (ctx: TContext, current: TEaC, draft: TEaC, patch: TEaC) => void;

  draftPatch?: (ctx: TContext) => TEaC | TEaC[] | undefined;

  enabled?: (ctx: TContext) => boolean;

  prompt?: (
    ctx: TContext,
    task: ListrTaskWrapper<TContext, typeof ListrRenderer>
  ) => void;
};

export async function withEaCDraftEdit<TEaC>(
  configDir: string,
  activeEntLookup: string | undefined,
  currentEaC: () => EnterpriseAsCode,
  draftPropertyPath: () => DepthOption[][],
  options?: DraftEditOptions<TEaC>
): Promise<EaCDraft> {
  return withEaCDraft(configDir, activeEntLookup, async (draft) => {
    let { applyPatch } = { ...options };

    const { draftPatch } = { ...options };

    let workEaC: EnterpriseAsCode = currentEaC();

    const draftPropsPath = draftPropertyPath();

    await options?.prepare?.();

    if (!applyPatch) {
      applyPatch = applyPatchDefault;
    }

    let patches = draftPatch?.() || ([{}] as TEaC[]);

    if (!Array.isArray(patches)) {
      patches = [patches];
    }

    draftPropsPath?.forEach((ensureDepth, i) => {
      let draftEaC: any = draft.EaC;

      let currentEaC: any = { ...workEaC };

      draftEaC = ensureDepthInitialized(draftEaC, ensureDepth);

      currentEaC = ensureDepthInitialized(currentEaC, ensureDepth);

      const patch: TEaC = patches[i];

      applyPatch?.(currentEaC, draftEaC, patch);
    });

    // Check if there are any changes
    draft.HasChanges = JSON.stringify(draft) !== JSON.stringify(draft);
  });
}

export function applyPatchDefault<TEaC>(
  current: TEaC,
  draftEdit: TEaC,
  patch: TEaC
): void {
  merge(removeUndefined<TEaC>(current), draftEdit);

  merge(removeUndefined<TEaC>(patch), draftEdit);
}

export function withEaCDraftEditTask<
  TContext extends ActiveEnterpriseTaskContext & EaCTaskContext,
  TEaC
>(
  title: string,
  configDir: string,
  draftPropertyPath: (ctx: TContext) => DepthOption[][],
  options?: DraftContextEditOptions<TContext, TEaC>
): ListrTask<TContext> {
  const { applyPatch, draftPatch } = { ...options };

  return {
    title,
    enabled: options?.enabled,
    task: async (ctx, task) => {
      await withEaCDraftEdit<TEaC>(
        configDir,
        ctx.ActiveEnterpriseLookup,
        () => ctx.EaC,
        () => draftPropertyPath(ctx),
        {
          applyPatch: applyPatch
            ? (current, draftEdit, patch) => {
                applyPatch?.(ctx, current, draftEdit, patch);
              }
            : undefined,
          draftPatch: draftPatch ? () => draftPatch?.(ctx) : undefined,
          prepare: async () => {
            await options?.prompt?.(ctx, task);
          },
        }
      );
    },
  };
}
