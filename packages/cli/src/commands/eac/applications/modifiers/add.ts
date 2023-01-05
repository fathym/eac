import {} from '@oclif/core';
import { ListrTask } from 'listr';
import {} from '@semanticjs/common';
import {
  ClosureInstruction,
  FathymCommand,
} from '../../../../common/fathym-command';

export default class Add extends FathymCommand {
  static description = `Used for adding a DFS modifier to a application.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [];

  static title = 'Add Application DFS Modifier';

  protected async loadInstructions(): Promise<ClosureInstruction[]> {
    return [];
  }

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
