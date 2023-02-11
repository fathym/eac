import {} from '@oclif/core';
import { ListrTask } from 'listr2';
import {} from '@semanticjs/common';
import { FathymCommand } from '../../../../common/fathym-command';
import { ClosureInstruction } from '../../../../common/ClosureInstruction';

export default class Add extends FathymCommand<any> {
  static description = `Used for adding a DFS modifier to a application.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = {};

  static title = 'Add Application DFS Modifier';

  protected async loadTasks(): Promise<ListrTask[]> {
    // const { args } = await this.parse(Add);

    return [
      {
        title: `Adding DFS modifier to application`,
        task: (ctx, task) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              task.title = `DFS modifier added to application`;

              resolve(true);
            }, 3000);
          });
        },
      },
    ];
  }
}
