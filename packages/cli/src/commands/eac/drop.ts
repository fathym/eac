import { ListrTask } from 'listr2';
import { FathymCommand } from '../../common/fathym-command';
import { FathymTaskContext } from '../../common/core-helpers';
import {
  ActiveEnterpriseTaskContext,
  ensureActiveEnterpriseTask,
  withEaCDraft,
} from '../../common/eac-services';

interface DropTaskContext
  extends FathymTaskContext,
    ActiveEnterpriseTaskContext {}

export default class Drop extends FathymCommand<DropTaskContext> {
  static description = `Used to drop the current draft to EaC that is queued for commit.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = {};

  static title = 'EaC Draft Drop';

  protected async loadTasks(): Promise<ListrTask<DropTaskContext>[]> {
    return [
      ensureActiveEnterpriseTask(this.config.configDir),
      {
        title: `Drop EaC Draft`,
        task: async (ctx, task) => {
          await withEaCDraft(this.config.configDir, '-drop-token-');

          await withEaCDraft(this.config.configDir, ctx.ActiveEnterpriseLookup);
        },
      },
    ];
  }
}
