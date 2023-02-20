import { ListrTask } from 'listr2';
import loadAxios from './axios';
import { ensurePromptValue } from './core-helpers';
import {
  getCurrentBranch,
  GitHubTaskContext,
  hasCommittedChanges,
  hasGitHubConnection,
  hasNotCommittedChanges,
  isGitRepo,
  listGitHubBranches,
  listGitHubOrganizations,
  listGitHubRepositories,
  loadCurrentGitOrgRepo,
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

export function configureRepository<TContext extends GitHubTaskContext>(
  configDir: string,
  license?: string
): ListrTask<TContext> {
  return {
    title: 'Initialize Repository',
    task: async (ctx, task) => {
      task.title = `Initialize Repository: @${ctx.GitHubOrganization}/${ctx.GitHubRepository}`;

      license = (await ensurePromptValue(
        task,
        'Select the license type to initialize with',
        license,
        [
          {
            message: 'MIT License',
            name: 'mit',
          },
          {
            message: 'Apache License 2.0',
            name: 'apache',
          },
          {
            message: 'GNU General Public License v3.0',
            name: 'gpl3',
          },
        ],
        async () => {
          return (await ensurePromptValue(
            task,
            'Enter custom license template name',
            '',
            undefined,
            async () => {
              return '';
            },
            '- No Template -'
          )) as string;
        },
        '- Custom Entry -'
      )) as string;

      const axios = await loadAxios(configDir);

      const response = await axios.post(
        `github/organizations/${ctx.GitHubOrganization}/repositories/${ctx.GitHubRepository}/configure`,
        {
          License: license,
        }
      );
    },
  };
}

export function confirmGitRepo<T>(): ListrTask<T> {
  return {
    title: 'Check valid Git repository',
    task: async () => {
      const gitRepo = await isGitRepo();

      if (!gitRepo) {
        throw new Error('Not a Git repository');
      }
    },
  };
}

export function commitGitChanges(message?: string): ListrTask {
  return {
    title: 'Committing uncommitted changes',
    skip: () => hasCommittedChanges(),
    task: async (ctx, task) => {
      if (await hasNotCommittedChanges()) {
        message = (await ensurePromptValue(
          task,
          'Enter commit message:',
          message
        )) as string;
      }

      await runProc('git', ['add', '-A']);

      await runProc('git', ['commit', '-a', '-m', `"${message}"`]);
    },
  };
}

export function ensureBranch<TContext extends GitHubTaskContext>(
  configDir: string,
  ctxSet: (ctx: TContext, value?: string) => void,
  branch?: string,
  enabled?: (ctx: TContext) => boolean,
  skipLocal?: boolean,
  filter?: 'feature' | 'hotfix' | 'branches'
): ListrTask<TContext> {
  return {
    title: `Ensuring branch set`,
    enabled: enabled,
    task: async (ctx, task) => {
      const branchFilter = (branch = '') => {
        return (
          !filter ||
          (filter === 'branches' && ctx.GitHubBranches?.includes(branch)) ||
          branch.indexOf(`${filter}`) === 0
        );
      };

      if (!branch) {
        let branches = await listGitHubBranches(
          configDir,
          ctx.GitHubOrganization,
          ctx.GitHubRepository
        );

        branches = branches || [];

        branches = branches.filter((branch) => branchFilter(branch?.Name));

        if (branches.length > 0) {
          const gitRepo = await isGitRepo();

          branch = (await ensurePromptValue(
            task,
            'Choose GitHub branches:',
            '',
            branches.map((org) => org.Name),
            gitRepo && !skipLocal
              ? async () => {
                  if (!skipLocal && gitRepo) {
                    branch = await getCurrentBranch();
                  }

                  return branch || '';
                }
              : undefined,
            '- Use Local -'
          )) as string;
        }
      }

      if (!branchFilter(branch)) {
        throw new Error(
          `A ${filter}/* branch is required. Provided branch: ${branch}`
        );
      }

      ctxSet(ctx, branch?.trim());

      task.title = `GitHub branch set to ${branch}`;
    },
  };
}

export function ensureBranches<TContext extends GitHubTaskContext>(
  configDir: string,
  ctxSet: (ctx: TContext, value?: string) => void,
  branches?: string[],
  enabled?: (ctx: TContext) => boolean,
  skipLocal?: boolean
): ListrTask<TContext> {
  return {
    title: `Ensuring branch set`,
    enabled: enabled,
    task: async (ctx, task) => {
      if (!branches) {
        let branchOptions = await listGitHubBranches(
          configDir,
          ctx.GitHubOrganization,
          ctx.GitHubRepository
        );

        branchOptions = branchOptions || [];

        branchOptions.unshift({ Name: 'qa/**' });
        branchOptions.unshift({ Name: 'hotfix/**' });
        branchOptions.unshift({ Name: 'feature/**' });
        branchOptions.unshift({ Name: 'integration' });
        branchOptions.unshift({ Name: 'main' });

        const branchNames = Array.from(
          new Set(branchOptions.map((bo) => bo.Name)).values()
        );

        if (branchNames.length > 0) {
          ctx.GitHubBranches = (await ensurePromptValue(
            task,
            'Choose GitHub branch (space bar to select multiple):',
            '',
            branchNames,
            undefined,
            undefined,
            'multiselect'
          )) as string[];
        }
      }

      task.title = `GitHub branches set to ${branches}`;
    },
  };
}

export function ensureOrganization<TContext extends GitHubTaskContext>(
  configDir: string,
  organization?: string,
  enabled?: (ctx: TContext) => boolean,
  skipLocal?: boolean
): ListrTask<TContext> {
  return {
    title: `Ensuring organization set`,
    enabled: enabled,
    // enabled: enabled,
    task: async (ctx, task) => {
      if (!organization) {
        let orgs = await listGitHubOrganizations(configDir);

        orgs = orgs || [];

        if (orgs.length > 0) {
          organization = (await ensurePromptValue(
            task,
            'Choose GitHub organization:',
            organization,
            orgs.map((org) => org.Name),
            skipLocal
              ? undefined
              : async () => {
                  if (await isGitRepo()) {
                    const orgRepo = await (
                      await loadCurrentGitOrgRepo('|')
                    ).split('|');

                    return orgRepo[0];
                  }

                  const user = await loadGitUsername();

                  return user;
                },
            '- Use Local -'
          )) as string;
        }
      }

      ctx.GitHubOrganization = organization || '';

      task.title = `GitHub organization set to ${ctx.GitHubOrganization}`;
    },
  };
}

export function ensureRepository<TContext extends GitHubTaskContext>(
  configDir: string,
  repository?: string,
  enabled?: (ctx: TContext) => boolean,
  allowCreate?: boolean,
  skipLocal?: boolean
): ListrTask<TContext> {
  return {
    title: `Ensuring repository set`,
    enabled: enabled,
    // enabled: enabled,
    task: async (ctx, task) => {
      if (!repository) {
        let repos = await listGitHubRepositories(
          configDir,
          ctx.GitHubOrganization
        );

        repos = repos || [];

        if (repos.length > 0) {
          const gitRepo = await isGitRepo();

          repository = (await ensurePromptValue(
            task,
            'Choose GitHub repository:',
            repository,
            repos.map((org) => org.Name),
            allowCreate || (gitRepo && !skipLocal)
              ? async () => {
                  if (!skipLocal && gitRepo) {
                    const orgRepo = await (
                      await loadCurrentGitOrgRepo('|')
                    ).split('|');

                    return orgRepo[1] as string;
                  }

                  if (allowCreate) {
                    return (await ensurePromptValue(
                      task,
                      'Name of the new repository',
                      repository
                    )) as string;
                  }

                  return repository || '';
                }
              : undefined,
            gitRepo && !skipLocal ? '- Use Local -' : '- Create New -'
          )) as string;
        }
      }

      ctx.GitHubRepository = repository || '';

      task.title = `GitHub repository set to ${ctx.GitHubRepository}`;
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

export function pullRequest<TContext extends GitHubTaskContext>(
  configDir: string,
  type?: 'feature' | 'hotfix' | 'qa' | 'release'
): ListrTask<TContext> {
  let action = '';

  switch (type) {
    case 'feature': {
      action = 'integrate';

      break;
    }

    case 'hotfix': {
      action = 'integrate';

      break;
    }

    case 'qa': {
      action = 'stage';

      break;
    }

    case 'release': {
      action = 'release';

      break;
    }

    // No default
  }

  return {
    title: `${action} ${type}`,
    skip: (ctx) => {
      const skipType = type === 'feature' || type === 'hotfix';

      return !skipType || ctx.GitHubBranch
        ? false
        : `A ${type}/* branch is required`;
    },
    task: async (ctx, task) => {
      const axios = await loadAxios(configDir);

      task.title = `${action} ${ctx.GitHubBranch}`;

      const path = `/github/organizations/${ctx.GitHubOrganization}/repositories/${ctx.GitHubRepository}/${action}/${ctx.GitHubBranch}`;

      await axios.post(path, {});
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
