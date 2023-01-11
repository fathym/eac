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

    // Add task to check for draft changes, if draft changes then block other aspects and return information that tells user to first commit or reset EaC changes before changing...  Maybe offer a way for inquierer to ask the user what they want to do if there are EaC Draft changes... Provide a commit flow prior to changing EaCs

    return [
      {
        title: `Setting the user's active enterprise to '${args.entLookup}'`,
        task: (ctx, task) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              task.title = `Active enterprise set to '${args.entLookup}'`;

              resolve(true);
            }, 3000);
          });
        },
      },
    ];
  }
}
