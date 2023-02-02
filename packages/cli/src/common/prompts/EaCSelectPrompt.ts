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

    options.choices = lookups.map((lookup) => {
      return {
        name: lookup,
        message: `${choiceTextFactory(lookup)} (${color.blueBright(lookup)})`,
        validate: (v: any) => options.optional || Boolean(v),
      };
    });

    options.message = message || options.message || 'Select the option:';

    super(options);
  }

  // static Register(): void {
  //   const Enquirer = require('enquirer');

  //   const enquirer = new Enquirer();

  //   enquirer.register(this.PromptKey, this.prototype);
  // }

  static PromptKey: string;
}
