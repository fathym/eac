import {} from '@oclif/core';
import { ListrTask } from 'listr2';
import { EnterpriseAsCode } from '@semanticjs/common';
import { FathymCommand } from '../../common/fathym-command';
import { ClosureInstruction } from '../../common/ClosureInstruction';
import {
  ActiveEnterpriseTaskContext,
  EaCTaskContext,
  ensureActiveEnterprise,
  FathymTaskContext,
  loadEaCTask,
} from '../../common/core-helpers';
import { withEaCDraft } from '../../common/eac-services';

interface ExportTaskContext
  extends FathymTaskContext,
    ActiveEnterpriseTaskContext,
    EaCTaskContext {}

export default class Export extends FathymCommand<ExportTaskContext> {
  static description = `Used for exporting the EaC.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [];

  static title = 'EaC Export';

  protected async loadTasks(): Promise<ListrTask<ExportTaskContext>[]> {
    return [
      ensureActiveEnterprise(this.config.configDir),
      loadEaCTask(this.config.configDir),
      {
        title: `Exporting EaC`,
        task: async (ctx, task) => {
          ctx.Fathym.Result = JSON.stringify(ctx.EaC, undefined, 2);
        },
      },
    ];
  }
}
