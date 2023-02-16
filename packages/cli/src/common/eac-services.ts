import {
  EaCEnterpriseDetails,
  EaCLicense,
  EnterpriseAsCode,
} from '@semanticjs/common';
import axios from 'axios';
import { readFile, createWriteStream, createReadStream } from 'fs-extra';
import {
  ListrRendererFactory,
  ListrTask,
  ListrTaskWrapper,
  PromptOptions,
} from 'listr2';
import loadAxios from './axios';
import { withConfig } from './config-helpers';
import {
  ActiveEnterpriseTaskContext,
  EaCRemovalsTaskContext,
  EaCTaskContext,
  FathymTaskContext,
  loadFileAsString,
} from './core-helpers';
import './prompts/az-sshkey-create-prompts';
import './prompts/eac-env-cloud-resource-groups-prompts';
import './prompts/eac-env-clouds-prompts';
import './prompts/eac-env-pipelines-prompts';
import './prompts/eac-env-sources-prompts';
import { Config } from '@oclif/core';
import { TcpNetConnectOpts } from 'node:net';
import FormData from 'form-data';

export interface CloudTaskContext {
  CloudLookup: string;
}

export interface PipelineTaskContext {
  PipelineLookup: string;
}

export interface SourceTaskContext {
  SourceLookup: string;
}

export interface CloudResourceGroupTaskContext {
  CloudResourceGroupLookup: string;
}

export interface SSHKeyTaskContext {
  SSHPublicKey: string;
}

export interface EaCDraft {
  EaC: EnterpriseAsCode;

  HasChanges: boolean;

  Name: string;

  Description: string;
}

export async function withEaCDraft(
  configDir: string,
  activeEntLookup?: string,
  action?: (config: EaCDraft) => Promise<EaCDraft>,
  ensureDepth?: string[]
): Promise<EaCDraft> {
  return withConfig<EaCDraft>('eac.draft.json', configDir, async (draft) => {
    let workDraft = { ...draft };

    if (
      activeEntLookup &&
      workDraft?.EaC?.EnterpriseLookup !== activeEntLookup
    ) {
      workDraft = {
        EaC: { EnterpriseLookup: activeEntLookup },
        HasChanges: false,
      } as EaCDraft;
    }

    const workCheck = JSON.stringify(workDraft);

    if (ensureDepth) {
      ensureDepthInitialized(workDraft.EaC, ensureDepth);
    }

    let newDraft = { ...(action ? await action(workDraft) : workDraft) };

    const hasChanges =
      newDraft.HasChanges || workCheck !== JSON.stringify(newDraft);

    newDraft = { ...newDraft, HasChanges: hasChanges };

    return newDraft;
  });
}

export function ensureDepthInitialized(
  obj: any,
  path: Array<string | number>
): void {
  if (path?.length > 0) {
    const [head, ...tail] = path;

    obj[head] = obj[head] || {};

    ensureDepthInitialized(obj[head], tail);
  }
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

export function commitDraftTask(
  configDir: string,
  message: string
): ListrTask<ActiveEnterpriseTaskContext> {
  return {
    title: 'Commiting EaC Draft',
    task: async (ctx, task) => {
      message = await ensurePromptValue(
        task,
        'Message for the EaC commit:',
        message
      );

      const axios = await loadAxios(configDir);

      const eacDraft = await withEaCDraft(configDir);

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
        throw new Error(resp.Status.Message);
      }
    },
  };
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

export async function ensurePromptValue<
  Ctx,
  Renderer extends ListrRendererFactory
>(
  task: ListrTaskWrapper<Ctx, Renderer>,
  message: string,
  value?: string,
  choices?:
    | string[]
    | { name: string | (() => string); message?: string | (() => string) }[],
  createValue?: () => Promise<string>,
  createText = '- Create new -'
): Promise<string> {
  if (!value) {
    if (createValue && choices) {
      if (typeof choices[0] === 'string') {
        choices.unshift(createText as any);
      } else {
        choices.unshift({
          message: createText,
          name: createText,
        } as any);
      }
    }

    value = (
      await task.prompt({
        type: choices?.length! > 0 ? 'select' : 'input',
        message: message,
        validate: (v) => !!createValue || Boolean(v),
        choices: choices,
      })
    ).trim();

    value = value === createText ? '' : value;
  }

  if (!value && createValue) {
    value = await createValue();
  }

  return value || '';
}

export function ensurePipelineTask<
  TContext extends EaCTaskContext & PipelineTaskContext
>(pipelineLookup?: string): ListrTask<TContext> {
  return {
    title: 'Select pipeline',
    task: async (ctx, task) => {
      ctx.PipelineLookup = pipelineLookup || '';

      if (!ctx.PipelineLookup) {
        ctx.PipelineLookup = await task.prompt([
          {
            type: 'eac:env:pipelines|select',
            eac: ctx.EaC,
          } as any,
        ]);
      }

      if (ctx.PipelineLookup) {
        task.title = `Pipeline selected: ${ctx.PipelineLookup}`;
      } else {
        throw new Error('Pipeline lookup is required');
      }
    },
  };
}

export function ensureSourceTask<
  TContext extends EaCTaskContext & SourceTaskContext
>(sourceLookup?: string): ListrTask<TContext> {
  return {
    title: 'Select source',
    task: async (ctx, task) => {
      ctx.SourceLookup = sourceLookup || '';

      if (!ctx.SourceLookup) {
        ctx.SourceLookup = await task.prompt([
          {
            type: 'eac:env:sources|select',
            eac: ctx.EaC,
          } as any,
        ]);
      }

      if (ctx.SourceLookup) {
        task.title = `Source selected: ${ctx.SourceLookup}`;
      } else {
        throw new Error('Source lookup is required');
      }
    },
  };
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
): Promise<EaCLicense[]> {
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
