import { color } from '@oclif/color';
import { Flags } from '@oclif/core';
import { ListrTask } from 'listr2';
import {} from '@semanticjs/common';
import { FathymCommand } from '../../../../../common/fathym-command';
import {
  ActiveEnterpriseTaskContext,
  EaCTaskContext,
  ensureActiveEnterprise,
  FathymTaskContext,
  loadEaCTask,
} from '../../../../../common/core-helpers';
import {
  CloudTaskContext,
  ensureCloudTask,
} from '../../../../../common/eac-services';

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

  static args = [];

  static title = 'List Cloud Resource Groups';

  protected async loadTasks(): Promise<ListrTask<ListContext>[]> {
    const { flags } = await this.parse(List);

    const { cloudLookup } = flags;

    return [
      ensureActiveEnterprise(this.config.configDir),
      loadEaCTask(this.config.configDir),
      ensureCloudTask(this.config.configDir, cloudLookup),
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

          ctx.Fathym.Result = JSON.stringify(
            cloud?.ResourceGroups || {},
            null,
            2
          );
        },
      },
    ];
  }
}
