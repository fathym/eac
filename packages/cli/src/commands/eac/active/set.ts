import { color } from '@oclif/color';
import { ListrTask } from 'listr2';
import { FathymCommand } from '../../../common/fathym-command';
import {
  ensurePromptValue,
  FathymTaskContext,
} from '../../../common/core-helpers';
import { listEnterprises, withEaCDraft } from '../../../common/eac-services';
import { Args } from '@oclif/core';
import { withUserAuthConfig } from '../../../common/config-helpers';

export default class Set extends FathymCommand<FathymTaskContext> {
  static description = `Set's the current user's active enterprise for the CLI. Determines
  which enterprise commands are executed against.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = {
    entLookup: Args.string({
      description: 'The enterprise lookup to set as active.',
    }),
  };

  static title = 'Set Active Enterprise';

  protected async loadTasks(): Promise<ListrTask<FathymTaskContext>[]> {
    const { args } = await this.parse(Set);

    let { entLookup } = args;

    return [
      {
        title: `Setting the user's active enterprise`,
        task: async (ctx, task) => {
          const ents = await listEnterprises(this.config.configDir);

          entLookup = (await ensurePromptValue(
            task,
            'Choose enterprise:',
            entLookup!,
            ents.map((ent) => {
              return {
                message: `${ent.Name} (${color.blueBright(ent.Lookup)})`,
                name: ent.Lookup,
              };
            })
          )) as string;

          task.title = `Setting the user's active enterprise to '${entLookup}'`;

          const eacDraft = await withEaCDraft(this.config.configDir);

          if (eacDraft.HasChanges) {
            ctx.Fathym.Instructions = [
              {
                Instruction: 'fathym eac commit',
                Description: `You can now access the EaC via CLI, to manage your enterprie setup.`,
              },
              {
                Instruction: 'fathym eac clear',
                Description: `You can now access the EaC via CLI, to manage your enterprie setup.`,
              },
            ];

            throw new Error(`There are changes against the EaC draft.`);
          } else {
            await withUserAuthConfig(this.config.configDir, async (cfg) => {
              cfg.ActiveEnterpriseLookup = entLookup!;
            });

            ctx.Fathym.Instructions = [
              {
                Instruction: 'fathym eac --help',
                Description: `You can now access the EaC via CLI, to manage your enterprie setup.`,
              },
            ];
          }
        },
      },
    ];
  }
}
