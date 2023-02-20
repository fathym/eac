import { color } from '@oclif/color';
import { Flags } from '@oclif/core';
import { ListrTask } from 'listr2';
import { FathymCommand } from '../../../../../common/fathym-command';
import {
  ActiveEnterpriseTaskContext,
  CloudTaskContext,
  EaCTaskContext,
  ensureActiveEnterpriseTask,
  ensureCloudTask,
  loadEaCTask,
} from '../../../../../common/eac-services';
import { FathymTaskContext } from '../../../../../common/core-helpers';

interface ListContext
  extends FathymTaskContext,
    CloudTaskContext,
    EaCTaskContext,
    ActiveEnterpriseTaskContext {}

export default class List extends FathymCommand<ListContext> {
  static description = `Used for listing available clouds.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    cloudLookup: Flags.string({
      char: 'c',
      description: 'Specify the cloud to list resource groups for.',
    }),
  };

  static args = {};

  static title = 'List Cloud Resource Groups';

  protected async loadTasks(): Promise<ListrTask<ListContext>[]> {
    const { flags } = await this.parse(List);

    const { cloudLookup } = flags;

    return [
      ensureActiveEnterpriseTask(this.config.configDir),
      loadEaCTask(this.config.configDir),
      ensureCloudTask(cloudLookup),
      {
        title: `Loading EaC primary environment cloud resource groups for active enterprise`,
        task: async (ctx, task) => {
          const env =
            ctx.EaC.Environments![ctx.EaC.Enterprise!.PrimaryEnvironment!];

          const cloud = env.Clouds![ctx.CloudLookup];

          const resGroups = Object.keys(cloud?.ResourceGroups || {});

          ctx.Fathym.Lookups = {
            name: `Group (${color.blueBright('{resGroupLookup}')})`,
            lookups: resGroups.map(
              (resGroup) =>
                `${cloud?.ResourceGroups![resGroup]!.Name} (${color.blueBright(
                  resGroup
                )})`
            ),
          };

          // ctx.Fathym.Result = JSON.stringify(
          //   cloud?.ResourceGroups || {},
          //   null,
          //   2
          // );
        },
      },
    ];
  }
}
