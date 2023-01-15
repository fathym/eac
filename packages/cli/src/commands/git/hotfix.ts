import {} from '@oclif/core';
import { ListrTask } from 'listr';
import {} from '@semanticjs/common';
import { ClosureInstruction, FathymCommand } from '../../common/fathym-command';
import {
  commitChanges,
  confirmGitRepo,
  fetchPrune,
  pushOrigin,
} from '../../common/git-tasks';
import { execa } from '../../common/task-helpers';
import { ensureMessage } from '../../common/git-helpers';

export default class Hotfix extends FathymCommand {
  static description = `Used for creating a hotfix branch from 'main' in git.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [
    {
      name: 'name',
      required: true,
      description: 'Name for the new hotfix branch',
    },
  ];

  static title = 'Create Hotfix Branch';

  protected async loadInstructions(): Promise<ClosureInstruction[]> {
    return [];
  }

  protected async loadTasks(): Promise<ListrTask[]> {
    const { args } = await this.parse(Hotfix);

    const { name } = args;

    const message = await ensureMessage('');

    return [
      confirmGitRepo(),
      commitChanges(message),
      {
        title: 'Create new hotfix branch',
        task: async () => {
          await execa(`git checkout`, [`-b hotfix/${name}`, 'main']);
        },
      },
      {
        title: 'Setting upstream for hotfix branch',
        task: async () => {
          await execa(`git push`, ['--set-upstream origin', `hotfix/${name}`]);
        },
      },
      pushOrigin(),
      fetchPrune(),
    ];
  }
}
