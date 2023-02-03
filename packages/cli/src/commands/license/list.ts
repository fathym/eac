import { color } from '@oclif/color';
import { ListrTask } from 'listr2';
import { EaCEnterpriseDetails } from '@semanticjs/common';
import { FathymCommand } from '../../common/fathym-command';
import { ClosureInstruction } from '../../common/ClosureInstruction';
import loadAxios from '../../common/axios';
import {
  ensureActiveEnterprise,
  FathymTaskContext,
  loadApiRootUrl,
} from '../../common/core-helpers';
import { listEnterprises, listLicensesByEmail } from '../../common/eac-services';

export default class List extends FathymCommand<FathymTaskContext> {
  static description = 'Used to list the current users active licenses.';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [];

  static title = 'List Licenses';

  protected async loadInstructions(): Promise<ClosureInstruction[]> {
    return [
      {
        Instruction: 'fathym licenses list',
        Description: `Use this command to list all licenses for current user`,
      },
    ];
  }

  protected async loadTasks(): Promise<ListrTask<FathymTaskContext>[]> {
    return [
      {
        title: `Loading user licenses`,
        task: async (ctx, task) => {
          await listLicensesByEmail(this.config.configDir)

          // const entLookups = ents.map((ent) => {
          //   return `${ent.Name} (${color.blueBright(ent.Lookup)})`;
          // });

          // ctx.Fathym.Lookups = {
          //   name: `Name (${color.blueBright('ent-lookup')})`,
          //   lookups: entLookups,
          // };

          // ctx.Fathym.Instructions = await this.loadInstructions();

          // task.title = 'User enterprises loaded';
        },
      },
    ];
  }
}
