import { Flags } from '@oclif/core';
import Listr from 'listr';
import { ModuleOptions } from 'simple-oauth2';
import express from 'express';
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
    // force: Flags.boolean({
    //   char: 'f',
    //   description:
    //     'Force authentication process to present sign in, even if the user is already authenticated.',
    // }),
  };

  static args = [];

  static title = 'Fathym Sign In';

  static forceRefresh = false;

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

  protected async loadTasks(): Promise<Listr.ListrTask<any>[]> {
    const CurCmd = <typeof FathymCommand>this.constructor;

    // const { flags } = await this.parse(Auth);

    return [
      {
        title: `Loading user sign in path`,
        task: (ctx, task) => {
          // fetch('http://localhost:');
          return new Promise((resolve) => {
            setTimeout(() => {
              task.title = 'User sign in path loaded';

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
        title: `Waiting for user to sign in`,
        task: (ctx, task) => {
          return new Promise((resolve) => {
            const app = express();

            app.get('/oauth', async (req, res) => {
              const code = req.query.code as string;

              console.log(`Received authorization code: ${code}`);

              await this.requestAccessTokenAndStore(code);

              task.title =
                'User signed in successfully, access token is available.';

              resolve(true);

              res.send('Authorization complete. You may close this window.');
            });

            app.listen(CurCmd.authPort, () => {
              console.log(`Listening on port ${CurCmd.authPort}`);
            });
          });
        },
      },
    ];
  }

  protected async requestAccessTokenAndStore(code: string): Promise<void> {}
}
