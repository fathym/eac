import { Args, Flags } from '@oclif/core';
import { ListrTask } from 'listr2';
import { FathymCommand } from '../../../common/fathym-command';
import { FathymTaskContext } from '../../../common/core-helpers';
import {
  ActiveEnterpriseTaskContext,
  EaCTaskContext,
  ensureActiveEnterpriseTask,
  ensureProjectTask,
  loadEaCTask,
  ProjectTaskContext,
  withEaCDraftEditTask,
} from '../../../common/eac-services';
import { EaCProjectDetails } from '@semanticjs/common';

interface DefineTaskContext
  extends FathymTaskContext,
    ActiveEnterpriseTaskContext,
    EaCTaskContext,
    ProjectTaskContext {}

export default class Define extends FathymCommand<DefineTaskContext> {
  static description = `Used for creating or updating a project.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    description: Flags.string({
      char: 'd',
      description: 'The description of the project.',
    }),
    name: Flags.string({
      char: 'n',
      description: 'The name of the project.',
    }),
  };

  static args = {
    projectLookup: Args.string({
      description: 'The project lookup to use for define.',
    }),
  };

  static title = 'Define Project';

  protected async loadTasks(): Promise<ListrTask<DefineTaskContext>[]> {
    const { args, flags } = await this.parse(Define);

    const { projectLookup } = args;

    const { name, description } = flags;

    return [
      ensureActiveEnterpriseTask(this.config.configDir),
      loadEaCTask(this.config.configDir),
      ensureProjectTask(this.config.configDir, projectLookup, true, true),
      this.addProjectToDraft(name, description),
    ];
  }

  protected addProjectToDraft(
    name?: string,
    description?: string
  ): ListrTask<DefineTaskContext> {
    return withEaCDraftEditTask<DefineTaskContext, EaCProjectDetails>(
      'Define project',
      this.config.configDir,
      (ctx) => [['Projects', ctx.ProjectLookup, 'Project']],
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
