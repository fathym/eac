import { Flags } from '@oclif/core';
import { color } from '@oclif/color';
import { ListrTask } from 'listr2';
import { EnterpriseAsCode } from '@semanticjs/common';
import { FathymCommand } from '../../../../common/fathym-command';
import { ClosureInstruction } from '../../../../common/ClosureInstruction';
import {
  ActiveEnterpriseTaskContext,
  EaCRemovalsTaskContext,
  EaCTaskContext,
  ensureActiveEnterprise,
  FathymTaskContext,
  loadEaCTask,
  ProjectTaskContext,
} from '../../../../common/core-helpers';
import {
  CloudTaskContext,
  deleteFromEaCTask,
  ensureCloudTask,
} from '../../../../common/eac-services';

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

  static args = [
    { name: 'cloudLookup', description: 'The cloud lookup to delete.' },
  ];

  static title = 'Delete Cloud';

  protected async loadTasks(): Promise<ListrTask<DeleteContext>[]> {
    const { args } = await this.parse(Delete);

    const { cloudLookup } = args;

    return [
      ensureActiveEnterprise(this.config.configDir) as ListrTask,
      loadEaCTask(this.config.configDir),
      ensureCloudTask(this.config.configDir, cloudLookup),
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
