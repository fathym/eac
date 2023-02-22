import { Args, Flags } from '@oclif/core';
import { ListrTask } from 'listr2';
import { FathymCommand } from '../../../../common/fathym-command';
import {
  ActiveEnterpriseTaskContext,
  ApplicationTaskContext,
  EaCTaskContext,
  ensureActiveEnterpriseTask,
  ensureApplicationTask,
  ensureProjectTask,
  loadEaCTask,
  ProjectTaskContext,
  withEaCDraftEditTask,
} from '../../../../common/eac-services';
import { FathymTaskContext, merge } from '../../../../common/core-helpers';

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
      ensureActiveEnterpriseTask(this.config.configDir),
      loadEaCTask(this.config.configDir),
      ensureProjectTask(this.config.configDir, projectLookup, false, true),
      ensureApplicationTask(this.config.configDir, appLookup, false, true),
      this.addApplicationToProject(),
    ];
  }

  protected addApplicationToProject(): ListrTask<AddTaskContext> {
    return withEaCDraftEditTask<AddTaskContext, string[]>(
      'Add modifier to application',
      this.config.configDir,
      (ctx) => [['Projects', ctx.ProjectLookup, ['ApplicationLookups', []]]],
      {
        draftPatch: (ctx) => [[ctx.ApplicationLookup]],
        // applyPatch: (ctx, current, draft, patch) => {
        //   merge(patch, draft);
        // },
      }
    );
  }
}
