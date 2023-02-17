import { Args } from '@oclif/core';
import { ListrTask } from 'listr2';
import {} from '@semanticjs/common';
import { FathymCommand } from '../../../common/fathym-command';
import { ClosureInstruction } from '../../../common/ClosureInstruction';
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
import { runProc } from '../../../common/task-helpers';
import { ensurePromptValue } from '../../../common/eac-services';
import loadAxios from '../../../common/axios';
import { FathymTaskContext } from '../../../common/core-helpers';
import { GitHubTaskContext } from '../../../common/git-helpers';

interface PatchTaskContext extends FathymTaskContext, GitHubTaskContext {}

export default class Patch extends FathymCommand<PatchTaskContext> {
  static description = `Used for creating a hotfix branch from 'main' in git.`;

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

  static title = 'Patch Hotfix Branch';

  protected async loadTasks(): Promise<ListrTask<PatchTaskContext>[]> {
    const { args, flags } = await this.parse(Patch);

    const { branch, organization, repository } = args;

    const { ci } = flags;

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
        'hotfix'
      ),
      pullRequest(this.config.configDir, 'hotfix', this.hotFixSkipCheck),
      pull(),
      fetchPrune(),
    ];
  }

  protected hotFixSkipCheck(ctx: PatchTaskContext): string | boolean {
    return ctx.GitHubBranch ? false : 'A hotfix/* branch is required';
  }
}
