import {} from '@oclif/core';
import { ListrTask } from 'listr';
import {} from '@semanticjs/common';
import { ClosureInstruction, FathymCommand } from '../../common/fathym-command';
import { commitChanges, confirmGitRepo } from '../../common/git-tasks';
import { execa } from '../../common/task-helpers';

export default class Feature extends FathymCommand {
  static description = `Used for creating a feature branch from 'integration' in git.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [];

  static title = 'Create Feature Branch';

  protected async loadInstructions(): Promise<ClosureInstruction[]> {
    return [];
  }

  protected async loadTasks(): Promise<ListrTask[]> {
    return [
      confirmGitRepo(),
      commitChanges(),
      {
        title: 'Create new feature branch',
        task: async () => {
          await execa(`git checkout`, [`-b feature/${name}`, 'integration']);
        },
      },
    ];
  }
}
