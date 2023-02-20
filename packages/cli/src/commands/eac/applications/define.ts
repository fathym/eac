import { Args, Flags } from '@oclif/core';
import { ListrTask } from 'listr2';
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
import { EaCApplicationDetails } from '@semanticjs/common';
import { FathymTaskContext } from '../../../common/core-helpers';

interface DefineTaskContext
  extends FathymTaskContext,
    ActiveEnterpriseTaskContext,
    EaCTaskContext,
    ProjectTaskContext,
    ApplicationTaskContext {}

export default class Define extends FathymCommand<DefineTaskContext> {
  static description = `Used for creating or updating an application.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    description: Flags.string({
      char: 'd',
      description: 'The description of the pojrect.',
    }),
    name: Flags.string({
      char: 'n',
      description: 'The name of the pojrect.',
    }),
  };

  static args = {
    appLookup: Args.string({
      description: 'The application lookup to use for define.',
    }),
  };

  static title = 'Define Application';

  protected async loadTasks(): Promise<ListrTask<DefineTaskContext>[]> {
    const { args, flags } = await this.parse(Define);

    const { appLookup } = args;

    const { name, description } = flags;

    return [
      ensureActiveEnterpriseTask(this.config.configDir),
      loadEaCTask(this.config.configDir),
      ensureApplicationTask(this.config.configDir, appLookup, true, true),
      this.addApplicationToDraft(name, description),
    ];
  }

  protected addApplicationToDraft(
    name?: string,
    description?: string
  ): ListrTask<DefineTaskContext> {
    return withEaCDraftEditTask<DefineTaskContext, EaCApplicationDetails>(
      'Define application',
      this.config.configDir,
      (ctx) => [['Applications', ctx.ApplicationLookup, 'Application']],
      {
        draftPatch: (ctx) => {
          const patch = {
            Name: name,
            Description: description || name,
          };

          return patch;
        },
      }
    );
  }
}
