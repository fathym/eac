import {} from '@oclif/core';
import { ListrTask } from 'listr2';
import {} from '@semanticjs/common';
import { FathymCommand } from '../../../common/fathym-command';
import { ClosureInstruction } from '../../../common/ClosureInstruction';

export default class Create extends FathymCommand<any> {
  static description = `Used for creating a new source control.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [];

  static title = 'Create Source Control';

  protected async loadInstructions(): Promise<ClosureInstruction[]> {
    return [
      {
        Instruction: 'fathym eac sources --help',
        Description: `You can now manage more about your source control.`,
      },
    ];
  }

  protected async loadTasks(): Promise<ListrTask[]> {
    // const { args } = await this.parse(Create);

    return [
      {
        title: `Creating new source control`,
        task: (ctx, task) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              task.title = `New source control created`;

              resolve(true);
            }, 3000);
          });
        },
      },
    ];
  }
}
