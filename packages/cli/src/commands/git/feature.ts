import { Args } from '@oclif/core';
import { ListrTask } from 'listr2';
import {} from '@semanticjs/common';
import { FathymCommand } from '../../common/fathym-command';
import { ClosureInstruction } from '../../common/ClosureInstruction';
import {
  commitGitChanges,
  confirmGitRepo,
  fetchPrune,
  pushOrigin,
} from '../../common/git-tasks';
import { runProc } from '../../common/task-helpers';
import { ensurePromptValue } from '../../common/eac-services';

export default class Feature extends FathymCommand<any> {
  static description = `Used for creating a feature branch from 'integration' in git.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = {
    name: Args.string({
      description: 'Name for the new feature branch.',
    }),
  };

  static title = 'Create Feature Branch';

  protected async loadTasks(): Promise<ListrTask[]> {
    const { args, flags } = await this.parse(Feature);

    let { name } = args;

    const { ci } = flags;

    return [
      confirmGitRepo(),
      commitGitChanges(''),
      {
        title: 'Create new feature branch',
        task: async (ctx, task) => {
          name = await ensurePromptValue(
            task,
            'What is the name of the feature branch?',
            name
          );

          await runProc(`git checkout`, [
            `-b feature/${name}`,
            'origin/integration',
          ]);
        },
      },
      {
        title: 'Setting upstream for feature branch',
        task: async () => {
          await runProc(`git push`, [
            '--set-upstream origin',
            `feature/${name}`,
          ]);
        },
      },
      pushOrigin(),
      fetchPrune(),
    ];
  }
}
