import { Args, Flags } from '@oclif/core';
import { ListrTask } from 'listr2';
import {} from '@semanticjs/common';
import { FathymCommand } from '../../common/fathym-command';
import { ClosureInstruction } from '../../common/ClosureInstruction';
import {
  commitGitChanges,
  confirmGitRepo,
  ensureOrganization,
  ensureRepository,
  fetchPrune,
  initializeRepository,
  pull,
  pushOrigin,
} from '../../common/git-tasks';
import { runProc } from '../../common/task-helpers';
import { FathymTaskContext } from '../../common/core-helpers';
import {
  GitHubTaskContext,
  loadCurrentGitOrgRepo,
} from '../../common/git-helpers';
import loadAxios from '../../common/axios';
import { ensurePromptValue } from '../../common/eac-services';

interface InitTaskcontext extends FathymTaskContext, GitHubTaskContext {}

export default class Init extends FathymCommand<InitTaskcontext> {
  static description = `Used for configuring a repository with best practices.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    license: Flags.string({
      char: 'l',
      description: 'The license to initialize the repo with on.',
    }),
    skipLocal: Flags.boolean({
      char: 's',
      description: 'Whether or not to skip using the local git information.',
    }),
  };

  static args = {
    organization: Args.string({
      description: 'The organization to init from.',
    }),
    repository: Args.string({
      description: 'The repository to init.',
    }),
  };

  static title = 'Initialize Repository';

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
      initializeRepository(this.config.configDir, license),
    ];
  }
}
