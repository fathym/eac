import { Args, Flags } from '@oclif/core';
import { ListrTask } from 'listr2';
import { FathymCommand } from '../../../common/fathym-command';
import {
  ActiveEnterpriseTaskContext,
  ApplicationTaskContext,
  deleteFromEaCTask,
  DFSModifierTaskContext,
  EaCRemovalsTaskContext,
  EaCTaskContext,
  ensureActiveEnterpriseTask,
  ensureModifierTask,
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
    ApplicationTaskContext,
    DFSModifierTaskContext {}

export default class Delete extends FathymCommand<DeleteContext> {
  static description = `Used for deleting a DFS Modifier.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = {
    modifierLookup: Args.string({
      description: 'The modifier lookup to delete.',
    }),
  };

  static title = 'Delete Modifier';

  protected async loadTasks(): Promise<ListrTask<DeleteContext>[]> {
    const { args } = await this.parse(Delete);

    const { modifierLookup } = args;

    return [
      ensureActiveEnterpriseTask(this.config.configDir) as ListrTask,
      loadEaCTask(this.config.configDir),
      ensureModifierTask(this.config.configDir, modifierLookup),
      {
        title: `Configure modifier removals`,
        task: async (ctx, task) => {
          const modifier = ctx.EaC?.Modifiers![ctx.DFSModifierLookup];

          if (modifier) {
            task.title = `Configure modifier removals for '${modifier?.Name}'`;

            const remove: boolean = await task.prompt({
              type: 'Confirm',
              message: `Are you sure you want to remove modifier '${modifier?.Name}'?`,
            });

            if (remove) {
              ctx.EaCRemovals = {
                EnterpriseLookup: ctx.ActiveEnterpriseLookup,
                Modifiers: {
                  [ctx.DFSModifierLookup]: {},
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
