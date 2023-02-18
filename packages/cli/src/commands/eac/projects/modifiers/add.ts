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
    ProjectTaskContext,
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
      ensureActiveEnterprise(this.config.configDir),
      loadEaCTask(this.config.configDir),
      ensureProject(this.config.configDir, projectLookup, false, true),
      ensureModifier(this.config.configDir, projectLookup, false, true),
      this.addModifierToProject(),
    ];
  }

  protected addModifierToProject(): ListrTask<AddTaskContext> {
    return {
      title: 'Add modifier to project',
      task: async (ctx, task) => {
        await withEaCDraft(
          this.config.configDir,
          ctx.ActiveEnterpriseLookup,
          async (draft) => {
            draft.EaC.Projects![ctx.ProjectLookup].ModifierLookups?.push(
              ctx.DFSModifierLookup
            );

            return draft;
          },
          [['Projects', ctx.ProjectLookup, ['ModifierLookups', []]]]
        );
      },
    };
  }
}
