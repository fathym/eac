import {} from '@oclif/core';
import { ListrTask } from 'listr2';
import {} from '@semanticjs/common';
import { FathymCommand } from '../../common/fathym-command';
import { ClosureInstruction } from '../../common/ClosureInstruction';
import { withUserAuthConfig } from '../../common/core-helpers';

export default class Set extends FathymCommand<any> {
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
        task: async (ctx, task) => {
          await withUserAuthConfig(this.config.configDir, async (cfg) => {
            cfg.ActiveEnterpriseLookup = args.entLookup;

            return cfg;
          });

          ctx.Fathym.Instructions = await this.loadInstructions();
        },
      },
    ];
  }
}
