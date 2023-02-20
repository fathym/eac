import { color } from '@oclif/color';
import { EaCSelectPromptOptions } from './EaCSelectPromptOptions';
const { Select } = require('enquirer');

export class EaCSelectPrompt extends Select {
  constructor(
    options: EaCSelectPromptOptions,
    message: string,
    choiceLookupsFactory: () => string[],
    choiceTextFactory: (lookup: string) => string
  ) {
    const lookups = choiceLookupsFactory();

    if (options.optional) {
      lookups.push('$--empty--$');
    }

    options.choices = lookups.map((lookup) => {
      return {
        name: lookup,
        message: `${choiceTextFactory(lookup)}`,
        validate: (v: any) => options.optional || Boolean(v),
      };
    });

    options.message = message || options.message || 'Select the option:';

    options.result = (val) => {
      return val === '$--empty--$' ? '' : val;
    };

    super(options);
  }

  // static Register(): void {
  //   const Enquirer = require('enquirer');

  //   const enquirer = new Enquirer();

  //   enquirer.register(this.PromptKey, this.prototype);
  // }

  static PromptKey: string;
}
