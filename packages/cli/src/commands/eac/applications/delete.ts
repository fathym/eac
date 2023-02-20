import { Args } from '@oclif/core';
import { ListrTask } from 'listr2';
import { FathymCommand } from '../../../common/fathym-command';
import {
  ActiveEnterpriseTaskContext,
  ApplicationTaskContext,
  deleteFromEaCTask,
  EaCRemovalsTaskContext,
  EaCTaskContext,
  ensureActiveEnterpriseTask,
  ensureApplicationTask,
  loadEaCTask,
  ProjectTaskContext,
} from '../../../common/eac-services';
import { FathymTaskContext } from '../../../common/core-helpers';

interface DeleteContext
  extends FathymTaskContext,
    EaCTaskContext,
    EaCRemovalsTaskContext,
    ActiveEnterpriseTaskContext,
    ProjectTaskContext,
    ApplicationTaskContext {}

export default class Delete extends FathymCommand<DeleteContext> {
  static description = `Used for deleting a application.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = {
    appLookup: Args.string({
      description: 'The application lookup to delete.',
    }),
  };

  static title = 'Delete Application';

  protected async loadTasks(): Promise<ListrTask<DeleteContext>[]> {
    const { args } = await this.parse(Delete);

    const { appLookup } = args;

    return [
      ensureActiveEnterpriseTask(this.config.configDir) as ListrTask,
      loadEaCTask(this.config.configDir),
      ensureApplicationTask(this.config.configDir, appLookup),
      {
        title: `Configure application removals`,
        task: async (ctx, task) => {
          const application = ctx.EaC?.Applications![ctx.ApplicationLookup];

          if (application) {
            task.title = `Configure application removals for '${application.Application?.Name}'`;

            const remove: boolean = await task.prompt({
              type: 'Confirm',
              message: `Are you sure you want to remove application '${application.Application?.Name}'?`,
            });

            if (remove) {
              ctx.EaCRemovals = {
                EnterpriseLookup: ctx.ActiveEnterpriseLookup,
                Applications: {
                  [ctx.ApplicationLookup]: { Application: {} },
                },
              };
            }
          }
        },
      },
      deleteFromEaCTask(this.config.configDir, 'Removals', 'Removals'),
    ];
  }
}
