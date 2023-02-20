import { Args } from '@oclif/core';
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
import { GitHubTaskContext } from '../../../common/git-helpers';

interface IntegrateTaskContext extends FathymTaskContext, GitHubTaskContext {}

export default class Integrate extends FathymCommand<IntegrateTaskContext> {
  static description = `Used for creating a feature branch from 'integration' in git.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = {
    organization: Args.string({
      description: 'The organization to patch from.',
    }),
    repository: Args.string({
      description: 'The repository to patch from.',
    }),
    branch: Args.string({
      description: 'The branch to patch from.',
    }),
  };

  static title = 'Integrate Feature Branch';

  protected async loadTasks(): Promise<ListrTask<IntegrateTaskContext>[]> {
    const { args, flags } = await this.parse(Integrate);

    const { branch, organization, repository } = args;

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
