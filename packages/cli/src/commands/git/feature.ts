import {} from '@oclif/core';
import Listr from 'listr';
import {} from '@semanticjs/common';
import { ClosureInstruction, FathymCommand } from '../../common/fathym-command';

export default class Feature extends FathymCommand {
  static description = `Used for creating a feature branch from 'integration' in git.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [];

  static title = 'Create Feature Branch';

  protected async loadInstructions(): Promise<ClosureInstruction[]> {
    return [];
  }

  protected async loadTasks(): Promise<Listr> {
    return new Listr([
      {
        title: `Creating new feature branch from 'integration'`,
        task: (ctx, task) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              task.title = `Feature branch created from 'integration'`;

              resolve(true);
            }, 3000);
          });
        },
      },
    ]);
  }
}
