import {} from '@oclif/core';
import { ListrTask } from 'listr2';
import { EnterpriseAsCode } from '@semanticjs/common';
import { FathymCommand } from '../../common/fathym-command';
import { ClosureInstruction } from '../../common/ClosureInstruction';
import { FathymTaskContext } from '../../common/core-helpers';
import { withEaCDraft } from '../../common/eac-services';

export default class Export extends FathymCommand<FathymTaskContext> {
  static description = `Used for exporting the EaC.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [];

  static title = 'EaC Export';

  protected async loadTasks(): Promise<ListrTask<FathymTaskContext>[]> {
    return [
      {
        title: `Exporting EaC`,
        task: async (ctx, task) => {
          task.title = `EaC exported`;

          const eacDraft = await withEaCDraft(this.config.configDir);

          ctx.Fathym.Result = JSON.stringify(eacDraft, undefined, 2);
        },
      },
    ];
  }
}
