import { Args } from '@oclif/core';
import { ListrTask } from 'listr2';
import {} from '@semanticjs/common';
import { FathymCommand } from '../../../../common/fathym-command';
import { ClosureInstruction } from '../../../../common/ClosureInstruction';
import {
  ActiveEnterpriseTaskContext,
  ApplicationTaskContext,
  DFSModifierTaskContext,
  EaCTaskContext,
  ensureActiveEnterprise,
  ensureApplication,
  ensureModifier,
  ensureProject,
  FathymTaskContext,
  loadEaCTask,
  ProjectTaskContext,
} from '../../../../common/core-helpers';
import { withEaCDraft } from '../../../../common/eac-services';

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
      ensureActiveEnterprise(this.config.configDir),
      loadEaCTask(this.config.configDir),
      ensureApplication(this.config.configDir, appLookup, false, true),
      ensureModifier(this.config.configDir, appLookup, false, true),
      this.addModifierToApplication(),
    ];
  }

  protected addModifierToApplication(): ListrTask<AddTaskContext> {
    return {
      title: 'Add modifier to application',
      task: async (ctx, task) => {
        await withEaCDraft(
          this.config.configDir,
          ctx.ActiveEnterpriseLookup,
          async (draft) => {
            draft.EaC.Applications![
              ctx.ApplicationLookup
            ].ModifierLookups?.push(ctx.DFSModifierLookup);

            return draft;
          },
          [['Applications', ctx.ApplicationLookup, ['ModifierLookups', []]]]
        );
      },
    };
  }
}
