import {} from '@oclif/core';
import { ListrTask } from 'listr2';
import { EnterpriseAsCode } from '@semanticjs/common';
import { FathymCommand } from '../../common/fathym-command';
import { ClosureInstruction } from '../../common/ClosureInstruction';
import { FathymTaskContext } from '../../common/core-helpers';
import { withEaCDraft } from '../../common/eac-services';

export default class Draft extends FathymCommand<FathymTaskContext> {
  static description = `Used to retrieve the current draft to EaC that is queued for commit.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = {};

  static title = 'EaC Draft';

  protected async loadTasks(): Promise<ListrTask<FathymTaskContext>[]> {
    return [
      {
        title: `Retrieve EaC Draft`,
        task: async (ctx, task) => {
          const eacDraft = await withEaCDraft(this.config.configDir);

          ctx.Fathym.Result = JSON.stringify(eacDraft, undefined, 2);
        },
      },
    ];
  }
}
