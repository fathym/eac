import {} from '@oclif/core';
import Listr from 'listr';
import {} from '@semanticjs/common';
import { ClosureInstruction, FathymCommand } from '../../common/fathym-command';

export default class Out extends FathymCommand {
  static description =
    'Used to sign out, so your CLI will NOT work with the EaC and other features.';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [];

  static title = 'Fathym Sign Out';

  protected async loadInstructions(): Promise<ClosureInstruction[]> {
    return [
      {
        Instruction: 'fathym auth',
        Description: `Use this to sign back in.`,
      },
    ];
  }

  protected async loadTasks(): Promise<Listr> {
    return [
      {
        title: 'Opened browser for sign out',
        task: () => 'Opened',
      },
      {
        title: `Waiting for sign out`,
        task: (ctx, task) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              task.title = 'User Signed Out';

              resolve(true);
            }, 3000);
          });
        },
      },
    ];
  }
}
