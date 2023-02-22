import { Args, Flags } from '@oclif/core';
import { ListrTask } from 'listr2';
import { FathymCommand } from '../../../common/fathym-command';
import {
  ActiveEnterpriseTaskContext,
  ApplicationTaskContext,
  DFSModifierTaskContext,
  EaCTaskContext,
  ensureActiveEnterpriseTask,
  ensureModifierTask,
  loadEaCTask,
  ProjectTaskContext,
  withEaCDraftEditTask,
} from '../../../common/eac-services';
import { FathymTaskContext } from '../../../common/core-helpers';
import { EaCDFSModifier } from '@semanticjs/common';

interface DefineTaskContext
  extends FathymTaskContext,
    ActiveEnterpriseTaskContext,
    EaCTaskContext,
    ProjectTaskContext,
    ApplicationTaskContext,
    DFSModifierTaskContext {}

export default class Define extends FathymCommand<DefineTaskContext> {
  static description = `Used for defining a DFS modifier.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    name: Flags.string({
      char: 'n',
      description: 'The name of the modifier.',
    }),
    pathFilter: Flags.string({
      char: 'f',
      description: 'The path filter regex of the modifier.',
    }),
    priority: Flags.integer({
      char: 'p',
      description: 'The priority of the modifier.',
    }),
    disabled: Flags.boolean({
      char: 'd',
      description: 'Wether the modifier is disabled or not.',
    }),
    details: Flags.string({
      char: 'p',
      description: 'The string version of the details JSON.',
    }),
  };

  static args = {
    modifierLookup: Args.string({
      description: 'The modifier lookup to use for define.',
    }),
  };

  static title = 'Define DFS Modifier';

  protected async loadTasks(): Promise<ListrTask<DefineTaskContext>[]> {
    const { args, flags } = await this.parse(Define);

    const { modifierLookup } = args;

    const { name, pathFilter, priority, disabled, details } = flags;

    return [
      ensureActiveEnterpriseTask(this.config.configDir),
      loadEaCTask(this.config.configDir),
      ensureModifierTask(this.config.configDir, modifierLookup, true, true),
      this.addModifierToDraft(name, pathFilter, priority, disabled, details),
    ];
  }

  protected addModifierToDraft(
    name?: string,
    pathFilter?: string,
    priority?: number,
    disabled?: boolean,
    details?: string
  ): ListrTask<DefineTaskContext> {
    return withEaCDraftEditTask<DefineTaskContext, EaCDFSModifier>(
      'Define DFS modifier',
      this.config.configDir,
      (ctx) => [['Modifiers', ctx.DFSModifierLookup]],
      {
        draftPatch: (ctx) => {
          const patch: EaCDFSModifier = {
            Name: name,
            Priority: priority,
            Enabled: !disabled,
            PathFilterRegex: pathFilter,
            Details: details,
          };

          return patch;
        },
      }
    );
  }
}
