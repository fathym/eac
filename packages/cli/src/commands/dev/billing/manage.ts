import { ListrTask } from 'listr2';
import { FathymCommand } from '../../../common/fathym-command';
import { FathymTaskContext, setApiRoot } from '../../../common/core-helpers';
import path from 'node:path';
import open from 'open';

export default class Open extends FathymCommand<FathymTaskContext> {
  static description = 'Used to open the billing dashboard.';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = {};

  static title = 'Open Billing Dashboard';

  protected async loadTasks(): Promise<ListrTask<FathymTaskContext>[]> {
    return [
      {
        title: `Open Billing Dashboard`,
        task: async (ctx, task) => {
          await open('https://www.fathym.com/dashboard/billing');
        },
      },
    ];
  }
}
