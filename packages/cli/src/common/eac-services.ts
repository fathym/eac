import {
  EaCEnterpriseDetails,
  EaCLicense,
  EnterpriseAsCode,
} from '@semanticjs/common';
import axios from 'axios';
import { createWriteStream } from 'fs-extra';
import { ListrTask, PromptOptions } from 'listr2';
import loadAxios from './axios';
import { withConfig } from './config-helpers';
import {
  ActiveEnterpriseTaskContext,
  EaCRemovalsTaskContext,
  EaCTaskContext,
  FathymTaskContext,
} from './core-helpers';
import './prompts/eac-env-clouds-prompts';
import './prompts/eac-env-cloud-resource-groups-prompts';
import './prompts/az-sshkey-create-prompts';

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
  EaC: EnterpriseAsCode;

  HasChanges: boolean;

  Name: string;

  Description: string;
}

export async function withEaCDraft(
  configDir: string,
  activeEntLookup?: string,
  action?: (config: EaCDraft) => Promise<EaCDraft>
): Promise<EaCDraft> {
  return withConfig<EaCDraft>('eac.draft.json', configDir, async (draft) => {
    let workDraft = draft;

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

    let newDraft = { ...(action ? await action(workDraft) : workDraft) };

    const hasChanges =
      newDraft.HasChanges || workCheck !== JSON.stringify(newDraft);

    newDraft = { ...newDraft, HasChanges: hasChanges };

    return newDraft;
  });
}

export function ensureCloudTask<
  TContext extends EaCTaskContext & CloudTaskContext
>(configDir: string, cloudLookup?: string): ListrTask<TContext> {
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

export function azSshKeyCreateTask<
  TContext extends SSHKeyTaskContext & CloudResourceGroupTaskContext
>(): ListrTask<TContext> {
  return {
    title: 'Establish Azure SSH Key',
    task: async (ctx, task) => {
      ctx.SSHPublicKey = await task.prompt([
        {
          type: 'az:sshkey:create|confirm',
          resourceGroup: ctx.CloudResourceGroupLookup,
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

export function commitDraftTask(
  configDir: string,
  name: string,
  description: string
): ListrTask<ActiveEnterpriseTaskContext> {
  return {
    title: 'Commiting EaC Draft',
    task: async (ctx, task) => {
      const axios = await loadAxios(configDir);

      const eacDraft = await withEaCDraft(configDir);

      const response = await axios.post(
        `${ctx.ActiveEnterpriseLookup}/eac/commit`,
        {
          ...eacDraft,
          Name: name,
          Description: description || name,
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

  if (licenseType == null) {
    const response = await axios.get(`user/licenses`);

    return response.data?.Model || [];
  } else {
    const response = await axios.get(`user/licenses`, {
      params: { licenseType: licenseType },
    });

    return response.data?.Model || [];
  }
}
