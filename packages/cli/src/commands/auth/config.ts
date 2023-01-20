import {} from '@oclif/core';
import { ListrTask } from 'listr2';
import {} from '@semanticjs/common';
import { FathymCommand } from '../../common/fathym-command';
import { ClosureInstruction } from '../../common/ClosureInstruction';
import { withUserAuthConfig } from '../../common/core-helpers';

export default class Auth extends FathymCommand<any> {
  static description = 'Used to retrieve the current auth config for the user.';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [];

  static title = 'Fathym Auth Config';

  static forceRefresh = false;

  protected async loadInstructions(
    context: any
  ): Promise<ClosureInstruction[]> {
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
