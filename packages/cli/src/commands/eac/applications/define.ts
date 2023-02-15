import { Args, Flags } from '@oclif/core';
import { ListrTask } from 'listr2';
import { FathymCommand } from '../../../common/fathym-command';
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
import { withEaCDraft } from '../../../common/eac-services';

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
      ensureActiveEnterprise(this.config.configDir),
      loadEaCTask(this.config.configDir),
      ensureApplication(this.config.configDir, appLookup, true, true),
      this.addApplicationToDraft(name, description),
    ];
  }

  protected addApplicationToDraft(
    name?: string,
    description?: string
  ): ListrTask<DefineTaskContext> {
    return {
      title: 'Create application',
      task: async (ctx, task) => {
        const currentEaCApp =
          ctx.EaC.Applications && ctx.EaC.Applications[ctx.ApplicationLookup]
            ? ctx.EaC.Applications[ctx.ApplicationLookup] || {}
            : {};

        await withEaCDraft(
          this.config.configDir,
          ctx.ActiveEnterpriseLookup,
          async (draft) => {
            if (name || description) {
              draft.EaC.Applications![ctx.ApplicationLookup].Application = {
                ...currentEaCApp.Application,
                Name:
                  name ||
                  draft.EaC.Applications![ctx.ApplicationLookup]?.Application
                    ?.Name ||
                  currentEaCApp.Application?.Name,
                Description:
                  description ||
                  draft.EaC.Applications![ctx.ApplicationLookup]?.Application
                    ?.Description ||
                  currentEaCApp.Application?.Description ||
                  name,
              };
            }

            return draft;
          },
          ['Applications', ctx.ApplicationLookup]
        );
      },
    };
  }
}
