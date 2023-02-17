import { Args } from '@oclif/core';
import { ListrTask } from 'listr2';
import {} from '@semanticjs/common';
import { FathymCommand } from '../../../common/fathym-command';
import { ClosureInstruction } from '../../../common/ClosureInstruction';
import {
  commitGitChanges,
  confirmGitRepo,
  fetchPrune,
  pushOrigin,
} from '../../../common/git-tasks';
import { runProc } from '../../../common/task-helpers';
import { ensurePromptValue } from '../../../common/eac-services';
import { FathymTaskContext } from '../../../common/core-helpers';

export default class Hotfix extends FathymCommand<FathymTaskContext> {
  static description = `Used for creating a hotfix branch from 'main' in git.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = {
    name: Args.string({
      description: 'Name for the new hotfix branch.',
    }),
  };

  static title = 'Create Hotfix Branch';

  protected async loadTasks(): Promise<ListrTask<FathymTaskContext>[]> {
    const { args, flags } = await this.parse(Hotfix);

    let { name } = args;

    const { ci } = flags;

    return [
      confirmGitRepo(),
      commitGitChanges(),
      {
        title: 'Create new hotfix branch',
        task: async (ctx, task) => {
          name = await ensurePromptValue(
            task,
            'What is the name of the hotfix branch?',
            name
          );

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
      pushOrigin(),
      fetchPrune(),
    ];
  }
}
