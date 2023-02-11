import {} from '@oclif/core';
import { ListrTask } from 'listr2';
import {} from '@semanticjs/common';
import { FathymCommand } from '../../../../common/fathym-command';
import { ClosureInstruction } from '../../../../common/ClosureInstruction';

export default class Add extends FathymCommand<any> {
  static description = `Used for adding an application to a project.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = {};

  static title = 'Add Project Application';

  protected async loadTasks(): Promise<ListrTask[]> {
    // const { args } = await this.parse(Add);

    return [
      {
        title: `Adding application to project`,
        task: (ctx, task) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              task.title = `Application added to project`;

              resolve(true);
            }, 3000);
          });
        },
      },
    ];
  }
}
