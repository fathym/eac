import {} from '@oclif/core';
import { ListrTask } from 'listr';
import {} from '@semanticjs/common';
import {
  ClosureInstruction,
  FathymCommand,
} from '../../../../common/fathym-command';

export default class Add extends FathymCommand {
  static description = `Used for adding an application to a project.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [];

  static title = 'Add Project Application';

  protected async loadInstructions(): Promise<ClosureInstruction[]> {
    return [
      {
        Instruction: 'fathym eac projects --help',
        Description: `You can now manage more about your project.`,
      },
    ];
  }

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
