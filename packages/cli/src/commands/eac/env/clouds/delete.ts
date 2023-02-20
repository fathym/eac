import { Args, Flags } from '@oclif/core';
import { color } from '@oclif/color';
import { ListrTask } from 'listr2';
import { EnterpriseAsCode } from '@semanticjs/common';
import { FathymCommand } from '../../../../common/fathym-command';
import {
  ActiveEnterpriseTaskContext,
  CloudTaskContext,
  deleteFromEaCTask,
  EaCRemovalsTaskContext,
  EaCTaskContext,
  ensureActiveEnterpriseTask,
  ensureCloudTask,
  loadEaCTask,
} from '../../../../common/eac-services';
import { FathymTaskContext } from '../../../../common/core-helpers';

interface DeleteContext
  extends FathymTaskContext,
    EaCTaskContext,
    CloudTaskContext,
    EaCRemovalsTaskContext,
    ActiveEnterpriseTaskContext {}

export default class Delete extends FathymCommand<DeleteContext> {
  static description = `Used for deleting a cloud.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = {
    cloudLookup: Args.string({
      description: 'The cloud lookup to delete.',
    }),
  };

  static title = 'Delete Cloud';

  protected async loadTasks(): Promise<ListrTask<DeleteContext>[]> {
    const { args } = await this.parse(Delete);

    const { cloudLookup } = args;

    return [
      ensureActiveEnterpriseTask(this.config.configDir) as ListrTask,
      loadEaCTask(this.config.configDir),
      ensureCloudTask(cloudLookup),
      {
        title: `Configure cloud removals`,
        task: async (ctx, task) => {
          const env =
            ctx.EaC.Environments![ctx.EaC.Enterprise!.PrimaryEnvironment!];

          const cloud = env.Clouds![ctx.CloudLookup];

          if (cloud) {
            task.title = `Configure cloud removals for '${cloud.Cloud?.Name}'`;

            const remove: boolean = await task.prompt({
              type: 'Confirm',
              message: `Are you sure you want to remove cloud '${cloud.Cloud?.Name}'?`,
            });

            if (remove) {
              ctx.EaCRemovals = {
                EnterpriseLookup: ctx.ActiveEnterpriseLookup,
                Environments: {
                  [ctx.EaC.Enterprise!.PrimaryEnvironment!]: {
                    Clouds: {
                      [ctx.CloudLookup]: { Cloud: {} },
                    },
                  },
                },
              };
            }
          }
        },
      },
      deleteFromEaCTask(this.config.configDir, 'Removals', 'Cloud Removals'),
    ];
  }
}
