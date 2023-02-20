import { color } from '@oclif/color';
import { ListrTask } from 'listr2';

import { FathymCommand } from '../../../../common/fathym-command';
import { FathymTaskContext } from '../../../../common/core-helpers';
import {
  EaCTaskContext,
  ActiveEnterpriseTaskContext,
  ensureActiveEnterpriseTask,
  loadEaCTask,
} from '../../../../common/eac-services';

interface ListContext
  extends FathymTaskContext,
    EaCTaskContext,
    ActiveEnterpriseTaskContext {}

export default class List extends FathymCommand<ListContext> {
  static description = `Used for listing available clouds.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = {};

  static title = 'List Clouds';

  protected async loadTasks(): Promise<ListrTask<ListContext>[]> {
    // const { args } = await this.parse(List);

    return [
      ensureActiveEnterpriseTask(this.config.configDir) as ListrTask,
      loadEaCTask(this.config.configDir),
      {
        title: `Loading EaC primary environment clouds for active enterprise`,
        task: async (ctx, task) => {
          const env =
            ctx.EaC.Environments![ctx.EaC.Enterprise!.PrimaryEnvironment!];

          const clouds = Object.keys(env?.Clouds || {});

          ctx.Fathym.Lookups = {
            name: `Cloud (${color.blueBright('{cloudLookup}')})`,
            lookups: clouds.map(
              (cloud) =>
                `${env.Clouds![cloud].Cloud!.Name} (${color.blueBright(cloud)})`
            ),
          };

          // ctx.Fathym.Result = JSON.stringify(env?.Clouds || {}, null, 2);
        },
      },
    ];
  }
}
