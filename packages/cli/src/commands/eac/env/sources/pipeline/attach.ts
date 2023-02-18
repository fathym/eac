import { Args } from '@oclif/core';
import { ListrTask } from 'listr2';
import {} from '@semanticjs/common';
import { FathymCommand } from '../../../../../common/fathym-command';
import {
  ActiveEnterpriseTaskContext,
  EaCTaskContext,
  ensureActiveEnterprise,
  ensureSourceControl,
  FathymTaskContext,
  loadEaCTask,
} from '../../../../../common/core-helpers';
import {
  ensurePipelineTask,
  PipelineTaskContext,
  SourceTaskContext,
  withEaCDraft,
} from '../../../../../common/eac-services';

interface AttachTaskContext
  extends FathymTaskContext,
    ActiveEnterpriseTaskContext,
    EaCTaskContext,
    SourceTaskContext,
    PipelineTaskContext {}

export default class Attach extends FathymCommand<any> {
  static description = `Used for attaching a build pipeline to a source control.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = {
    sourceLookup: Args.string({
      description: 'The source lookup',
    }),
    pipelineLookup: Args.string({
      description: 'The pipeline lookup',
    }),
  };

  static title = 'Attach Build Pipeline to Source Control';

  protected async loadTasks(): Promise<ListrTask[]> {
    const { args } = await this.parse(Attach);

    const { sourceLookup, pipelineLookup } = args;

    return [
      ensureActiveEnterprise(this.config.configDir),
      loadEaCTask(this.config.configDir),
      ensureSourceControl(this.config.configDir, sourceLookup),
      ensurePipelineTask(pipelineLookup),
      {
        title: `Attaching build pipeline to source control`,
        task: (ctx, task) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              task.title = `Build pipeline attached to source control`;

              resolve(true);
            }, 3000);
          });
        },
      },
    ];
  }

  protected attachBuildPipelineToSource(): ListrTask<AttachTaskContext> {
    return {
      title: 'Add modifier to application',
      task: async (ctx, task) => {
        await withEaCDraft(
          this.config.configDir,
          ctx.ActiveEnterpriseLookup,
          async (draft) => {
            draft.EaC.Environments![
              ctx.EaC.Enterprise?.PrimaryEnvironment!
            ].Sources![ctx.SourceLookup].DevOpsActionTriggerLookups?.push(
              ctx.PipelineLookup
            );

            return draft;
          },
          [
            [
              'Environments',
              ctx.EaC.Enterprise?.PrimaryEnvironment!,
              'Sources',
              ctx.SourceLookup,
              ['DevOpsActionTriggerLookups', []],
            ],
          ]
        );
      },
    };
  }
}
