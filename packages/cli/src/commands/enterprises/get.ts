import {} from '@oclif/core';
import Listr from 'listr';
import {} from '@semanticjs/common';
import { ClosureInstruction, FathymCommand } from '../../common/fathym-command';

export default class Get extends FathymCommand {
  static description = `Get's the current user's active enterprise for the CLI. Determines
  which enterprise commands are executed against.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [];

  static title = 'Get Active Enterprise';

  protected async loadInstructions(): Promise<ClosureInstruction[]> {
    return [
      {
        Instruction: 'fathym eac --help',
        Description: `You can now access the EaC via CLI,
to manage your enterprie setup.`,
      },
    ];
  }

  protected async loadTasks(): Promise<Listr> {
    const { args } = await this.parse(Get);

    return new Listr([
      {
        title: `Getting the user's active enterprise to '${args.entLookup}'`,
        task: (ctx, task) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              task.title = `Active enterprise '${args.entLookup}' retrieved for the user`;

              resolve(true);
            }, 3000);
          });
        },
      },
    ]);
  }
}
