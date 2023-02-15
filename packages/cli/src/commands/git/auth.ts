import { Flags } from '@oclif/core';
import { ListrTask } from 'listr2';
import open from 'open';
import {} from '@semanticjs/common';
import { FathymCommand } from '../../common/fathym-command';
import { ClosureInstruction } from '../../common/ClosureInstruction';
import {
  ActiveEnterpriseTaskContext,
  ensureActiveEnterprise,
  FathymTaskContext,
} from '../../common/core-helpers';

interface AuthTaskContext
  extends FathymTaskContext,
    ActiveEnterpriseTaskContext {}
export default class Auth extends FathymCommand<AuthTaskContext> {
  static description = `Used for authenticating the user with Git.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    force: Flags.boolean({
      char: 'f',
      description:
        'Force authentication process to present git rights, even if the user is already authenticated.',
    }),
  };

  static args = {};

  static title = 'Git Authentication';

  protected async loadTasks(): Promise<ListrTask<AuthTaskContext>[]> {
    const { flags } = await this.parse(Auth);

    return [
      ensureActiveEnterprise(this.config.configDir),
      {
        title: 'Open GitHub in browser for authentication',
        task: async (ctx) => {
          open(
            `https://www.fathym.com/.oauth/GitHubOAuth?entLookup=${ctx.ActiveEnterpriseLookup}`
            // `https://localhost:44358/.oauth/GitHubOAuth?entLookup=${ctx.ActiveEnterpriseLookup}`
          );
        },
      },
      {
        title: `${flags.force ? 'Forcing' : 'Waiting for'} user to auth git`,
        task: (ctx, task) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              task.title = 'User has authenticated Git';

              resolve(true);
            }, 3000);
          });
        },
      },
    ];
  }
}
