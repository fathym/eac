import { Flags } from '@oclif/core';
import { ListrTask } from 'listr2';
import open from 'open';
import {} from '@semanticjs/common';
import { FathymCommand } from '../../common/fathym-command';
import { ClosureInstruction } from '../../common/ClosureInstruction';

export default class Auth extends FathymCommand<any> {
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

  protected async loadTasks(): Promise<ListrTask[]> {
    const { flags } = await this.parse(Auth);

    return [
      {
        title: 'Open GitHub in browser for authentication',
        task: async () => {
          open(
            'https://www.fathym.com/.oauth/GitHubOAuth?oauth-force-edit=true'
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
