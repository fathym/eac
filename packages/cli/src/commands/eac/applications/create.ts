import {} from '@oclif/core';
import { ListrTask } from 'listr2';
import {} from '@semanticjs/common';
import { FathymCommand } from '../../../common/fathym-command';
import { ClosureInstruction } from '../../../common/ClosureInstruction';

export default class Create extends FathymCommand<any> {
  static description = `Used for creating a new application.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [];

  static title = 'Create Application';

  protected async loadInstructions(
    context: any
  ): Promise<ClosureInstruction[]> {
    return [
      {
        Instruction: 'fathym eac applications lcu --help',
        Description: `You can now manage more about your application.`,
      },
      {
        Instruction: 'fathym eac applications processor --help',
        Description: `You can now manage more about your application.`,
      },
    ];
  }

  protected async loadTasks(): Promise<ListrTask[]> {
    // const { args } = await this.parse(Create);

    return [
      {
        title: `Creating new application`,
        task: (ctx, task) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              task.title = `New application created`;

              resolve(true);
            }, 3000);
          });
        },
      },
    ];
  }
}
