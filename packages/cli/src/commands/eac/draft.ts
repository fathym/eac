import { Flags } from '@oclif/core';
import { ListrTask } from 'listr2';
import { EnterpriseAsCode } from '@semanticjs/common';
import { FathymCommand } from '../../common/fathym-command';
import { ClosureInstruction } from '../../common/ClosureInstruction';
import { FathymTaskContext } from '../../common/core-helpers';
import { withEaCDraft } from '../../common/eac-services';
import { dirname } from 'node:path';
import { mkdir, pathExists, writeJson } from 'fs-extra';

export default class Draft extends FathymCommand<FathymTaskContext> {
  static description = `Used to retrieve the current draft to EaC that is queued for commit.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    file: Flags.string({
      char: 'f',
      description: 'File path where the export should be written',
    }),
  };

  static args = {};

  static title = 'EaC Draft';

  protected async loadTasks(): Promise<ListrTask<FathymTaskContext>[]> {
    const { flags } = await this.parse(Draft);

    const { file } = flags;

    return [
      {
        title: `Retrieve EaC Draft`,
        task: async (ctx, task) => {
          const eacDraft = await withEaCDraft(this.config.configDir);

          if (file) {
            const dir = dirname(file);

            const exists = await pathExists(dir);

            if (!exists) {
              await mkdir(dir, { recursive: true });
            }

            await writeJson(file, eacDraft, { spaces: 2 });

            task.title = `Exported Draft to ${file}`;
          } else {
            ctx.Fathym.Result = JSON.stringify(eacDraft, undefined, 2);
          }
        },
      },
    ];
  }
}
