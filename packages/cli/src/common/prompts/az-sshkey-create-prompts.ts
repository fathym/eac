import { color } from '@oclif/color';
import { Config } from '@oclif/core';
import { EaCEnvironmentAsCode } from '@semanticjs/common';
import { mkdir, rm } from 'fs-extra';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { runProc } from '../task-helpers';
const { Confirm, Select } = require('enquirer');

export class AzureSSHKeyCreatePrompt extends Select {
  constructor(options: any = {}) {
    const resGroup = options.resourceGroup;

    if (!resGroup) {
      throw new Error('A resource group is required');
    }

    const config: Config = options.config;

    const keyName = options.keyName || `${resGroup}_lcu_key`;

    let publicKey = '';

    options.result = (val) => {
      if (val) {
        return publicKey;
      }

      return publicKey;
    };

    const env: EaCEnvironmentAsCode =
      options.eac.Environments[options.eac.Enterprise!.PrimaryEnvironment!];

    const cloud = env.Clouds![options.cloudLookup];

    const subscriptionId = cloud.Cloud!.SubscriptionID;

    // throw new Error(subscriptionId);

    options.onSubmit = async (name, val) => {
      let existing: any;

      try {
        existing = JSON.parse(
          await runProc('az', [
            'sshkey',
            'show',
            `--name "${keyName}"`,
            `--resource-group "${resGroup}"`,
            subscriptionId ? `--subscription "${subscriptionId}"` : '',
          ])
        );
      } catch {
        const keyPathDir = path.join(config.configDir, '/.ssh');

        if (!existsSync(keyPathDir)) {
          await mkdir(keyPathDir);
        }

        const keyPath = path.join(keyPathDir, keyName);

        if (existsSync(keyPath)) {
          await rm(keyPath);

          await rm(`${keyPath}.pub`);
        }

        const res = await runProc('ssh-keygen', [
          '-m PEM',
          '-t rsa',
          `-b 2048`,
          `-f "${keyPath}"`,
          '-q',
          `-N ""`,
        ]);

        existing = JSON.parse(
          await runProc('az', [
            'sshkey',
            'create',
            `--name "${keyName}"`,
            `--resource-group "${resGroup}"`,
            `--public-key "@${keyPath}.pub"`,
            subscriptionId ? `--subscription "${subscriptionId}"` : '',
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
