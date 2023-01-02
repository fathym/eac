import {} from '@oclif/core';
import Listr from 'listr';
import {} from '@semanticjs/common';
import { ClosureInstruction, FathymCommand } from '../../common/fathym-command';

export default class Commit extends FathymCommand {
  static description = `Used for commiting changes to the EaC.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [{ name: 'message', required: true }];

  static title = 'EaC Commit';

  protected async loadInstructions(): Promise<ClosureInstruction[]> {
    return [
      {
        Instruction: 'fathym eac projects applications preview --help',
        Description: `Load previews for any of your deployed applications.`,
      },
    ];
  }

  protected async loadTasks(): Promise<Listr> {
    const { args } = await this.parse(Commit);

    return new Listr([
      {
        title: `Committing EaC: ${args.message}`,
        task: (ctx, task) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              task.title = `EaC committed`;

              resolve(true);
            }, 3000);
          });
        },
      },
    ]);
  }
}
