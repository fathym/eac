import {} from '@oclif/core';
import Listr from 'listr';
import {} from '@semanticjs/common';
import {
  ClosureInstruction,
  FathymCommand,
} from '../../../../common/fathym-command';

export default class Add extends FathymCommand {
  static description = `Used for adding a DFS modifier to a project.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [];

  static title = 'Add Project DFS Modifier';

  protected async loadInstructions(): Promise<ClosureInstruction[]> {
    return [];
  }

  protected async loadTasks(): Promise<Listr> {
    // const { args } = await this.parse(Add);

    return new Listr([
      {
        title: `Adding DFS modifier to project`,
        task: (ctx, task) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              task.title = `DFS modifier added to project`;

              resolve(true);
            }, 3000);
          });
        },
      },
    ]);
  }
}
