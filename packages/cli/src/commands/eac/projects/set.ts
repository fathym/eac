import {} from '@oclif/core';
import { ListrTask } from 'listr2';
import {} from '@semanticjs/common';
import { FathymCommand } from '../../../common/fathym-command';
import { ClosureInstruction } from '../../../common/ClosureInstruction';

export default class LCU extends FathymCommand<any> {
  static description = `Used for setting an active project lookup for use in other commands.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = {};

  static title = 'Set Active Project';

  protected async loadTasks(): Promise<ListrTask[]> {
    // const { args } = await this.parse(LCU);

    return [
      {
        title: `Setting active project`,
        task: (ctx, task) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              task.title = `Active project set`;

              resolve(true);
            }, 3000);
          });
        },
      },
    ];
  }
}
