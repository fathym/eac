import { Args, Flags } from '@oclif/core';
import { ListrTask } from 'listr2';
import { FathymCommand } from '../../../common/fathym-command';
import {
  ActiveEnterpriseTaskContext,
  deleteFromEaCTask,
  EaCRemovalsTaskContext,
  EaCTaskContext,
  ensureActiveEnterpriseTask,
  ensureProjectTask,
  loadEaCTask,
  ProjectTaskContext,
} from '../../../common/eac-services';
import { FathymTaskContext } from '../../../common/core-helpers';

interface DeleteContext
  extends FathymTaskContext,
    EaCTaskContext,
    EaCRemovalsTaskContext,
    ActiveEnterpriseTaskContext,
    ProjectTaskContext {}

export default class Delete extends FathymCommand<DeleteContext> {
  static description = `Used for deleting a project.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    saveApps: Flags.boolean({
      char: 'a',
      description: 'If on, the associated applications will NOT be deleted.',
    }),
  };

  static args = {
    projectLookup: Args.string({
      description: 'The project lookup to delete.',
    }),
  };

  static title = 'Delete Project';

  protected async loadTasks(): Promise<ListrTask<DeleteContext>[]> {
    const { args, flags } = await this.parse(Delete);

    const { projectLookup } = args;

    const { saveApps } = flags;

    return [
      ensureActiveEnterpriseTask(this.config.configDir) as ListrTask,
      loadEaCTask(this.config.configDir),
      ensureProjectTask(this.config.configDir, projectLookup),
      {
        title: `Configure project removals`,
        task: async (ctx, task) => {
          const project = ctx.EaC?.Projects![ctx.ProjectLookup];

          if (project) {
            task.title = `Configure project removals for '${project.Project?.Name}'`;

            const remove: boolean = await task.prompt({
              type: 'Confirm',
              message: `Are you sure you want to remove project '${project.Project?.Name}'?`,
            });

            if (remove) {
              ctx.EaCRemovals = {
                EnterpriseLookup: ctx.ActiveEnterpriseLookup,
                Projects: {
                  [ctx.ProjectLookup]: { Project: {} },
                },
                Applications: saveApps
                  ? undefined
                  : project.ApplicationLookups?.reduce((apps, appLookup) => {
                      apps![appLookup] = { Application: {} };

                      return apps;
                    }, {}),
              };
            }
          }
        },
      },
      deleteFromEaCTask(this.config.configDir, 'Removals', 'Removals'),
    ];
  }
}
