import { Flags } from '@oclif/core';
// import { color } from '@oclif/color';
import Listr from 'listr';
import {} from '@semanticjs/common';
import { FathymCommand } from '../../common/fathym-command';

export default class List extends FathymCommand {
  static description = 'Used to list the current users available enterprises.';

  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> -f',
  ];

  static flags = {
    force: Flags.boolean({
      char: 'f',
      description:
        'Force authentication process to present sign in, even if the user is already authenticated.',
    }),
  };

  static args = [];

  public async run(): Promise<void> {
    const { flags } = await this.parse(List);

    const force = flags.force;

    this.title('Executing Fathym Authentication');

    let authenticated = false;

    const tasks = new Listr([
      {
        title: 'Opened browser for authentication',
        task: () => 'Opened',
      },
      {
        title: `${force ? 'Forcing' : 'Waiting for'} user to login`,
        task: (ctx, task) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              authenticated = true;

              task.title = 'User Logged In';

              resolve(authenticated);
            }, 3000);
          });
        },
      },
    ]);

    tasks
      .run()
      .then(() => {
        this.closure('Fathym Authentication Complete', [
          {
            Instruction: 'fathym eac --help',
            Description: `You can now access the EaC via CLI,
  to manage your enterprie setup.`,
          },
          {
            Instruction: 'fathym github auth',
            Description: `There is a lot we can do to help
  with your GitHub management.  Auth
  with GitHub and be ready to go.`,
          },
        ]);
      })
      .catch((error) => {
        this.debug(error);
      });
  }
}
