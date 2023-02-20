import { Args, Flags } from '@oclif/core';
import { ListrTask } from 'listr2';
import { EaCApplicationAsCode, EaCProcessor } from '@semanticjs/common';
import { FathymCommand } from '../../../common/fathym-command';
import {
  ActiveEnterpriseTaskContext,
  ApplicationTaskContext,
  EaCTaskContext,
  ensureActiveEnterpriseTask,
  ensureApplicationTask,
  loadEaCTask,
  ProjectTaskContext,
  withEaCDraftEditTask,
} from '../../../common/eac-services';
import {
  FathymTaskContext,
  ensurePromptValue,
} from '../../../common/core-helpers';

interface LCUTaskContext
  extends FathymTaskContext,
    ActiveEnterpriseTaskContext,
    EaCTaskContext,
    ProjectTaskContext,
    ApplicationTaskContext {}

export default class Processor extends FathymCommand<LCUTaskContext> {
  static description = `Used for managing application processor settings.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    defaultFile: Flags.string({
      char: 'd',
      description: 'The path of the default file.',
    }),
    baseHref: Flags.string({
      char: 'b',
      description: 'The base href.',
    }),
  };

  static args = {
    type: Args.string({
      description: 'The type of the processor settings to configure.',
      required: true,
      options: ['DFS', 'OAuth', 'Proxy', 'Redirect'],
    }),
    appLookup: Args.string({
      description: 'The application lookup to manage processor settings for.',
    }),
  };

  static title = 'Manage processor Settings';

  protected async loadTasks(): Promise<ListrTask<LCUTaskContext>[]> {
    const { args, flags } = await this.parse(Processor);

    const { appLookup, type } = args;

    const { defaultFile, baseHref } = flags;

    return [
      ensureActiveEnterpriseTask(this.config.configDir),
      loadEaCTask(this.config.configDir),
      ensureApplicationTask(this.config.configDir, appLookup, false, true),
      this.addApplicationViewPackageProcessorToDraft(type, {
        BaseHref: baseHref,
        DefaultFile: defaultFile,
      }),
    ];
  }

  protected addApplicationViewPackageProcessorToDraft(
    type: string,
    dets: Partial<{ BaseHref: string; DefaultFile: string }>
  ): ListrTask<LCUTaskContext> {
    return withEaCDraftEditTask<LCUTaskContext, EaCProcessor>(
      'Add application view package processor',
      this.config.configDir,
      (ctx) => [['Applications', ctx.ApplicationLookup, 'Processor']],
      {
        enabled: (ctx) => type === 'DFS',
        prompt: async (ctx, task) => {
          dets.BaseHref = await ensurePromptValue(
            task,
            'Base href for the application',
            dets.BaseHref
          );

          dets.DefaultFile = await ensurePromptValue(
            task,
            'Location of default file',
            dets.DefaultFile
          );
        },
        draftPatch: (ctx) => {
          const patch = {
            Type: type,
            ...dets,
          };

          return patch;
        },
      }
    );
  }
}
