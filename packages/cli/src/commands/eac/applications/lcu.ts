import { Args, Flags } from '@oclif/core';
import { ListrTask } from 'listr2';
import { EaCLowCodeUnit } from '@semanticjs/common';
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
      ensureActiveEnterpriseTask(this.config.configDir),
      loadEaCTask(this.config.configDir),
      ensureApplicationTask(this.config.configDir, appLookup, false, true),
      this.addApplicationZipLCUToDraft(type, { ZipFile: zipFile }),
    ];
  }

  protected addApplicationZipLCUToDraft(
    type: string,
    zipDets: Partial<{ ZipFile: string }>
  ): ListrTask<LCUTaskContext> {
    return withEaCDraftEditTask<LCUTaskContext, EaCLowCodeUnit>(
      'Add application view package Zip LowCodeUnit',
      this.config.configDir,
      (ctx) => [['Applications', ctx.ApplicationLookup, 'LowCodeUnit']],
      {
        enabled: (ctx) => type === 'Zip',
        prompt: async (ctx, task) => {
          zipDets.ZipFile = await ensurePromptValue(
            task,
            'Location of zip file',
            zipDets.ZipFile
          );
        },
        draftPatch: (ctx) => {
          const patch = {
            Type: type,
            ...zipDets,
          };

          return patch;
        },
      }
    );
  }
}
