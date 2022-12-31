import {} from '@oclif/core';
import Listr from 'listr';
import {} from '@semanticjs/common';
import { FathymCommand } from '../../common/fathym-command';

export default class Out extends FathymCommand {
  static description =
    'Used to sign out, so your CLI will NOT work with the EaC and other features.';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [];

  public async run(): Promise<void> {
    this.title('Executing Fathym Sign Out');

    const tasks = new Listr([
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
    ]);

    tasks
      .run()
      .then(() => {
        this.closure('Fathym Sign Out Complete', [
          {
            Instruction: 'fathym auth',
            Description: `Use this to sign back in.`,
          },
        ]);
      })
      .catch((error) => {
        this.debug(error);
      });
  }
}
