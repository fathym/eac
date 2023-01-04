import {} from '@oclif/core';
import Listr from 'listr';
import {} from '@semanticjs/common';
import {
  ClosureInstruction,
  FathymCommand,
} from '../../../../common/fathym-command';

export default class Preview extends FathymCommand {
  static description = `Used for getting a preview link to a project application.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [];

  static title = 'Project Application Preview';

  protected async loadInstructions(): Promise<ClosureInstruction[]> {
    return [
      {
        Instruction: 'fathym eac projects --help',
        Description: `You can now manage more about your project.`,
      },
    ];
  }

  protected async loadTasks(): Promise<Listr> {
    // const { args } = await this.parse(Preview);

    return [
      {
        title: `Loading preview URL for project application`,
        task: (ctx, task) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              task.title = `Project application preview URL loaded successfully`;

              resolve(true);
            }, 3000);
          });
        },
      },
    ];
  }
}
