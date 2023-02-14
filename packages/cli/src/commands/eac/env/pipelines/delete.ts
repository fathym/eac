import { Args, Flags } from '@oclif/core';
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
  PipelineTaskContext,
  deleteFromEaCTask,
  ensurePipelineTask,
} from '../../../../common/eac-services';

interface DeleteContext
  extends FathymTaskContext,
    EaCTaskContext,
    PipelineTaskContext,
    EaCRemovalsTaskContext,
    ActiveEnterpriseTaskContext {}

export default class Delete extends FathymCommand<DeleteContext> {
  static description = `Used for deleting a pipeline.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = {
    pipelineLookup: Args.string({
      description: 'The pipeline lookup to delete.',
    }),
  };

  static title = 'Delete Pipeline';

  protected async loadTasks(): Promise<ListrTask<DeleteContext>[]> {
    const { args } = await this.parse(Delete);

    const { pipelineLookup } = args;

    return [
      ensureActiveEnterprise(this.config.configDir) as ListrTask,
      loadEaCTask(this.config.configDir),
      ensurePipelineTask(pipelineLookup),
      {
        title: `Configure pipeline removals`,
        task: async (ctx, task) => {
          const env =
            ctx.EaC.Environments![ctx.EaC.Enterprise!.PrimaryEnvironment!];

          const pipeline = env.DevOpsActions![ctx.PipelineLookup];

          if (pipeline) {
            task.title = `Configure pipeline removals for '${pipeline?.Name}'`;

            const remove: boolean = await task.prompt({
              type: 'Confirm',
              message: `Are you sure you want to remove pipeline '${pipeline?.Name}'?`,
            });

            if (remove) {
              ctx.EaCRemovals = {
                EnterpriseLookup: ctx.ActiveEnterpriseLookup,
                Environments: {
                  [ctx.EaC.Enterprise!.PrimaryEnvironment!]: {
                    DevOpsActions: {
                      [ctx.PipelineLookup]: {},
                    },
                  },
                },
              };
            }
          }
        },
      },
      deleteFromEaCTask(this.config.configDir, 'Removals', 'Pipeline Removals'),
    ];
  }
}
