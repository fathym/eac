import { color } from '@oclif/color';
const { Confirm } = require('enquirer');

export class AzureSSHKeyCreatePrompt extends Confirm {
  constructor(options: any = {}) {
    const resGroup = options.resourceGroup;

    if (!resGroup) {
      throw new Error('A resource group is required');
    }

    options.result = (val) => {
      throw new Error(val);

      if (val) {
      }

      return val;
    };

    super(options);
  }

  static Register(): void {
    const Enquirer = require('enquirer');

    const enquirer = new Enquirer();

    enquirer.register(this.PromptKey, AzureSSHKeyCreatePrompt);
  }

  static PromptKey = 'az:sshkey:create|confirm';
}

AzureSSHKeyCreatePrompt.Register();
