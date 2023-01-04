import { Flags } from '@oclif/core';
import Listr from 'listr';
import {} from '@semanticjs/common';
import { ClosureInstruction, FathymCommand } from '../../common/fathym-command';

export default class Auth extends FathymCommand {
  static description = `Used for authenticating the user with Git.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    force: Flags.boolean({
      char: 'f',
      description:
        'Force authentication process to present git rights, even if the user is already authenticated.',
    }),
  };

  static args = [];

  static title = 'Git Authentication';

  protected async loadInstructions(): Promise<ClosureInstruction[]> {
    return [
      {
        Instruction: 'fathym eac applications security --help',
        Description: `You can manage more about your application.`,
      },
    ];
  }

  protected async loadTasks(): Promise<Listr> {
    const { flags } = await this.parse(Auth);

    return [
      {
        title: 'Opened browser for authentication',
        task: () => 'Opened',
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
