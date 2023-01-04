import Listr from 'listr';
import {} from '@semanticjs/common';
import {
  ClosureInstruction,
  DisplayLookup,
  FathymCommand,
} from '../../common/fathym-command';

export default class List extends FathymCommand {
  static description = 'Used to list the current users available enterprises.';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [];

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

  protected async loadLookups(): Promise<
    { name: string; lookups: DisplayLookup[] } | undefined
  > {
    return {
      name: 'ent-lookup',
      lookups: [
        { Lookup: 'abc-123', Name: 'ABC' },
        { Lookup: 'xyz-789', Name: 'XYZ' },
      ],
    };
  }

  protected async loadTasks(): Promise<Listr> {
    return [
      {
        title: `Loading user enterprises`,
        task: (ctx, task) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              task.title = 'User enterprises loaded';

              resolve(true);
            }, 3000);
          });
        },
      },
    ];
  }
}
