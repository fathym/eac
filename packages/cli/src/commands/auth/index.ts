import {} from '@oclif/core';
import Listr from 'listr';
import open from 'open';
import {} from '@semanticjs/common';
import { ClosureInstruction, FathymCommand } from '../../common/fathym-command';
import {
  getAccessToken,
  getAuthorizationCode,
  getAuthorizationUrl,
} from '../../common/auth-helpers';

export default class Auth extends FathymCommand {
  static description =
    'Used to start the authentication process with Fathym, so your CLI can work with the EaC and other features.';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

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
          await getAccessToken(this.config.configDir, ctx.authorizationCode);
        },
      },
    ];
  }
}
