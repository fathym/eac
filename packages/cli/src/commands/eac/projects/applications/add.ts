import { Args, Flags } from '@oclif/core';
import { ListrTask } from 'listr2';
import { FathymCommand } from '../../../../common/fathym-command';
import {
  ActiveEnterpriseTaskContext,
  ApplicationTaskContext,
  EaCTaskContext,
  ensureActiveEnterprise,
  ensureApplication,
  ensureProject,
  FathymTaskContext,
  loadEaCTask,
  ProjectTaskContext,
} from '../../../../common/core-helpers';
import { DepthOption, withEaCDraft } from '../../../../common/eac-services';

interface AddTaskContext
  extends FathymTaskContext,
    ActiveEnterpriseTaskContext,
    EaCTaskContext,
    ProjectTaskContext,
    ApplicationTaskContext {}

export default class Add extends FathymCommand<AddTaskContext> {
  static description = `Used for adding an application to a project.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = {
    projectLookup: Args.string({
      description: 'The project lookup to add the application to.',
    }),
    appLookup: Args.string({
      description: 'The application lookup to add to the project.',
    }),
  };

  static title = 'Add Project Application';

  protected async loadTasks(): Promise<ListrTask<AddTaskContext>[]> {
    const { args, flags } = await this.parse(Add);

    const { projectLookup, appLookup } = args;

    const { name, description } = flags;

    return [
      ensureActiveEnterprise(this.config.configDir),
      loadEaCTask(this.config.configDir),
      ensureProject(this.config.configDir, projectLookup, false, true),
      ensureApplication(this.config.configDir, appLookup, false, true),
      this.addApplicationToProject(),
    ];
  }

  protected addApplicationToProject(): ListrTask<AddTaskContext> {
    return {
      title: 'Create project',
      task: async (ctx, task) => {
        const currentEaCProj =
          ctx.EaC.Projects && ctx.EaC.Projects[ctx.ProjectLookup]
            ? ctx.EaC.Projects[ctx.ProjectLookup] || {}
            : {};

        await withEaCDraft(
          this.config.configDir,
          ctx.ActiveEnterpriseLookup,
          async (draft) => {
            draft.EaC.Projects![ctx.ProjectLookup].ApplicationLookups?.push(
              ctx.ApplicationLookup
            );

            return draft;
          },
          [['Projects', ctx.ProjectLookup, ['ApplicationLookups', []]]]
        );
      },
    };
  }
}
