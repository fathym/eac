import { color } from '@oclif/color';
import { Flags } from '@oclif/core';
import { ListrTask } from 'listr2';
import {} from '@semanticjs/common';
import { FathymCommand } from '../../../../../../common/fathym-command';
import {
  ActiveEnterpriseTaskContext,
  EaCTaskContext,
  ensureActiveEnterprise,
  FathymTaskContext,
  loadEaCTask,
} from '../../../../../../common/core-helpers';
import {
  CloudResourceGroupTaskContext,
  CloudTaskContext,
  ensureCloudResourceGroupTask,
  ensureCloudTask,
} from '../../../../../../common/eac-services';

interface ListContext
  extends FathymTaskContext,
    CloudTaskContext,
    CloudResourceGroupTaskContext,
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
    cloudResGroupLookup: Flags.string({
      char: 'g',
      description: 'Specify the cloud resource group to list resources for.',
    }),
  };

  static args = {};

  static title = 'List Cloud Resource Group Resources';

  protected async loadTasks(): Promise<ListrTask<ListContext>[]> {
    const { flags } = await this.parse(List);

    const { cloudLookup, cloudResGroupLookup } = flags;

    return [
      ensureActiveEnterprise(this.config.configDir),
      loadEaCTask(this.config.configDir),
      ensureCloudTask(this.config.configDir, cloudLookup),
      ensureCloudResourceGroupTask(this.config.configDir, cloudResGroupLookup),
      {
        title: `Loading EaC primary environment cloud resources for active enterprise`,
        task: async (ctx, task) => {
          const env =
            ctx.EaC.Environments![ctx.EaC.Enterprise!.PrimaryEnvironment!];

          const cloud = env.Clouds![ctx.CloudLookup];

          const resGroup = cloud.ResourceGroups![ctx.CloudResourceGroupLookup];

          const resources = Object.keys(resGroup?.Resources || {});

          ctx.Fathym.Lookups = {
            name: `Resource (${color.blueBright('{resLookup}')})`,
            lookups: resources.map(
              (res) =>
                `${resGroup?.Resources![res]!.Name} (${color.blueBright(res)})`
            ),
          };

          ctx.Fathym.Result = JSON.stringify(
            resGroup?.Resources || {},
            null,
            2
          );
        },
      },
    ];
  }
}
