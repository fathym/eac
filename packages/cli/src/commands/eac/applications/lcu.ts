import {} from '@oclif/core';
import Listr from 'listr';
import {} from '@semanticjs/common';
import {
  ClosureInstruction,
  FathymCommand,
} from '../../../common/fathym-command';

export default class LCU extends FathymCommand {
  static description = `Used for creating a managing application LCU settings.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [];

  static title = 'Manage LCU Settings';

  protected async loadInstructions(): Promise<ClosureInstruction[]> {
    return [
      {
        Instruction: 'fathym eac applications security --help',
        Description: `You can manage more about your application.`,
      },
    ];
  }

  protected async loadTasks(): Promise<Listr> {
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
