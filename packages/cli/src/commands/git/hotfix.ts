import {} from '@oclif/core';
import { ListrTask } from 'listr';
import {} from '@semanticjs/common';
import { ClosureInstruction, FathymCommand } from '../../common/fathym-command';
import { confirmGitRepo } from '../../common/git-tasks';

export default class Hotfix extends FathymCommand {
  static description = `Used for creating a hotfix branch from 'main' in git.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [];

  static title = 'Create Hotfix Branch';

  protected async loadInstructions(): Promise<ClosureInstruction[]> {
    return [];
  }

  protected async loadTasks(): Promise<ListrTask[]> {
    return [
      confirmGitRepo(),
      {
        title: `Creating new hotfix branch from 'main'`,
        task: (ctx, task) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              task.title = `Hotfix branch created from 'main'`;

              resolve(true);
            }, 3000);
          });
        },
      },
    ];
  }
}
