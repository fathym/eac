import { ListrTask } from 'listr';
import { execa } from './task-helpers';
// import inquirer from 'inquirer';

export function addChanges(): ListrTask {
  return {
    title: 'Add changes',
    skip: () => hasCommittedChanges(),
    task: async () => {
      await execa('git', ['add', '-A']);
    },
  };
}

export function confirmGitRepo(): ListrTask {
  return {
    title: 'Check valid Git repository',
    task: async () => {
      try {
        await execa('git', ['rev-parse', '--is-inside-git-dir']);
        // await execa('git', ['rev-parse', '--git-dir']);
        // await execa('git', ['rev-parse', '--is-inside-work-tree']);
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
      await execa('git', ['add', '-A']);

      await execa('git', ['commit', '-a', '-m', `"${commitMessage}"`]);
    },
  };
}

export function ensureOrganization(organization: string): ListrTask {
  return {
    title: `Ensuring organization`,
    task: async (ctx, task) => {
      if (!organization) {
        const user = (await execa('git', ['config', '--get user.name']))
          .toString()
          .trim();

        ctx.organization = user;
      }

      task.title = `Set organization to ${ctx.organization}`;
    },
  };
}

export function fetchChange(): ListrTask {
  return {
    title: 'Fetch changes',
    task: async () => {
      await execa('git', ['fetch', '--all']);
    },
  };
}

export function fetchPrune(): ListrTask {
  return {
    title: 'Fetch prune',
    task: async () => {
      await execa('git', ['fetch', '--prune']);
    },
  };
}

export async function hasCommittedChanges(): Promise<boolean> {
  const stdout = await execa('git', ['status', '--porcelain']);

  return stdout === '';
}

export function pullLatestIntegration(): ListrTask {
  return {
    title: 'Pull latest integration changes',
    task: async () => {
      await execa('git', ['checkout', 'integration']);

      await execa('git', ['pull', 'origin', 'integration']);
    },
  };
}

export function pushOrigin(): ListrTask {
  return {
    title: 'Push to origin',
    task: async () => {
      const currentBranch = await execa('git', [
        'rev-parse',
        '--abbrev-ref HEAD',
      ]);

      await execa('git', ['push', 'origin', currentBranch]);
    },
  };
}

export function pull(): ListrTask {
  return {
    title: 'Pull',
    task: async () => {
      const currentBranch = await execa('git', [
        'rev-parse',
        '--abbrev-ref HEAD',
      ]);

      const exists = await execa('git', [
        'ls-remote',
        '--heads origin',
        currentBranch,
      ]);

      if (!exists) {
        await execa(`git push`, ['--set-upstream origin', `feature/${name}`]);
      }

      await execa('git', ['pull']);
    },
  };
}

export function rebaseIntegration(): ListrTask {
  return {
    title: 'Rebase changes from integration',
    task: async () => {
      await execa('git', ['rebase', 'origin/integration']);
    },
  };
}
