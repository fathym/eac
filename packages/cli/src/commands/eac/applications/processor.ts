import {} from '@oclif/core';
import { ListrTask } from 'listr';
import {} from '@semanticjs/common';
import {
  ClosureInstruction,
  FathymCommand,
} from '../../../common/fathym-command';

export default class Processor extends FathymCommand {
  static description = `Used for creating a managing application Processor settings.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [];

  static title = 'Manage Processor Settings';

  protected async loadInstructions(): Promise<ClosureInstruction[]> {
    return [
      {
        Instruction: 'fathym eac applications security --help',
        Description: `You can manage more about your application.`,
      },
    ];
  }

  protected async loadTasks(): Promise<ListrTask[]> {
    // const { args } = await this.parse(Processor);

    return [
      {
        title: `Updating application Processor settings`,
        task: (ctx, task) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              task.title = `Updated application Processor settings`;

              resolve(true);
            }, 3000);
          });
        },
      },
    ];
  }
}
