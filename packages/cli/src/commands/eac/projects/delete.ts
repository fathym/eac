import { Flags } from '@oclif/core';
import { color } from '@oclif/color';
import { ListrTask } from 'listr2';
import { EnterpriseAsCode } from '@semanticjs/common';
import { FathymCommand } from '../../../common/fathym-command';
import { ClosureInstruction } from '../../../common/ClosureInstruction';
import {
  ActiveEnterpriseTaskContext,
  EaCRemovalsTaskContext,
  EaCTaskContext,
  ensureActiveEnterprise,
  ensureProject,
  FathymTaskContext,
  loadEaCTask,
  ProjectTaskContext,
} from '../../../common/core-helpers';
import { deleteFromEaCTask } from '../../../common/eac-services';

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
    includeApps: Flags.boolean({
      char: 'a',
      description: 'Include applications in delete process.',
    }),
  };

  static args = [
    { name: 'projectLookup', description: 'The project lookup to delete.' },
  ];

  static title = 'Delete Project';

  protected async loadTasks(): Promise<ListrTask<DeleteContext>[]> {
    const { args, flags } = await this.parse(Delete);

    const { projectLookup } = args;

    const { includeApps } = flags;

    return [
      ensureActiveEnterprise(this.config.configDir) as ListrTask,
      loadEaCTask(this.config.configDir),
      ensureProject(projectLookup, false),
      {
        title: `Configure project removals`,
        task: async (ctx, task) => {
          const project = ctx.EaC?.Projects![ctx.ProjectLookup];

          if (project) {
            task.title = `Configure project removals for '${project.Project?.Name}'`;

            const remove: boolean = await task.prompt({
              type: 'Confirm',
              message: `Are you sure you want to remove '${project.Project?.Name}'?`,
            });

            if (remove) {
              ctx.EaCRemovals = {
                EnterpriseLookup: ctx.ActiveEnterpriseLookup,
                Projects: {
                  [ctx.ProjectLookup]: { Project: {} },
                },
                Applications: project.ApplicationLookups?.reduce(
                  (apps, appLookup) => {
                    apps![appLookup] = { Application: {} };

                    return apps;
                  },
                  {}
                ),
              };
            }
          }
        },
      },
      deleteFromEaCTask(this.config.configDir, 'Removals', 'Removals'),
    ];
  }
}
