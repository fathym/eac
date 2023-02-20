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
  static description = `Used for listing available pipelines.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = {};

  static title = 'List Pipelines';

  protected async loadTasks(): Promise<ListrTask<ListContext>[]> {
    // const { args } = await this.parse(List);

    return [
      ensureActiveEnterpriseTask(this.config.configDir) as ListrTask,
      loadEaCTask(this.config.configDir),
      {
        title: `Loading EaC primary environment pipelines for active enterprise`,
        task: async (ctx, task) => {
          const env =
            ctx.EaC.Environments![ctx.EaC.Enterprise!.PrimaryEnvironment!];

          const doas = Object.keys(env?.DevOpsActions || {});

          ctx.Fathym.Lookups = {
            name: `Pipeline (${color.blueBright('{pipelineLookup}')})`,
            lookups: doas.map(
              (doa) =>
                `${env.DevOpsActions![doa].Name} (${color.blueBright(doa)})`
            ),
          };
        },
      },
    ];
  }
}
