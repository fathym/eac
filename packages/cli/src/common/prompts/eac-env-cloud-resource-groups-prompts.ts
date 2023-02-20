import { color } from '@oclif/color';
import { EaCSelectPrompt } from './EaCSelectPrompt';
import { EaCSelectPromptOptions } from './EaCSelectPromptOptions';

export class CloudResourceGroupSelect extends EaCSelectPrompt {
  constructor(options: EaCSelectPromptOptions & any = {}) {
    const env =
      options.eac.Environments[options.eac.Enterprise!.PrimaryEnvironment!];

    const cloud = env.Clouds![options.cloudLookup];

    const resGroups = Object.keys(cloud?.ResourceGroups || {});

    super(
      options,
      'Select cloud resource group',
      () => resGroups,
      (lookup) => {
        const cloudResGroupName = cloud?.ResourceGroups[lookup]?.Name || '';

        return lookup === '$--empty--$'
          ? '-- Create new cloud resource group --'
          : `${cloudResGroupName} (${color.blueBright(lookup)})`;
      }
    );
  }

  static Register(): void {
    const Enquirer = require('enquirer');

    const enquirer = new Enquirer();

    enquirer.register(this.PromptKey, CloudResourceGroupSelect);
  }

  static PromptKey = 'eac:env:clouds:groups|select';
}

CloudResourceGroupSelect.Register();
