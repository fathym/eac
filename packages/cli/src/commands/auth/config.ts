import {} from '@oclif/core';
import { ListrTask } from 'listr';
import {} from '@semanticjs/common';
import { ClosureInstruction, FathymCommand } from '../../common/fathym-command';
import { withUserAuthConfig } from '../../common/auth-helpers';

export default class Auth extends FathymCommand {
  static description = 'Used to retrieve the current auth config for the user.';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [];

  static title = 'Fathym Auth Config';

  static forceRefresh = false;

  protected async loadInstructions(): Promise<ClosureInstruction[]> {
    return [
      {
        Instruction: 'fathym auth --help',
        Description: `You can now access the EaC via CLI,
to manage your enterprie setup.`,
      },
    ];
  }

  protected async loadTasks(): Promise<ListrTask[]> {
    return [
      {
        title: 'Loading config',
        task: async (ctx, task) => {
          const cfg = await withUserAuthConfig(this.config.configDir);

          task.title = `Config Loaded: \n${JSON.stringify(cfg)}`;
        },
      },
    ];
  }
}
