import { Args, Flags } from '@oclif/core';
import { ListrTask } from 'listr2';
import {} from '@semanticjs/common';
import { FathymCommand } from '../../../common/fathym-command';
import { ClosureInstruction } from '../../../common/ClosureInstruction';
import {
  ActiveEnterpriseTaskContext,
  ApplicationTaskContext,
  EaCTaskContext,
  ensureActiveEnterprise,
  ensureApplication,
  FathymTaskContext,
  loadEaCTask,
  ProjectTaskContext,
} from '../../../common/core-helpers';
import { ensurePromptValue, withEaCDraft } from '../../../common/eac-services';

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
      ensureActiveEnterprise(this.config.configDir),
      loadEaCTask(this.config.configDir),
      ensureApplication(this.config.configDir, appLookup, false, true),
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
    return {
      title: 'Create zip application',
      enabled: type === 'DFS',
      task: async (ctx, task) => {
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

        const currentEaCAppProcessor = ctx.EaC.Applications
          ? ctx.EaC.Applications[ctx.ApplicationLookup]?.Processor || {}
          : {};

        await withEaCDraft(
          this.config.configDir,
          ctx.ActiveEnterpriseLookup,
          async (draft) => {
            draft.EaC.Applications![ctx.ApplicationLookup].Processor = {
              ...(currentEaCAppProcessor.Type === type
                ? currentEaCAppProcessor
                : {}),
              Type: type,
              ...dets,
            };

            return draft;
          },
          [['Applications', ctx.ApplicationLookup]]
        );
      },
    };
  }
}
