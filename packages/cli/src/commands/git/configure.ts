import { Args, Flags } from '@oclif/core';
import { ListrTask } from 'listr2';

import { FathymCommand } from '../../common/fathym-command';
import {
  ensureOrganization,
  ensureRepository,
  configureRepository,
} from '../../common/git-tasks';
import { FathymTaskContext } from '../../common/core-helpers';
import { GitHubTaskContext } from '../../common/git-helpers';

interface InitTaskcontext extends FathymTaskContext, GitHubTaskContext {}

export default class Init extends FathymCommand<InitTaskcontext> {
  static description = `Used for configuring a repository with best practices.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    license: Flags.string({
      char: 'l',
      description: 'The license to initialize the repo with.',
    }),
    skipLocal: Flags.boolean({
      char: 's',
      description: 'Whether or not to skip using the local git information.',
    }),
  };

  static args = {
    organization: Args.string({
      description: 'The organization to configure.',
    }),
    repository: Args.string({
      description: 'The repository to init.',
    }),
  };

  static title = 'Configure Repository';

  protected async loadTasks(): Promise<ListrTask<InitTaskcontext>[]> {
    const { args, flags } = await this.parse(Init);

    const { organization, repository } = args;

    const { ci, license, skipLocal } = flags;

    return [
      ensureOrganization(
        this.config.configDir,
        organization,
        undefined,
        skipLocal
      ),
      ensureRepository(
        this.config.configDir,
        repository,
        undefined,
        true,
        skipLocal
      ),
      configureRepository(this.config.configDir, license),
    ];
  }
}
