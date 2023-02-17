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
  pushOrigin,
} from '../../../common/git-tasks';
import { runProc } from '../../../common/task-helpers';
import { ensurePromptValue } from '../../../common/eac-services';
import loadAxios from '../../../common/axios';

export default class Patch extends FathymCommand<any> {
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

  static title = 'Create Hotfix Branch';

  protected async loadTasks(): Promise<ListrTask[]> {
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
        title: 'Create patch request',
        task: async (ctx, task) => {
          const axios = await loadAxios(this.config.configDir);

          await axios.post(``, {
            Organization: ctx.GitHubOrganization,
            Repository: ctx.GitHubRepository,
            Branch: ctx.GitHubBranch,
          });

          await runProc(`git checkout`, [`-b hotfix/${name}`, 'origin/main']);
        },
      },
      {
        title: 'Setting upstream for hotfix branch',
        task: async () => {
          await runProc(`git push`, [
            '--set-upstream origin',
            `hotfix/${name}`,
          ]);
        },
      },
    ];
  }
}
