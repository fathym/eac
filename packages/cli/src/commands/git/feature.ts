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

export default class Feature extends FathymCommand<any> {
  static description = `Used for creating a feature branch from 'integration' in git.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [
    {
      name: 'name',
      required: true,
      description: 'Name for the new feature branch',
    },
  ];

  static title = 'Create Feature Branch';

  protected async loadTasks(): Promise<ListrTask[]> {
    const { args, flags } = await this.parse(Feature);

    const { name } = args;

    const { ci } = flags;

    const message = await ensureMessage('', ci);

    return [
      confirmGitRepo(),
      commitChanges(message),
      {
        title: 'Create new feature branch',
        task: async () => {
          await runProc(`git checkout`, [`-b feature/${name}`, 'integration']);
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
