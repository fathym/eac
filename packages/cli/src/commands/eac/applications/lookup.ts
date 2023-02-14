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

export default class Lookup extends FathymCommand<LCUTaskContext> {
  static description = `Used for managing application lookup settings.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    path: Flags.string({
      char: 'p',
      description: 'The path the application will be hosted on',
    }),
  };

  static args = {
    appLookup: Args.string({
      description: 'The application lookup to manage.',
    }),
  };

  static title = 'Manage processor Settings';

  protected async loadTasks(): Promise<ListrTask<LCUTaskContext>[]> {
    const { args, flags } = await this.parse(Lookup);

    const { appLookup } = args;

    const { path } = flags;

    return [
      ensureActiveEnterprise(this.config.configDir),
      loadEaCTask(this.config.configDir),
      ensureApplication(this.config.configDir, appLookup, false, true),
      this.addApplicationLookupToDraft({
        PathRegex: path,
      }),
    ];
  }

  protected addApplicationLookupToDraft(
    dets: Partial<{ PathRegex: string }>
  ): ListrTask<LCUTaskContext> {
    return {
      title: 'Create zip application',
      task: async (ctx, task) => {
        dets.PathRegex = await ensurePromptValue(
          task,
          'Path for the application',
          dets.PathRegex
        );

        dets.PathRegex = `${dets.PathRegex}.*`;

        const currentEaCAppLookup = ctx.EaC.Applications
          ? ctx.EaC.Applications[ctx.ApplicationLookup]?.LookupConfig || {}
          : {};

        await withEaCDraft(
          this.config.configDir,
          ctx.ActiveEnterpriseLookup,
          async (draft) => {
            if (!draft.EaC.Applications) {
              draft.EaC.Applications = {};
            }

            if (!draft.EaC.Applications[ctx.ApplicationLookup]) {
              draft.EaC.Applications[ctx.ApplicationLookup] = {};
            }

            draft.EaC.Applications[ctx.ApplicationLookup].LookupConfig = {
              ...currentEaCAppLookup,
              ...dets,
            };

            return draft;
          }
        );
      },
    };
  }
}
