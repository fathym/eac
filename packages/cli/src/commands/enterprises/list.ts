import { color } from '@oclif/color';
import { ListrTask } from 'listr2';
import { EaCEnterpriseDetails } from '@semanticjs/common';
import { FathymCommand } from '../../common/fathym-command';
import { DisplayLookup } from '../../common/DisplayLookup';
import { ClosureInstruction } from '../../common/ClosureInstruction';
import loadAxios from '../../common/axios';

export default class List extends FathymCommand<any> {
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

    const response = await axios.get(
      'http://localhost:7119/api/user/enterprises'
      // 'http://127.0.0.1:7077/api/user/enterprises'
    );

    //  TODO: Handle bad stati

    return response.data?.Model || [];
  }

  protected async loadTasks(): Promise<ListrTask[]> {
    return [
      {
        title: `Loading user enterprises`,
        task: async (ctx, task) => {
          const ents = await this.listEnterprises(this.config.configDir);

          const entLookups = Object.keys(ents);

          this.entLookups = entLookups.map((entLookup) => {
            return {
              Lookup: entLookup,
              Name: ents[entLookup].Name,
            } as DisplayLookup;
          });

          task.title = 'User enterprises loaded';
        },
      },
    ];
  }
}
