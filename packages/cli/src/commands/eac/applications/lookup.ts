import { Args, Flags } from '@oclif/core';
import { ListrTask } from 'listr2';

import { FathymCommand } from '../../../common/fathym-command';
import {
  FathymTaskContext,
  ensurePromptValue,
} from '../../../common/core-helpers';
import {
  ActiveEnterpriseTaskContext,
  EaCTaskContext,
  ProjectTaskContext,
  ApplicationTaskContext,
  ensureActiveEnterpriseTask,
  loadEaCTask,
  ensureApplicationTask,
  withEaCDraftEditTask,
} from '../../../common/eac-services';
import { EaCApplicationLookupConfiguration } from '@semanticjs/common';

interface LookupTaskContext
  extends FathymTaskContext,
    ActiveEnterpriseTaskContext,
    EaCTaskContext,
    ProjectTaskContext,
    ApplicationTaskContext {}

export default class Lookup extends FathymCommand<LookupTaskContext> {
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

  protected async loadTasks(): Promise<ListrTask<LookupTaskContext>[]> {
    const { args, flags } = await this.parse(Lookup);

    const { appLookup } = args;

    const { path } = flags;

    return [
      ensureActiveEnterpriseTask(this.config.configDir),
      loadEaCTask(this.config.configDir),
      ensureApplicationTask(this.config.configDir, appLookup, false, true),
      this.addApplicationLookupToDraft({
        PathRegex: path,
      }),
    ];
  }

  protected addApplicationLookupToDraft(
    dets: Partial<{ PathRegex: string }>
  ): ListrTask<LookupTaskContext> {
    return withEaCDraftEditTask<
      LookupTaskContext,
      EaCApplicationLookupConfiguration
    >(
      'Add application lookup config',
      this.config.configDir,
      (ctx) => [['Applications', ctx.ApplicationLookup, 'LookupConfig']],
      {
        prompt: async (ctx, task) => {
          dets.PathRegex = await ensurePromptValue(
            task,
            'Path for the application',
            dets.PathRegex
          );

          dets.PathRegex = `${dets.PathRegex}.*`;
        },
        draftPatch: (ctx) => {
          const patch = {
            ...dets,
          };

          return patch;
        },
      }
    );
  }
}
