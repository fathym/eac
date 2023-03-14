import { Args, Flags } from '@oclif/core';
import { color } from '@oclif/color';
import { ListrTask } from 'listr2';
import { EnterpriseAsCode } from '@semanticjs/common';
import { FathymCommand } from '../../../../../common/fathym-command';
import {
  ActiveEnterpriseTaskContext,
  CloudResourceGroupTaskContext,
  CloudTaskContext,
  deleteFromEaCTask,
  EaCRemovalsTaskContext,
  EaCTaskContext,
  ensureActiveEnterpriseTask,
  ensureCloudResourceGroupTask,
  ensureCloudTask,
  loadEaCTask,
} from '../../../../../common/eac-services';
import { FathymTaskContext } from '../../../../../common/core-helpers';

interface DeleteContext
  extends FathymTaskContext,
    EaCTaskContext,
    CloudTaskContext,
    CloudResourceGroupTaskContext,
    EaCRemovalsTaskContext,
    ActiveEnterpriseTaskContext {}

export default class Delete extends FathymCommand<DeleteContext> {
  static description = `Used for deleting a cloud resource group.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = {
    cloudResGroupLookup: Args.string({
      description: 'The cloud resource group lookup to delete.',
    }),
  };

  static title = 'Delete Cloud Resource Group';

  protected async loadTasks(): Promise<ListrTask<DeleteContext>[]> {
    const { args } = await this.parse(Delete);

    const { cloudResGroupLookup } = args;

    return [
      ensureActiveEnterpriseTask(this.config.configDir) as ListrTask,
      loadEaCTask(this.config.configDir),
      ensureCloudTask(),
      ensureCloudResourceGroupTask(this.config.configDir, cloudResGroupLookup),
      {
        title: `Configure cloud resource group removals`,
        task: async (ctx, task) => {
          const env =
            ctx.EaC.Environments![ctx.EaC.Enterprise!.PrimaryEnvironment!];

          const cloud = env.Clouds![ctx.CloudLookup];

          const cloudResGroup =
            cloud.ResourceGroups![ctx.CloudResourceGroupLookup];

          if (cloudResGroup) {
            task.title = `Configure cloud resource group removals for '${cloudResGroup?.Name}'`;

            const remove: boolean = await task.prompt({
              type: 'Confirm',
              message: `Are you sure you want to remove cloud resource group '${cloudResGroup?.Name}'?`,
            });

            if (remove) {
              ctx.EaCRemovals = {
                EnterpriseLookup: ctx.ActiveEnterpriseLookup,
                Environments: {
                  [ctx.EaC.Enterprise!.PrimaryEnvironment!]: {
                    Clouds: {
                      [ctx.CloudLookup]: {
                        ResourceGroups: {
                          [ctx.CloudResourceGroupLookup]: {},
                        },
                      },
                    },
                  },
                },
              };
            }
          }
        },
      },
      deleteFromEaCTask(
        this.config.configDir,
        'Removals',
        'Cloud Resource Group Removals'
      ),
    ];
  }
}
