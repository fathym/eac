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
import { FathymTaskContext } from '../../../common/core-helpers';
import { GitHubTaskContext } from '../../../common/git-helpers';
import loadAxios from '../../../common/axios';

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
          ctx.GitHubMainBranch = value || '';
        },
        branch,
        undefined,
        false,
        'feature'
      ),
      {
        title: 'Integrate feature',
        skip: this.featureSkipCheck,
        task: async (ctx, task) => {
          const axios = await loadAxios(this.config.configDir);

          task.title = `Integrate ${ctx.GitHubMainBranch}`;

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

  protected featureSkipCheck(ctx: IntegrateTaskContext): string | boolean {
    return ctx.GitHubMainBranch ? false : 'A feature/* branch is required';
  }
}
