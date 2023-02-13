import {} from '@oclif/core';
import { ListrTask } from 'listr2';
import {} from '@semanticjs/common';
import { FathymCommand } from '../../../common/fathym-command';
import { ClosureInstruction } from '../../../common/ClosureInstruction';

export default class Create extends FathymCommand<any> {
  static description = `Used for creating a new DFS modifier.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = {};

  static title = 'Create DFS Modifier';

  protected async loadTasks(): Promise<ListrTask[]> {
    // const { args } = await this.parse(Create);

    return [
      {
        title: `Creating new DFS modifier`,
        task: (ctx, task) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              task.title = `New DFS modifier created`;

              resolve(true);
            }, 3000);
          });
        },
      },
    ];
  }
}