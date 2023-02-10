import { Flags } from '@oclif/core';
import { color } from '@oclif/color';
import { ListrTask } from 'listr2';
import { EnterpriseAsCode } from '@semanticjs/common';
import { FathymCommand } from '../../../common/fathym-command';
import { ClosureInstruction } from '../../../common/ClosureInstruction';
import {
  ActiveEnterpriseTaskContext,
  EaCRemovalsTaskContext,
  EaCTaskContext,
  ensureActiveEnterprise,
  ensureApplication,
  FathymTaskContext,
  loadEaCTask,
  ApplicationTaskContext,
} from '../../../common/core-helpers';
import { deleteFromEaCTask } from '../../../common/eac-services';

interface DeleteContext
  extends FathymTaskContext,
    EaCTaskContext,
    EaCRemovalsTaskContext,
    ActiveEnterpriseTaskContext,
    ApplicationTaskContext {}

export default class Delete extends FathymCommand<DeleteContext> {
  static description = `Used for deleting a application.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [
    {
      name: 'applicationLookup',
      description: 'The application lookup to delete.',
    },
  ];

  static title = 'Delete Application';

  protected async loadTasks(): Promise<ListrTask<DeleteContext>[]> {
    const { args } = await this.parse(Delete);

    const { applicationLookup } = args;

    return [
      ensureActiveEnterprise(this.config.configDir) as ListrTask,
      loadEaCTask(this.config.configDir),
      ensureApplication(this.config.configDir, applicationLookup),
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
