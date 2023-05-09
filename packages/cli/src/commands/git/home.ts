import { ListrTask } from 'listr2';
import { FathymCommand } from '../../common/fathym-command';
import { FathymTaskContext } from '../../common/core-helpers';
import open from 'open';
import { Args, Flags } from '@oclif/core';
import { ensureOrganization, ensureRepository } from '../../common/git-tasks';
import {
  GitHubTaskContext,
  loadCurrentGitOrgRepo,
} from '../../common/git-helpers';

interface HomeTaskContext extends FathymTaskContext, GitHubTaskContext {}

export default class Home extends FathymCommand<HomeTaskContext> {
  static description = 'Used to open the repo home.';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    section: Flags.string({
      char: 's',
      description: 'The section to open.',
    }),
    useLocal: Flags.boolean({
      char: 'l',
      description: 'Whether to use local git information for args.',
    }),
  };

  static args = {
    organization: Args.string({
      description: 'The organization to open.',
    }),
    repository: Args.string({
      description: 'The repository to open.',
    }),
  };

  static title = 'Open Config';

  protected async loadTasks(): Promise<ListrTask<HomeTaskContext>[]> {
    const { args, flags } = await this.parse(Home);

    let { organization, repository } = args;

    const { section, useLocal } = flags;

    if (useLocal) {
      const orgRepo = await (await loadCurrentGitOrgRepo('|')).split('|');

      if (!organization) {
        organization = orgRepo[0];
      }

      if (!repository) {
        repository = orgRepo[1];
      }
    }

    return [
      ensureOrganization(this.config.configDir, organization),
      ensureRepository(this.config.configDir, repository),
      {
        title: `Open git home`,
        task: async (ctx, task) => {
          const secPart = section ? `/${section}` : '';

          const path = `https://github.com/${ctx.GitHubOrganization}/${ctx.GitHubRepository}${secPart}`;

          await open(path);
        },
      },
    ];
  }
}
