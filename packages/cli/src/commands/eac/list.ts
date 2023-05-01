import { color } from '@oclif/color';
import { ListrTask } from 'listr2';
import { FathymCommand } from '../../common/fathym-command';
import { ClosureInstruction } from '../../common/ClosureInstruction';
import { FathymTaskContext } from '../../common/core-helpers';
import { listEnterprises } from '../../common/eac-services';

export default class List extends FathymCommand<FathymTaskContext> {
  static description = 'Used to list the current users available enterprises.';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = {};

  static title = 'List User Enterprises';

  protected async loadInstructions(): Promise<ClosureInstruction[]> {
    return [
      {
        Instruction: 'fathym enterprises set {ent-lookup}',
        Description: `Use this command to set the active
enterprise for your commands.  The
lookup comes from the light blue
value in '()' above.`,
      },
    ];
  }

  protected async loadTasks(): Promise<ListrTask<FathymTaskContext>[]> {
    return [
      {
        title: `Loading user enterprises`,
        task: async (ctx, task) => {
          const ents = await listEnterprises(this.config.configDir);

          const entLookups = ents.map((ent) => {
            return `${ent.Name} (${color.blueBright(ent.Lookup)})`;
          });

          ctx.Fathym.Lookups = {
            name: `Name (${color.blueBright('ent-lookup')})`,
            lookups: entLookups,
          };

          ctx.Fathym.Instructions = await this.loadInstructions();

          task.title = 'User enterprises loaded';
        },
      },
    ];
  }
}