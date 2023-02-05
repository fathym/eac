import { color } from '@oclif/color';
import { runProc } from '../task-helpers';
const { Confirm, Select } = require('enquirer');

export class AzureSSHKeyCreatePrompt extends Select {
  constructor(options: any = {}) {
    const resGroup = options.resourceGroup;

    if (!resGroup) {
      throw new Error('A resource group is required');
    }

    let publicKey = 'gkfjhjfjgd';

    options.result = (val) => {
      if (val) {
        return publicKey;
      }

      return publicKey;
    };

    options.onSubmit = async (name, val) => {
      let existing: any;

      try {
        existing = JSON.parse(
          await runProc('az', [
            'sshkey',
            'show',
            `--resource-group "${resGroup}"`,
            `--name "${resGroup}_lcu_key"`,
          ])
        );
      } catch {
        existing = JSON.parse(
          await runProc('az', [
            'sshkey',
            'create',
            `--resource-group "${resGroup}"`,
            `--name "${resGroup}_lcu_key"`,
          ])
        );
      }

      publicKey = existing.publicKey;
    };

    options.message = options.meesage || 'Create new Azure SSH Key?';

    options.choices = ['Create'];

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
