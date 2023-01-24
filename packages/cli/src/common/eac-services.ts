import { EaCEnterpriseDetails, EnterpriseAsCode } from '@semanticjs/common';
import { ListrTask } from 'listr2';
import loadAxios from './axios';
import { withConfig } from './config-helpers';
import { InstallLCURequest } from './InstallLCURequest';

export class EaCDraft extends EnterpriseAsCode {}

export async function withEaCDraft(
  configDir: string,
  action?: (config: EaCDraft) => Promise<EaCDraft>
): Promise<EaCDraft> {
  return withConfig<EaCDraft>('eac.draft.json', configDir, action);
}

export function commitDraftTask<TData>(
  configDir: string,
  data: TData
): ListrTask {
  return {
    title: 'Commiting EaC Draft',
    task: async (ctx, task) => {
      const axios = await loadAxios(configDir);

      const response = await axios.post('eac/commit', data);

      const draftId = response.data;

      task.title = `EaC Draft Committed: ${draftId}`;
    },
  };
}

export async function listEnterprises(
  configDir: string
): Promise<{ [lookup: string]: EaCEnterpriseDetails }> {
  const axios = await loadAxios(configDir);

  const response = await axios.get('user/enterprises');

  return response.data;
}
