import { color } from '@oclif/color';
import { ListrTask, PromptOptions } from 'listr2';
import {} from '@semanticjs/common';
import { FathymCommand } from '../../common/fathym-command';
import { ClosureInstruction } from '../../common/ClosureInstruction';
import {
  ActiveEnterpriseTaskContext,
  ensureActiveEnterprise,
  FathymTaskContext, 
} from '../../common/core-helpers';
import { listLicensesByEmail, listLicenseTypes } from '../../common/eac-services';

interface GetContext extends FathymTaskContext, ActiveEnterpriseTaskContext {}
export default class Get extends FathymCommand<GetContext> {
  static description = `Get's the current user's active license by licenseType for the CLI. Determines
  if a user has access to provision cloud resources in Azure.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [{ name: 'licenseType', required: false }];

  static title = 'Get Active License';

  protected async loadTasks(): Promise<ListrTask<GetContext>[]> {
    const { args } = await this.parse(Get);

    let { licenseType } = args;

    return [
      {
        task: async (ctx, task) => {
          const licenseTypes = await listLicenseTypes(this.config.configDir)
      if(!licenseType){      
        licenseType = (
          await task.prompt({
            type: 'Select',
            name: 'licenseType',
            message: 'Choose License Type:',
            choices: licenseTypes.map((licenseType) => {
              return {
                message: `${color.blueBright(licenseType)})`,
                name: licenseType,
              };
            }),
            validate: (v: any) => Boolean(v),
          } as PromptOptions<true>)
        ).trim();        
      }
      await listLicensesByEmail(this.config.configDir, licenseType)
    },
  },
];
  }
}
