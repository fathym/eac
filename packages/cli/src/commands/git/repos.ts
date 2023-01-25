import { Flags } from '@oclif/core';
import { ListrTask } from 'listr2';
import open from 'open';
import {} from '@semanticjs/common';
import { FathymCommand } from '../../common/fathym-command';
import {
  listGitHubBranches,
  listGitHubOrganizations,
  listGitHubRepositories,
} from '../../common/git-helpers';
import { hasGitHubConnectionTask } from '../../common/git-tasks';
import { FathymTaskContext } from '../../common/core-helpers';

export default class Auth extends FathymCommand<FathymTaskContext> {
  static description = `Used for retrieving information about repositories including organizations, their repos and related branch information.`;

  static examples = [
    '<%= config.bin %> <%= command.id %> {organization} {repository} {branc}',
  ];

  static flags = {};

  static args = [
    { name: 'organization', required: false },
    { name: 'repository', required: false },
    { name: 'branch', required: false },
  ];

  static title = 'Git Authentication';

  protected async loadTasks(): Promise<ListrTask<FathymTaskContext>[]> {
    const { args, flags } = await this.parse(Auth);

    const { organization, repository, branch } = args;

    return [
      hasGitHubConnectionTask(this.config.configDir) as any,
      {
        title: 'Listing organizations',
        enabled: organization === undefined,
        task: async (ctx, task) => {
          const orgs = await listGitHubOrganizations(this.config.configDir);

          ctx.Fathym.Lookups = {
            name: 'Organization',
            lookups: [],
          };

          orgs.forEach((org) => {
            ctx.Fathym.Lookups?.lookups.push(org.Name);
          });

          task.title = 'Loaded user organizations';
        },
        options: { persistentOutput: true },
      },
      {
        title: `Listing repositories for ${organization}`,
        enabled: !!organization && repository === undefined,
        task: async (ctx, task) => {
          const repos = await listGitHubRepositories(
            this.config.configDir,
            organization
          );

          ctx.Fathym.Lookups = {
            name: 'Repository',
            lookups: [],
          };

          repos.forEach((repo) => {
            ctx.Fathym.Lookups?.lookups.push(repo.Name);
          });

          task.title = `Current user repositories for ${organization}:`;
        },
        options: { persistentOutput: true },
      },
      {
        title: `Listing branches for ${organization}/${repository}`,
        enabled: !!organization && !!repository && branch === undefined,
        task: async (ctx, task) => {
          const branches = await listGitHubBranches(
            this.config.configDir,
            organization,
            repository
          );

          ctx.Fathym.Lookups = {
            name: 'Branch',
            lookups: [],
          };

          branches.forEach((branch) => {
            ctx.Fathym.Lookups?.lookups.push(branch.Name);
          });

          task.title = `Current user branches for ${organization}/${repository}:`;
        },
        options: { persistentOutput: true },
      },
    ];
  }
}
