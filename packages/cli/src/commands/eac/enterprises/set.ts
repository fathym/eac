import { color } from '@oclif/color';
import { ListrTask, PromptOptions } from 'listr2';
import {} from '@semanticjs/common';
import { FathymCommand } from '../../../common/fathym-command';
import { ClosureInstruction } from '../../../common/ClosureInstruction';
import {
  FathymTaskContext,
  withUserAuthConfig,
} from '../../../common/core-helpers';
import { listEnterprises, withEaCDraft } from '../../../common/eac-services';

export default class Set extends FathymCommand<FathymTaskContext> {
  static description = `Set's the current user's active enterprise for the CLI. Determines
  which enterprise commands are executed against.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [{ name: 'entLookup', required: false }];

  static title = 'Set Active Enterprise';

  protected async loadTasks(): Promise<ListrTask<FathymTaskContext>[]> {
    const { args } = await this.parse(Set);

    let { entLookup } = args;

    return [
      {
        title: `Setting the user's active enterprise to '${
          entLookup || 'selection'
        }'`,
        task: async (ctx, task) => {
          if (!entLookup) {
            const ents = await listEnterprises(this.config.configDir);

            entLookup = (
              await task.prompt({
                type: 'Select',
                name: 'entLookup',
                message: 'Choose enterprise:',
                choices: ents.map((ent) => {
                  return {
                    message: `${ent.Name} (${color.blueBright(ent.Lookup)})`,
                    name: ent.Lookup,
                  };
                }),
                validate: (v: any) => Boolean(v),
              } as PromptOptions<true>)
            ).trim();
          }

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
              cfg.ActiveEnterpriseLookup = entLookup;

              return cfg;
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
