import {} from '@oclif/core';
import Listr from 'listr';
import keytar from 'keytar';
import open from 'open';
import {} from '@semanticjs/common';
import { ClosureInstruction, FathymCommand } from '../../common/fathym-command';
import {
  getAccessToken,
  getAuthorizationCode,
  getAuthorizationUrl,
} from '../../common/eac-services';

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
    return [
      {
        title: 'Get authorization URL',
        task: async (ctx) => {
          ctx.authorizationUrl = await getAuthorizationUrl();
        },
      },
      {
        title: 'Open browser for user sign in',
        task: async (ctx) => {
          open(ctx.authorizationUrl);
        },
      },
      {
        title: `Waiting for user to sign in`,
        task: async (ctx, task) => {
          // get the authorization code from th "e helper service
          ctx.authorizationCode = await getAuthorizationCode();

          task.title = 'User signed in successfully, auth code is available.';
        },
      },
      {
        title: `Load access token`,
        task: async (ctx) => {
          // get the access token from the helper service using the authorization code from the context
          const { accessToken, refreshToken } = await getAccessToken(
            ctx.authorizationCode
          );

          // store the access token in the system's keychain
          await keytar.setPassword('fathym-cli', 'access_token', accessToken);

          await keytar.setPassword('fathym-cli', 'refresh_token', refreshToken);
        },
      },
    ];
  }
}
