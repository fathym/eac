import {} from '@oclif/core';
import { ListrTask } from 'listr2';
import {} from '@semanticjs/common';
import { FathymCommand } from '../../../common/fathym-command';
import { ClosureInstruction } from '../../../common/ClosureInstruction';

export default class LCU extends FathymCommand<any> {
  static description = `Used for creating a managing application LCU settings.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [];

  static title = 'Manage LCU Settings';

  protected async loadTasks(): Promise<ListrTask[]> {
    // const { args } = await this.parse(LCU);

    return [
      {
        title: `Updating application LCU settings`,
        task: (ctx, task) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              task.title = `Updated application LCU settings`;

              resolve(true);
            }, 3000);
          });
        },
      },
    ];
  }
}
