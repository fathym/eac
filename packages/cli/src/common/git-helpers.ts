import { runProc } from './task-helpers';
import { prompt } from 'enquirer';

export async function ensureMessage(
  message: string,
  ci: boolean
): Promise<string> {
  if (!ci && !message && (await hasNotCommittedChanges())) {
    const { commitMessage } = await prompt<any>({
      type: 'input',
      name: 'commitMessage',
      message: 'Enter commit message:',
    });

    message = commitMessage || (await ensureMessage(message, ci));
  }

  return message;
}

export async function getCurrentBranch(): Promise<string> {
  const currentBranch = await runProc('git', [
    'rev-parse',
    '--abbrev-ref HEAD',
  ]);

  return currentBranch;
}

export async function hasCommittedChanges(): Promise<boolean> {
  const stdout = await runProc('git', ['status', '--porcelain']);

  return stdout === '';
}

export async function hasNotCommittedChanges(): Promise<boolean> {
  const stdout = await runProc('git', ['status', '--porcelain']);

  return stdout !== '';
}

export async function remoteExists(branch: string): Promise<boolean> {
  const exists = await runProc('git', ['ls-remote', '--heads origin', branch]);

  return Boolean(exists);
}
