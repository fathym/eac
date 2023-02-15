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

export default class LCU extends FathymCommand<LCUTaskContext> {
  static description = `Used for managing application LCU settings.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    zipFile: Flags.string({
      char: 'z',
      description: 'The path to the zip file containing your site.',
      // relationships: [
      //   {
      //     type: 'all',
      //     flags: [
      //       {
      //         name: 'zipFile',
      //         when: async (flags) => flags.type === 'Zip',
      //       },
      //     ],
      //   },
      // ],
    }),
  };

  static args = {
    type: Args.string({
      description: 'The type of the LCU settings to configure.',
      required: true,
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
    appLookup: Args.string({
      description: 'The application lookup to manage LCU settings for.',
    }),
  };

  static title = 'Manage LCU Settings';

  protected async loadTasks(): Promise<ListrTask<LCUTaskContext>[]> {
    const { args, flags } = await this.parse(LCU);

    const { appLookup, type } = args;

    const { zipFile } = flags;

    return [
      ensureActiveEnterprise(this.config.configDir),
      loadEaCTask(this.config.configDir),
      ensureApplication(this.config.configDir, appLookup, false, true),
      this.addApplicationZipLCUToDraft(type, { ZipFile: zipFile }),
    ];
  }

  protected addApplicationZipLCUToDraft(
    type: string,
    zipDets: Partial<{ ZipFile: string }>
  ): ListrTask<LCUTaskContext> {
    return {
      title: 'Create zip application',
      enabled: type === 'Zip',
      task: async (ctx, task) => {
        zipDets.ZipFile = await ensurePromptValue(
          task,
          'Location of zip file',
          zipDets.ZipFile
        );

        const currentEaCAppLCU = ctx.EaC.Applications
          ? ctx.EaC.Applications[ctx.ApplicationLookup]?.LowCodeUnit || {}
          : {};

        await withEaCDraft(
          this.config.configDir,
          ctx.ActiveEnterpriseLookup,
          async (draft) => {
            draft.EaC.Applications![ctx.ApplicationLookup].LowCodeUnit = {
              ...(currentEaCAppLCU.Type === type ? currentEaCAppLCU : {}),
              Type: type,
              ...zipDets,
            };

            return draft;
          },
          ['Applications', ctx.ApplicationLookup]
        );
      },
    };
  }
}
