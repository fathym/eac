import {} from '@oclif/core';
import { ListrTask } from 'listr2';
import {} from '@semanticjs/common';
import { FathymCommand } from '../../../common/fathym-command';
import { ClosureInstruction } from '../../../common/ClosureInstruction';

export default class Create extends FathymCommand<any> {
  static description = `Used for creating a new build pipeline.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [];

  static title = 'Create Build Pipeline';

  protected async loadInstructions(
    context: any
  ): Promise<ClosureInstruction[]> {
    return [
      {
        Instruction: 'fathym eac pipelines --help',
        Description: `You can now manage more about your build pipeline.`,
      },
    ];
  }

  protected async loadTasks(): Promise<ListrTask[]> {
    // const { args } = await this.parse(Create);

    return [
      {
        title: `Creating new build pipeline`,
        task: (ctx, task) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              task.title = `New build pipeline created`;

              resolve(true);
            }, 3000);
          });
        },
      },
    ];
  }
}
