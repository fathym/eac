import { color } from '@oclif/color';
import { EaCEnvironmentAsCode } from '@semanticjs/common';
const { Select } = require('enquirer');
import { EaCSelectPrompt } from './EaCSelectPrompt';
import { EaCSelectPromptOptions } from './EaCSelectPromptOptions';

export class SourceSelect extends EaCSelectPrompt {
  constructor(options: EaCSelectPromptOptions & any = {}) {
    const env: EaCEnvironmentAsCode =
      options.eac.Environments[options.eac.Enterprise!.PrimaryEnvironment!];

    const sources = Object.keys(env?.Sources || {});

    super(
      options,
      'Select source connection',
      () => sources,
      (lookup) => {
        const sourceName = env.Sources![lookup]?.Name || '';

        return `${sourceName} (${color.blueBright(lookup)})`;
      }
    );
  }

  static Register(): void {
    const Enquirer = require('enquirer');

    const enquirer = new Enquirer();

    enquirer.register(this.PromptKey, SourceSelect);
  }

  static PromptKey = 'eac:env:sources|select';
}

SourceSelect.Register();
