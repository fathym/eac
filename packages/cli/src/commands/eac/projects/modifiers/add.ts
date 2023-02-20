import { Args } from '@oclif/core';
import { ListrTask } from 'listr2';

import { FathymCommand } from '../../../../common/fathym-command';
import {
  ActiveEnterpriseTaskContext,
  ApplicationTaskContext,
  DFSModifierTaskContext,
  EaCTaskContext,
  ensureActiveEnterpriseTask,
  ensureModifierTask,
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
    ApplicationTaskContext,
    DFSModifierTaskContext {}

export default class Add extends FathymCommand<AddTaskContext> {
  static description = `Used for adding a DFS modifier to a project.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = {
    projectLookup: Args.string({
      description: 'The project lookup',
    }),
  };

  static title = 'Add Project DFS Modifier';

  protected async loadTasks(): Promise<ListrTask<AddTaskContext>[]> {
    const { args } = await this.parse(Add);

    const { projectLookup } = args;

    return [
      ensureActiveEnterpriseTask(this.config.configDir),
      loadEaCTask(this.config.configDir),
      ensureProjectTask(this.config.configDir, projectLookup, false, true),
      ensureModifierTask(this.config.configDir, projectLookup, false, true),
      this.addModifierToProject(),
    ];
  }

  protected addModifierToProject(): ListrTask<AddTaskContext> {
    return withEaCDraftEditTask<AddTaskContext, string[]>(
      'Add modifier to application',
      this.config.configDir,
      (ctx) => [['Projects', ctx.ProjectLookup, ['ModifierLookups', []]]],
      {
        draftPatch: (ctx) => [[ctx.DFSModifierLookup]],
        applyPatch: (ctx, current, draft, patch) => {
          merge(patch, draft);
        },
      }
    );
  }
}
