import {} from '@oclif/core';
import { ListrTask } from 'listr2';
import { EnterpriseAsCode } from '@semanticjs/common';
import { FathymCommand } from '../../common/fathym-command';
import { ClosureInstruction } from '../../common/ClosureInstruction';
import {
  ActiveEnterpriseTaskContext,
  ensureActiveEnterprise,
  FathymTaskContext,
} from '../../common/core-helpers';
import { withEaCDraft } from '../../common/eac-services';

interface ClearTaskContext
  extends FathymTaskContext,
    ActiveEnterpriseTaskContext {}

export default class Clear extends FathymCommand<ClearTaskContext> {
  static description = `Used to clear the current draft to EaC that is queued for commit.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [];

  static title = 'EaC Draft Clear';

  protected async loadTasks(): Promise<ListrTask<ClearTaskContext>[]> {
    return [
      ensureActiveEnterprise(this.config.configDir),
      {
        title: `Clear EaC Draft`,
        task: async (ctx, task) => {
          await withEaCDraft(this.config.configDir, '-clear-token-');

          await withEaCDraft(this.config.configDir, ctx.ActiveEnterpriseLookup);
        },
      },
    ];
  }
}
