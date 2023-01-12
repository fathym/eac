// import express from 'express';
// import axios from 'axios';
import { EaCEnterpriseDetails, EnterpriseAsCode } from '@semanticjs/common';
import { ListrTask } from 'listr';
import loadAxios from './axios';
import { withConfig } from './config-helpers';

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

      const response = await axios.post(
        'http://localhost:8119/api/eac/commit',
        data
      );

      const draftId = response.data;

      task.title = `EaC Draft Committed: ${draftId}`;
    },
  };
}

export async function listEnterprises(
  configDir: string
): Promise<{ [lookup: string]: EaCEnterpriseDetails }> {
  const axios = await loadAxios(configDir);

  const response = await axios.get(
    // 'http://localhost:8119/api/user/enterprises'
    'http://localhost:7077/api/user/enterprises'
  );

  return response.data;
}

export async function getActiveEnterprise(
  configDir: string
): Promise<{ [lookup: string]: EaCEnterpriseDetails }> {
  const axios = await loadAxios(configDir);

  const response = await axios.get('http://localhost:8119/api/user/enterprise');

  return response.data;
}

export async function setActiveEnterprise(
  configDir: string,
  entLookup: string
): Promise<{ [lookup: string]: EaCEnterpriseDetails }> {
  const axios = await loadAxios(configDir);

  const response = await axios.post(
    'http://localhost:8119/api/user/enterprise',
    {
      EnterpriseLookup: entLookup,
    }
  );

  return response.data;
}
