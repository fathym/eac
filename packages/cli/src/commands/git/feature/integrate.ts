import { Args, Flags } from '@oclif/core';
import { ListrTask } from 'listr2';
import { FathymCommand } from '../../../common/fathym-command';
import {
  commitGitChanges,
  confirmGitRepo,
  ensureBranch,
  ensureOrganization,
  ensureRepository,
  fetchPrune,
  pull,
  pullRequest,
  pushOrigin,
} from '../../../common/git-tasks';
import { FathymTaskContext } from '../../../common/core-helpers';
import {
  getCurrentBranch,
  GitHubTaskContext,
  loadCurrentGitOrgRepo,
} from '../../../common/git-helpers';

interface IntegrateTaskContext extends FathymTaskContext, GitHubTaskContext {}

export default class Integrate extends FathymCommand<IntegrateTaskContext> {
  static description = `Used for integrating a feature branch into 'integration' in git.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    useLocal: Flags.boolean({
      description: 'Whether to use local git information for args.',
    }),
  };

  static args = {
    organization: Args.string({
      description: 'The organization to integrate from.',
    }),
    repository: Args.string({
      description: 'The repository to integrate from.',
    }),
    branch: Args.string({
      description: 'The branch to integrate from.',
    }),
  };

  static title = 'Integrate Feature Branch';

  protected async loadTasks(): Promise<ListrTask<IntegrateTaskContext>[]> {
    const { args, flags } = await this.parse(Integrate);

    let { branch, organization, repository } = args;

    const { useLocal } = flags;

    if (useLocal) {
      const orgRepo = await (await loadCurrentGitOrgRepo('|')).split('|');

      if (!organization) {
        organization = orgRepo[0];
      }

      if (!repository) {
        repository = orgRepo[1];
      }

      if (!branch) {
        branch = await getCurrentBranch();
      }
    }

    return [
      confirmGitRepo(),
      commitGitChanges(),
      pushOrigin(),
      ensureOrganization(this.config.configDir, organization),
      ensureRepository(this.config.configDir, repository),
      ensureBranch(
        this.config.configDir,
        (ctx, value) => {
          ctx.GitHubBranch = value || '';
        },
        branch,
        undefined,
        false,
        'feature'
      ),
      pullRequest(this.config.configDir, 'feature'),
      pull(),
      fetchPrune(),
    ];
  }
}
