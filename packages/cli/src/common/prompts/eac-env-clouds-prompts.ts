import { color } from '@oclif/color';
const { Select } = require('enquirer');
import { EaCSelectPrompt } from './EaCSelectPrompt';
import { EaCSelectPromptOptions } from './EaCSelectPromptOptions';

export class CloudSelect extends EaCSelectPrompt {
  constructor(options: EaCSelectPromptOptions & any = {}) {
    const env =
      options.eac.Environments[options.eac.Enterprise!.PrimaryEnvironment!];

    const clouds = Object.keys(env?.Clouds || {});

    super(
      options,
      'Select cloud connection',
      () => clouds,
      (lookup) => {
        const cloudName = env.Clouds[lookup]?.Cloud?.Name || '';

        return `${cloudName} (${color.blueBright(lookup)})`;
      }
    );
  }

  static Register(): void {
    const Enquirer = require('enquirer');

    const enquirer = new Enquirer();

    enquirer.register(this.PromptKey, CloudSelect);
  }

  static PromptKey = 'eac:env:clouds|select';
}

CloudSelect.Register();
