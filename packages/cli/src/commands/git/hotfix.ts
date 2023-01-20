import {} from '@oclif/core';
import { ListrTask } from 'listr2';
import {} from '@semanticjs/common';
import { FathymCommand } from '../../common/fathym-command';
import { ClosureInstruction } from '../../common/ClosureInstruction';
import {
  commitChanges,
  confirmGitRepo,
  fetchPrune,
  pushOrigin,
} from '../../common/git-tasks';
import { runProc } from '../../common/task-helpers';
import { ensureMessage } from '../../common/git-helpers';

export default class Hotfix extends FathymCommand<any> {
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

  protected async loadTasks(): Promise<ListrTask[]> {
    const { args, flags } = await this.parse(Hotfix);

    const { ci, name } = args;

    const message = await ensureMessage('', ci);

    return [
      confirmGitRepo(),
      commitChanges(message),
      {
        title: 'Create new hotfix branch',
        task: async () => {
          await runProc(`git checkout`, [`-b hotfix/${name}`, 'main']);
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
