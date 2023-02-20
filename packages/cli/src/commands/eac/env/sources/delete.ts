import { Args } from '@oclif/core';
import { ListrTask } from 'listr2';
import { FathymCommand } from '../../../../common/fathym-command';
import {
  ActiveEnterpriseTaskContext,
  deleteFromEaCTask,
  EaCRemovalsTaskContext,
  EaCTaskContext,
  ensureActiveEnterpriseTask,
  ensureSourceTask,
  loadEaCTask,
  SourceTaskContext,
} from '../../../../common/eac-services';
import { FathymTaskContext } from '../../../../common/core-helpers';

interface DeleteContext
  extends FathymTaskContext,
    EaCTaskContext,
    SourceTaskContext,
    EaCRemovalsTaskContext,
    ActiveEnterpriseTaskContext {}

export default class Delete extends FathymCommand<DeleteContext> {
  static description = `Used for deleting a source.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = {
    sourceLookup: Args.string({
      description: 'The source lookup to delete.',
    }),
  };

  static title = 'Delete Source';

  protected async loadTasks(): Promise<ListrTask<DeleteContext>[]> {
    const { args } = await this.parse(Delete);

    const { sourceLookup } = args;

    return [
      ensureActiveEnterpriseTask(this.config.configDir) as ListrTask,
      loadEaCTask(this.config.configDir),
      ensureSourceTask(this.config.configDir, sourceLookup),
      {
        title: `Configure source removals`,
        task: async (ctx, task) => {
          const env =
            ctx.EaC.Environments![ctx.EaC.Enterprise!.PrimaryEnvironment!];

          const source = env.Sources![ctx.SourceLookup];

          if (source) {
            task.title = `Configure source removals for '${source?.Name}'`;

            const remove: boolean = await task.prompt({
              type: 'Confirm',
              message: `Are you sure you want to remove source '${source?.Name}'?`,
            });

            if (remove) {
              ctx.EaCRemovals = {
                EnterpriseLookup: ctx.ActiveEnterpriseLookup,
                Environments: {
                  [ctx.EaC.Enterprise!.PrimaryEnvironment!]: {
                    Sources: {
                      [ctx.SourceLookup]: {},
                    },
                  },
                },
              };
            }
          }
        },
      },
      deleteFromEaCTask(this.config.configDir, 'Removals', 'Source Removals'),
    ];
  }
}
