import { runProc } from './task-helpers';
import loadAxios from './axios';

export interface GitHubTaskContext {
  GitHubBranches: string[];

  GitHubConnection: boolean;

  GitHubBranch: string;

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

export async function loadCurrentGitOrgRepo(
  separator: string = '/'
): Promise<string> {
  const remoteUrl = await runProc('git', ['remote', 'get-url', 'origin']);

  const match = remoteUrl.match(/http.*:\/\/.*\/(?<org>.*)\/(?<repo>.*)\.git/);

  const name = `${match![1]}${separator}${match![2]}`;

  return name;
}

export async function loadCurrentGitPackageName(): Promise<string> {
  const orgRepo = await loadCurrentGitOrgRepo();

  const name = `@${orgRepo}`;

  return name;
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

export async function isGitRepo<T>(): Promise<boolean> {
  try {
    await runProc('git', ['rev-parse', '--is-inside-git-dir']);
    // await runProc('git', ['rev-parse', '--git-dir']);
    // await runProc('git', ['rev-parse', '--is-inside-work-tree']);

    return true;
  } catch {
    return false;
  }
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
