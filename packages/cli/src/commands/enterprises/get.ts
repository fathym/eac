import {} from '@oclif/core';
import { ListrTask } from 'listr2';
import {} from '@semanticjs/common';
import { FathymCommand } from '../../common/fathym-command';
import { ClosureInstruction } from '../../common/ClosureInstruction';

export default class Get extends FathymCommand<any> {
  static description = `Get's the current user's active enterprise for the CLI. Determines
  which enterprise commands are executed against.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [];

  static title = 'Get Active Enterprise';

  protected async loadInstructions(
    context: any
  ): Promise<ClosureInstruction[]> {
    return [
      {
        Instruction: 'fathym eac --help',
        Description: `You can now access the EaC via CLI,
to manage your enterprie setup.`,
      },
    ];
  }

  protected async loadTasks(): Promise<ListrTask[]> {
    const { args } = await this.parse(Get);

    return [
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
    ];
  }
}
