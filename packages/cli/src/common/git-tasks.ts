import { ListrTask, PromptOptions } from 'listr2';
import loadAxios from './axios';
import {
  getCurrentBranch,
  GitHubTaskContext,
  hasCommittedChanges,
  hasGitHubConnection,
  listGitHubOrganizations,
  loadGitUsername,
  remoteExists,
} from './git-helpers';
import { runProc } from './task-helpers';

export function addChanges<T>(): ListrTask<T> {
  return {
    title: 'Add changes',
    skip: () => hasCommittedChanges(),
    task: async () => {
      await runProc('git', ['add', '-A']);
    },
  };
}

export function confirmGitRepo<T>(): ListrTask<T> {
  return {
    title: 'Check valid Git repository',
    task: async () => {
      try {
        await runProc('git', ['rev-parse', '--is-inside-git-dir']);
        // await runProc('git', ['rev-parse', '--git-dir']);
        // await runProc('git', ['rev-parse', '--is-inside-work-tree']);
      } catch {
        throw new Error('Not a Git repository');
      }
    },
  };
}

export function commitChanges(commitMessage: string): ListrTask {
  return {
    title: 'Committing uncommitted changes',
    skip: () => hasCommittedChanges(),
    task: async () => {
      await runProc('git', ['add', '-A']);

      await runProc('git', ['commit', '-a', '-m', `"${commitMessage}"`]);
    },
  };
}

export function ensureOrganization(
  configDir: string,
  organization: string
): ListrTask<GitHubTaskContext> {
  return {
    title: `Ensuring organization set`,
    task: async (ctx, task) => {
      if (!organization) {
        const orgs = await listGitHubOrganizations(configDir);

        if (orgs) {
          ctx.GitHubOrganization = (
            await task.prompt({
              type: 'List',
              name: 'organization',
              message: 'Choose GitHub organization:',
              choices: orgs,
              validate: (v) => v,
            } as PromptOptions<true>)
          ).trim();
        }

        const user = await loadGitUsername();

        organization = user;
      }

      ctx.GitHubOrganization = organization;

      task.title = `GitHub organization set to ${ctx.GitHubOrganization}`;
    },
  };
}

export function fetchChange<T>(): ListrTask<T> {
  return {
    title: 'Fetch changes',
    task: async () => {
      await runProc('git', ['fetch', '--all']);
    },
  };
}

export function fetchPrune<T>(): ListrTask<T> {
  return {
    title: 'Fetch prune',
    task: async () => {
      await runProc('git', ['fetch', '--prune']);
    },
  };
}

export function hasGitHubConnectionTask(
  configDir: string
): ListrTask<GitHubTaskContext> {
  return {
    title: 'Checking GitHub connection',
    task: async (ctx) => {
      ctx.GitHubConnection = await hasGitHubConnection(configDir);

      if (!ctx.GitHubConnection) {
        throw new Error(
          `You must authenticate with GitHub to continue.
  Use the 'fathym git auth' command.`
        );
      }
    },
  };
}

export function mergeIntegration<T>(): ListrTask<T> {
  return {
    title: 'Merge changes from integration',
    task: async () => {
      await runProc('git', ['merge', 'origin/integration']);
    },
  };
}

export function pullLatestIntegration<T>(): ListrTask<T> {
  return {
    title: 'Pull latest integration changes',
    task: async () => {
      await runProc('git', ['checkout', 'integration']);

      await runProc('git', ['pull', 'origin', 'integration']);
    },
  };
}

export function pushOrigin<T>(): ListrTask<T> {
  return {
    title: 'Push to origin',
    task: async () => {
      const currentBranch = await runProc('git', [
        'rev-parse',
        '--abbrev-ref HEAD',
      ]);

      await runProc('git', ['push', 'origin', currentBranch]);
    },
  };
}

export function pull<T>(): ListrTask<T> {
  return {
    title: 'Pull',
    task: async () => {
      const currentBranch = await getCurrentBranch();

      const exists = await remoteExists(currentBranch);

      if (!exists) {
        await runProc(`git push`, ['--set-upstream origin', `feature/${name}`]);
      }

      await runProc('git', ['pull']);
    },
  };
}

export function rebaseIntegration<T>(): ListrTask<T> {
  return {
    title: 'Rebase changes from integration',
    task: async () => {
      await runProc('git', ['rebase', 'origin/integration']);
    },
  };
}
