import { Args } from '@oclif/core';
import { ListrTask } from 'listr2';

import { FathymCommand } from '../../../../../common/fathym-command';
import { FathymTaskContext, merge } from '../../../../../common/core-helpers';
import {
  ActiveEnterpriseTaskContext,
  EaCTaskContext,
  ensureActiveEnterpriseTask,
  ensurePipelineTask,
  ensureSourceTask,
  loadEaCTask,
  PipelineTaskContext,
  SourceTaskContext,
  withEaCDraftEditTask,
} from '../../../../../common/eac-services';
import { EaCSourceControl } from '@semanticjs/common';

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
      ensureActiveEnterpriseTask(this.config.configDir),
      loadEaCTask(this.config.configDir),
      ensureSourceTask(this.config.configDir, sourceLookup, false, true),
      ensurePipelineTask(this.config.configDir, pipelineLookup, false, true),
      this.attachBuildPipelineToSource(),
    ];
  }

  protected attachBuildPipelineToSource(): ListrTask<AttachTaskContext> {
    return withEaCDraftEditTask<AttachTaskContext, EaCSourceControl>(
      'Add pipeline to source',
      this.config.configDir,
      (ctx) => [
        [
          'Environments',
          ctx.EaC.Enterprise!.PrimaryEnvironment!,
          'Sources',
          ctx.SourceLookup,
        ],
      ],
      {
        draftPatch: (ctx) => {
          return {
            DevOpsActionTriggerLookups: [ctx.PipelineLookup],
          };
        },
        applyPatch: (ctx, current, draft, patch) => {
          merge(current, draft);

          draft.DevOpsActionTriggerLookups = [];

          merge(patch, draft);
        },
      }
    );
  }
}
