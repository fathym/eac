import { ListrTask } from 'listr';
import { EaCEnterpriseDetails } from '@semanticjs/common';
import {
  ClosureInstruction,
  DisplayLookup,
  FathymCommand,
} from '../../common/fathym-command';
import loadAxios from '../../common/axios';

export default class List extends FathymCommand {
  static description = 'Used to list the current users available enterprises.';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [];

  static title = 'List User Enterprises';

  protected entLookups: DisplayLookup[] = [];

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
      lookups: this.entLookups,
    };
  }

  protected async listEnterprises(
    configDir: string
  ): Promise<{ [lookup: string]: EaCEnterpriseDetails }> {
    const axios = await loadAxios(configDir);
    console.log('there');

    const response = await axios.get(
      // 'http://localhost:8119/api/user/enterprises'
      'http://127.0.0.1:7077/api/user/enterprises'
    );
    console.log('now');

    return response.data;
  }

  protected async loadTasks(): Promise<ListrTask[]> {
    return [
      {
        title: `Loading user enterprises`,
        task: async (ctx, task) => {
          task.title = 'Loading...';

          const ents = await this.listEnterprises(this.config.configDir);

          task.title = JSON.stringify(ents);

          this.log(JSON.stringify(ents));

          this.entLookups = [
            { Lookup: 'abc-123', Name: 'ABC' },
            { Lookup: 'xyz-789', Name: 'XYZ' },
          ];

          task.title = JSON.stringify(this.entLookups);

          this.log(JSON.stringify(this.entLookups));

          task.title = 'User enterprises loaded';
        },
      },
    ];
  }
}
