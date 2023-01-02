import {} from '@oclif/core';
import Listr from 'listr';
import {} from '@semanticjs/common';
import {
  ClosureInstruction,
  FathymCommand,
} from '../../../common/fathym-command';

export default class LCU extends FathymCommand {
  static description = `Used for setting an active project lookup for use in other commands.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [{ name: 'appLookup', required: true }];

  static title = 'Set Active Project';

  protected async loadInstructions(): Promise<ClosureInstruction[]> {
    return [];
  }

  protected async loadTasks(): Promise<Listr> {
    // const { args } = await this.parse(LCU);

    return new Listr([
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
    ]);
  }
}
