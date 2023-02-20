import { color } from '@oclif/color';
import { ListrTask } from 'listr2';
import { FathymTaskContext } from '../../../../common/core-helpers';
import {
  EaCTaskContext,
  ActiveEnterpriseTaskContext,
  ensureActiveEnterpriseTask,
  loadEaCTask,
} from '../../../../common/eac-services';
import { FathymCommand } from '../../../../common/fathym-command';

interface ListContext
  extends FathymTaskContext,
    EaCTaskContext,
    ActiveEnterpriseTaskContext {}

export default class List extends FathymCommand<ListContext> {
  static description = `Used for listing available sources.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = {};

  static title = 'List Sources';

  protected async loadTasks(): Promise<ListrTask<ListContext>[]> {
    // const { args } = await this.parse(List);

    return [
      ensureActiveEnterpriseTask(this.config.configDir) as ListrTask,
      loadEaCTask(this.config.configDir),
      {
        title: `Loading EaC primary environment sources for active enterprise`,
        task: async (ctx, task) => {
          const env =
            ctx.EaC.Environments![ctx.EaC.Enterprise!.PrimaryEnvironment!];

          const sources = Object.keys(env?.Sources || {});

          ctx.Fathym.Lookups = {
            name: `Source (${color.blueBright('{sourceLookup}')})`,
            lookups: sources.map(
              (source) =>
                `${env.Sources![source].Name} (${color.blueBright(source)})`
            ),
          };
        },
      },
    ];
  }
}
