import { Args } from '@oclif/core';
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
} from '../../../common/core-helpers';
import { withEaCDraft } from '../../../common/eac-services';

interface LCUTaskContext
  extends FathymTaskContext,
    ActiveEnterpriseTaskContext,
    EaCTaskContext,
    ApplicationTaskContext {}

export default class LCU extends FathymCommand<LCUTaskContext> {
  static description = `Used for creating a managing application LCU settings.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = {
    appLookup: Args.string({
      description: 'The application lookup to manage LCU settings for.',
    }),
    type: Args.string({
      description: 'The type of the LCU settings to configure.',
      options: [
        'API',
        'ApplicationPointer',
        'GitHub',
        'GitHubOAuth',
        'SPA',
        'NPM',
        'WordPress',
        'Zip',
      ],
    }),
    zipFile: Args.string({
      description: 'The path to the zip file containing your site.',
    }),
  };

  static title = 'Manage LCU Settings';

  protected async loadTasks(): Promise<ListrTask<LCUTaskContext>[]> {
    const { args } = await this.parse(LCU);

    const { appLookup, type } = args;

    return [
      ensureActiveEnterprise(this.config.configDir),
      loadEaCTask(this.config.configDir),
      ensureApplication(this.config.configDir, appLookup, false, true),
      this.addApplicationLCUToDraft(type),
    ];
  }

  protected addApplicationLCUToDraft(
    type?: string,
    typeDetails?: any
  ): ListrTask<LCUTaskContext> {
    return {
      title: 'Create application',
      task: async (ctx, task) => {
        const currentEaCAppLCU = ctx.EaC.Applications
          ? ctx.EaC.Applications[ctx.ApplicationLookup]?.LowCodeUnit || {}
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

            if (type) {
              draft.EaC.Applications[ctx.ApplicationLookup].LowCodeUnit = {
                ...(currentEaCAppLCU.Type === type ? currentEaCAppLCU : {}),
                Type: type,
                ...typeDetails,
              };
            }

            return draft;
          }
        );
      },
    };
  }
}
