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

export default class Auth extends FathymCommand<any> {
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

  protected async loadTasks(): Promise<ListrTask[]> {
    const { args, flags } = await this.parse(Auth);

    const { organization, repository, branch } = args;

    return [
      hasGitHubConnectionTask(this.config.configDir),
      {
        title: 'Listing organizations',
        enabled: !organization,
        task: async (ctx, task) => {
          const orgs = await listGitHubOrganizations(this.config.configDir);

          orgs.forEach((org) => {
            task.output = JSON.stringify(org);
          });

          task.title = 'Current user organizations:';
        },
        options: { persistentOutput: true },
      },
      {
        title: `Listing repositories for ${organization}`,
        enabled: organization && !repository,
        task: async (ctx, task) => {
          const repos = await listGitHubRepositories(
            this.config.configDir,
            organization
          );

          repos.forEach((repo) => {
            task.output = JSON.stringify(repo);
          });

          task.title = `Current user repositories for ${organization}:`;
        },
        options: { persistentOutput: true },
      },
      {
        title: `Listing branches for ${organization}/${repository}`,
        enabled: organization && repository && !branch,
        task: async (ctx, task) => {
          const repos = await listGitHubBranches(
            this.config.configDir,
            organization,
            repository
          );

          repos.forEach((repo) => {
            task.output = JSON.stringify(repo);
          });

          task.title = `Current user branches for ${organization}/${repository}:`;
        },
        options: { persistentOutput: true },
      },
    ];
  }
}
