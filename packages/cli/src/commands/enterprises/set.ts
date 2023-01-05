import {} from '@oclif/core';
import { ListrTask } from 'listr';
import {} from '@semanticjs/common';
import { ClosureInstruction, FathymCommand } from '../../common/fathym-command';

export default class Set extends FathymCommand {
  static description = `Set's the current user's active enterprise for the CLI. Determines
  which enterprise commands are executed against.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [{ name: 'entLookup', required: true }];

  static title = 'Set Active Enterprise';

  protected async loadInstructions(): Promise<ClosureInstruction[]> {
    return [
      {
        Instruction: 'fathym eac --help',
        Description: `You can now access the EaC via CLI,
to manage your enterprie setup.`,
      },
    ];
  }

  protected async loadTasks(): Promise<ListrTask[]> {
    const { args } = await this.parse(Set);

    return [
      {
        title: `Setting the user's active enterprise to '${args.entLookup}'`,
        task: (ctx, task) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              task.title = `Active enterprise set to '${args.entLookup}' for the user`;

              resolve(true);
            }, 3000);
          });
        },
      },
    ];
  }
}
