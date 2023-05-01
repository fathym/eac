import { ListrTask } from 'listr2';
import { FathymCommand } from '../../common/fathym-command';
import { FathymTaskContext } from '../../common/core-helpers';
import {
  ActiveEnterpriseTaskContext,
  ensureActiveEnterpriseTask,
} from '../../common/eac-services';

interface GetContext extends FathymTaskContext, ActiveEnterpriseTaskContext {}

export default class Get extends FathymCommand<GetContext> {
  static description = `Get's the current user's active enterprise for the CLI. Determines
  which enterprise commands are executed against.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = {};

  static title = 'Get Active Enterprise';

  protected async loadTasks(): Promise<ListrTask<GetContext>[]> {
    const { args } = await this.parse(Get);

    return [ensureActiveEnterpriseTask(this.config.configDir)];
  }
}
