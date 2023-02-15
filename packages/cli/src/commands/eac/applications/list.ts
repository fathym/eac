import { color } from '@oclif/color';
import { ListrTask } from 'listr2';
import {} from '@semanticjs/common';
import { FathymCommand } from '../../../common/fathym-command';
import { ClosureInstruction } from '../../../common/ClosureInstruction';
import {
  ActiveEnterpriseTaskContext,
  EaCTaskContext,
  ensureActiveEnterprise,
  FathymTaskContext,
  loadEaCTask,
} from '../../../common/core-helpers';

interface ListContext
  extends FathymTaskContext,
    EaCTaskContext,
    ActiveEnterpriseTaskContext {}

export default class List extends FathymCommand<ListContext> {
  static description = `Used for listing available applications.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = {};

  static title = 'List Applications';

  protected async loadTasks(): Promise<ListrTask<ListContext>[]> {
    // const { args } = await this.parse(List);

    return [
      ensureActiveEnterprise(this.config.configDir) as ListrTask,
      loadEaCTask(this.config.configDir),
      {
        title: `Loading EaC applications for active enterprise`,
        task: async (ctx, task) => {
          const applications = Object.keys(ctx.EaC?.Applications || {});

          ctx.Fathym.Lookups = {
            name: `Application (${color.blueBright('{appLookup}')})`,
            lookups: applications.map(
              (proj) =>
                `${
                  ctx.EaC.Applications![proj].Application!.Name
                } (${color.blueBright(proj)})`
            ),
          };
        },
      },
    ];
  }
}
