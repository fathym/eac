import { execa } from './task-helpers';
import inquirer from 'inquirer';

export async function ensureMessage(message: string): Promise<string> {
  if (!message && (await hasNotCommittedChanges())) {
    const { commitMessage } = await inquirer.prompt({
      type: 'input',
      name: 'commitMessage',
      message: 'Enter commit message:',
    });

    message = commitMessage || (await ensureMessage(message));
  }

  return message;
}

export async function getCurrentBranch(): Promise<string> {
  const currentBranch = await execa('git', ['rev-parse', '--abbrev-ref HEAD']);

  return currentBranch;
}

export async function hasCommittedChanges(): Promise<boolean> {
  const stdout = await execa('git', ['status', '--porcelain']);

  return stdout === '';
}

export async function hasNotCommittedChanges(): Promise<boolean> {
  const stdout = await execa('git', ['status', '--porcelain']);

  return stdout !== '';
}

export async function remoteExists(branch: string): Promise<boolean> {
  const exists = await execa('git', ['ls-remote', '--heads origin', branch]);

  return Boolean(exists);
}
