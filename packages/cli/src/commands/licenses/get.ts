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
import {
  ensurePromptValue,
  listLicensesByEmail,
  listLicenseTypes,
} from '../../common/eac-services';
import { Args } from '@oclif/core';

export default class Get extends FathymCommand<FathymTaskContext> {
  static description = `Get's the current user's active license by licenseType for the CLI. Determines
  if a user has access to provision cloud resources in Azure.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = {
    licenseType: Args.string({
      description: 'The license type to get',
    }),
  };

  static title = 'Get Active License';

  protected async loadTasks(): Promise<ListrTask<FathymTaskContext>[]> {
    const { args } = await this.parse(Get);

    let { licenseType } = args;

    return [
      {
        task: async (ctx, task) => {
          const licenseTypes = await listLicenseTypes(this.config.configDir);

          licenseType = await ensurePromptValue(
            task,
            'Choose License Type:',
            licenseType,
            licenseTypes.map((licenseType) => {
              return {
                message: `${color.blueBright(licenseType)})`,
                name: licenseType,
              };
            })
          );

          await listLicensesByEmail(this.config.configDir, licenseType);
        },
      },
    ];
  }
}
