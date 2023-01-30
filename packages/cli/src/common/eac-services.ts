import { EaCEnterpriseDetails, EnterpriseAsCode } from '@semanticjs/common';
import axios from 'axios';
import { createWriteStream } from 'fs-extra';
import { ListrTask } from 'listr2';
import loadAxios from './axios';
import { withConfig } from './config-helpers';
import { ActiveEnterpriseTaskContext, FathymTaskContext } from './core-helpers';
import { InstallLCURequest } from './InstallLCURequest';

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
