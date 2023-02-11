import { Flags } from '@oclif/core';
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
import { mkdir, pathExists, writeJson } from 'fs-extra';
import path from 'node:path';

interface ExportTaskContext
  extends FathymTaskContext,
    ActiveEnterpriseTaskContext,
    EaCTaskContext {}

export default class Export extends FathymCommand<ExportTaskContext> {
  static description = `Used for exporting the EaC.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    file: Flags.string({
      char: 'f',
      description: 'File path where the export should be written',
    }),
  };

  static args = {};

  static title = 'EaC Export';

  protected async loadTasks(): Promise<ListrTask<ExportTaskContext>[]> {
    const { flags } = await this.parse(Export);

    const { file } = flags;

    return [
      ensureActiveEnterprise(this.config.configDir),
      loadEaCTask(this.config.configDir),
      {
        title: `Exporting EaC`,
        task: async (ctx, task) => {
          if (file) {
            const dir = path.dirname(file);

            const exists = await pathExists(dir);

            if (!exists) {
              await mkdir(dir, { recursive: true });
            }

            await writeJson(file, ctx.EaC, { spaces: 2 });

            task.title = `Exported EaC to ${file}`;
          } else {
            ctx.Fathym.Result = JSON.stringify(ctx.EaC, undefined, 2);
          }
        },
      },
    ];
  }
}
