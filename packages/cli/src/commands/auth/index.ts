import { Flags } from '@oclif/core';
import Listr from 'listr';
import {} from '@semanticjs/common';
import { ClosureInstruction, FathymCommand } from '../../common/fathym-command';

export default class Auth extends FathymCommand {
  static description =
    'Used to start the authentication process with Fathym, so your CLI can work with the EaC and other features.';

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

  static title = 'Fathym Sign In';

  protected async loadInstructions(): Promise<ClosureInstruction[]> {
    return [
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
    ];
  }

  protected async loadTasks(): Promise<Listr> {
    const { flags } = await this.parse(Auth);

    return new Listr([
      {
        title: `Loading user sign in path`,
        task: (ctx, task) => {
          fetch('http://localhost:')
          return new Promise((resolve) => {
            setTimeout(() => {
              task.title = 'User sign in path loaded';

              ctx.signInPath = '';

              resolve(true);
            }, 3000);
          });
        },
      },
      {
        title: 'Opened browser for user sign in',
        task: () => 'Opened',
      },
      {
        title: `${flags.force ? 'Forcing' : 'Waiting for'} user to sign in`,
        task: (ctx, task) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              task.title = 'User Signed In';

              resolve(true);
            }, 3000);
          });
        },
      },
    ]);
  }
}
