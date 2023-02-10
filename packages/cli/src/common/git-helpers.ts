import { runProc } from './task-helpers';
import { prompt } from 'enquirer';
import loadAxios from './axios';
import { loadApiRootUrl } from './core-helpers';
import { InstallLCURequest } from './InstallLCURequest';
import { ensurePromptValue } from './eac-services';

export interface GitHubTaskContext {
  GitHubConnection: boolean;

  GitHubOrganization: string;

  GitHubRepository: string;
}

export async function getCurrentBranch(): Promise<string> {
  const currentBranch = await runProc('git', [
    'rev-parse',
    '--abbrev-ref HEAD',
  ]);

  return currentBranch;
}

export async function loadGitUsername(): Promise<string> {
  const username = await runProc('git', ['config', '--get user.name']);

  return username?.toString()?.trim() || '';
}

export async function hasCommittedChanges(): Promise<boolean> {
  const stdout = await runProc('git', ['status', '--porcelain']);

  return stdout === '';
}

export async function hasNotCommittedChanges(): Promise<boolean> {
  const stdout = await runProc('git', ['status', '--porcelain']);

  return stdout !== '';
}

export async function hasGitHubConnection(configDir: string): Promise<boolean> {
  const axios = await loadAxios(configDir);

  const response = await axios.get(`github/connection/valid`);

  return response.data?.Status?.Code === 0 || false;
}

export async function listGitHubBranches(
  configDir: string,
  organization: string,
  repository: string
): Promise<any[]> {
  const axios = await loadAxios(configDir);

  const response = await axios.get(
    `github/organizations/${organization}/repositories/${repository}/branches`
  );

  return response.data?.Model || [];
}

export async function listGitHubRepositories(
  configDir: string,
  organization: string
): Promise<any[]> {
  const axios = await loadAxios(configDir);

  const response = await axios.get(
    `github/organizations/${organization}/repositories`
  );

  return response.data?.Model || [];
}

export async function listGitHubOrganizations(
  configDir: string
): Promise<any[]> {
  const axios = await loadAxios(configDir);

  const response = await axios.get(`github/organizations`);

  return response.data?.Model || [];
}

export async function remoteExists(branch: string): Promise<boolean> {
  const exists = await runProc('git', ['ls-remote', '--heads origin', branch]);

  return Boolean(exists);
}
