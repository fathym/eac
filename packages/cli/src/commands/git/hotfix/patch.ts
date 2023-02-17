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
      ensureOrganization(this.config.configDir, organization),
      ensureRepository(this.config.configDir, repository),
      ensureBranch(
        this.config.configDir,
        (ctx, value) => {
          ctx.GitHubMainBranch = value || '';
        },
        branch,
        undefined,
        false,
        'hotfix'
      ),
      {
        title: 'Patch hotfix',
        skip: this.hotFixSkipCheck,
        task: async (ctx, task) => {
          const axios = await loadAxios(this.config.configDir);

          task.title = `Patch ${ctx.GitHubMainBranch}`;

          await axios.post(``, {
            Organization: ctx.GitHubOrganization,
            Repository: ctx.GitHubRepository,
            Branch: ctx.GitHubMainBranch,
          });
        },
      },
      pull(),
      fetchPrune(),
    ];
  }

  protected hotFixSkipCheck(ctx: PatchTaskContext): string | boolean {
    return ctx.GitHubMainBranch ? false : 'A hotfix/* branch is required';
  }
}
