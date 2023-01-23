import {} from '@oclif/core';
import { ListrTask } from 'listr2';
import {} from '@semanticjs/common';
import { FathymCommand } from '../../common/fathym-command';
import { ClosureInstruction } from '../../common/ClosureInstruction';
import {
  FathymTaskContext,
  withUserAuthConfig,
} from '../../common/core-helpers';

export default class Auth extends FathymCommand<FathymTaskContext> {
  static description = 'Used to retrieve the current auth config for the user.';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [];

  static title = 'Fathym Auth Config';

  static forceRefresh = false;

  protected async loadTasks(): Promise<ListrTask<FathymTaskContext>[]> {
    return [
      {
        title: 'Loading config',
        task: async (ctx, task) => {
          const cfg = await withUserAuthConfig(this.config.configDir);

          task.title = `Fathym Auth Config Loaded`;

          ctx.Fathym.Result = JSON.stringify(cfg);
        },
      },
    ];
  }
}
