import { Args } from '@oclif/core';
import { ListrTask } from 'listr2';

import { FathymCommand } from '../../../../common/fathym-command';
import {
  ActiveEnterpriseTaskContext,
  ApplicationTaskContext,
  DFSModifierTaskContext,
  EaCTaskContext,
  ensureActiveEnterpriseTask,
  ensureApplicationTask,
  ensureModifierTask,
  loadEaCTask,
  ProjectTaskContext,
  withEaCDraftEditTask,
} from '../../../../common/eac-services';
import { FathymTaskContext, merge } from '../../../../common/core-helpers';

interface AddTaskContext
  extends FathymTaskContext,
    ActiveEnterpriseTaskContext,
    EaCTaskContext,
    ApplicationTaskContext,
    ProjectTaskContext,
    DFSModifierTaskContext {}

export default class Add extends FathymCommand<AddTaskContext> {
  static description = `Used for adding a DFS modifier to a application.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = {
    appLookup: Args.string({
      description: 'The application lookup',
    }),
  };

  static title = 'Add Project DFS Modifier';

  protected async loadTasks(): Promise<ListrTask<AddTaskContext>[]> {
    const { args } = await this.parse(Add);

    const { appLookup } = args;

    return [
      ensureActiveEnterpriseTask(this.config.configDir),
      loadEaCTask(this.config.configDir),
      ensureApplicationTask(this.config.configDir, appLookup, false, true),
      ensureModifierTask(this.config.configDir, appLookup, false, true),
      this.addModifierToApplication(),
    ];
  }

  protected addModifierToApplication(): ListrTask<AddTaskContext> {
    return withEaCDraftEditTask<AddTaskContext, string[]>(
      'Add modifier to application',
      this.config.configDir,
      (ctx) => [
        ['Applications', ctx.ApplicationLookup, ['ModifierLookups', []]],
      ],
      {
        draftPatch: (ctx) => [[ctx.DFSModifierLookup]],
        applyPatch: (ctx, current, draft, patch) => {
          merge(patch, draft);
        },
      }
    );
  }
}
