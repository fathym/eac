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

export default class Feature extends FathymCommand {
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

  protected async loadInstructions(): Promise<ClosureInstruction[]> {
    return [];
  }

  protected async loadTasks(): Promise<ListrTask[]> {
    const { args } = await this.parse(Feature);

    const { name } = args;

    const message = await ensureMessage('');

    return [
      confirmGitRepo(),
      commitChanges(message),
      {
        title: 'Create new feature branch',
        task: async () => {
          await execa(`git checkout`, [`-b feature/${name}`, 'integration']);
        },
      },
      {
        title: 'Setting upstream for feature branch',
        task: async () => {
          await execa(`git push`, ['--set-upstream origin', `feature/${name}`]);
        },
      },
      pushOrigin(),
      fetchPrune(),
    ];
  }
}
