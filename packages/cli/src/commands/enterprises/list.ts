import { color } from '@oclif/color';
import { ListrTask } from 'listr2';
import { EaCEnterpriseDetails } from '@semanticjs/common';
import { FathymCommand } from '../../common/fathym-command';
import { DisplayLookup } from '../../common/DisplayLookup';
import { ClosureInstruction } from '../../common/ClosureInstruction';
import loadAxios from '../../common/axios';
import { ensureActiveEnterprise } from '../../common/auth-helpers';

export default class List extends FathymCommand<any> {
  static description = 'Used to list the current users available enterprises.';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [];

  static title = 'List User Enterprises';

  protected entLookups: DisplayLookup[] = [];

  protected async loadInstructions(
    context: any
  ): Promise<ClosureInstruction[]> {
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

  protected async loadLookups(
    context: any
  ): Promise<{ name: string; lookups: DisplayLookup[] } | undefined> {
    return {
      name: 'ent-lookup',
      lookups: this.entLookups,
    };
  }

  protected async listEnterprises(
    configDir: string
  ): Promise<(EaCEnterpriseDetails & { Lookup: string })[]> {
    const axios = await loadAxios(configDir);

    const response = await axios.get(
      'http://127.0.0.1:7119/api/user/enterprises'
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

          this.entLookups = ents.map((ent) => {
            return {
              Lookup: ent.Lookup,
              Name: ent.Name,
            } as DisplayLookup;
          });

          task.title = 'User enterprises loaded';
        },
      },
    ];
  }
}
