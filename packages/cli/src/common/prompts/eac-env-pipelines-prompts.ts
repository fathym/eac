import { color } from '@oclif/color';
import { EaCEnvironmentAsCode } from '@semanticjs/common';
const { Select } = require('enquirer');
import { EaCSelectPrompt } from './EaCSelectPrompt';
import { EaCSelectPromptOptions } from './EaCSelectPromptOptions';

export class PipelineSelect extends EaCSelectPrompt {
  constructor(options: EaCSelectPromptOptions & any = {}) {
    const env: EaCEnvironmentAsCode =
      options.eac.Environments[options.eac.Enterprise!.PrimaryEnvironment!];

    const doas = Object.keys(env?.DevOpsActions || {});

    super(
      options,
      'Select pipeline connection',
      () => doas,
      (lookup) => {
        const pipelineName = env.DevOpsActions![lookup]?.Name || '';

        return lookup === '$--empty--$'
          ? '- Create New -'
          : `${pipelineName} (${color.blueBright(lookup)})`;
      }
    );
  }

  static Register(): void {
    const Enquirer = require('enquirer');

    const enquirer = new Enquirer();

    enquirer.register(this.PromptKey, PipelineSelect);
  }

  static PromptKey = 'eac:env:pipelines|select';
}

PipelineSelect.Register();
