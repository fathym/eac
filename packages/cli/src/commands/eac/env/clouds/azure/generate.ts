import { Args, Flags } from '@oclif/core';
import { ListrTask } from 'listr2';
import { randomUUID } from 'node:crypto';
import { FathymCommand } from '../../../../../common/fathym-command';
import { runProc } from '../../../../../common/task-helpers';
import {
  ActiveEnterpriseTaskContext,
  ActiveLicenseTaskContext,
  EaCTaskContext,
  ensureActiveEnterpriseTask,
  ensureActiveLicenseTask,
  loadEaCTask,
  setAzureSubTask,
  withEaCDraftEditTask,
} from '../../../../../common/eac-services';
import { EaCCloudDetails } from '@semanticjs/common';
import {
  FathymTaskContext,
  AzureCLITaskContext,
  SubscriptionTaskContext,
  azureCliInstallTask,
  removeUndefined,
  ensureAzureCliSetupTask,
} from '../../../../../common/core-helpers';

interface DefineTaskContext
  extends FathymTaskContext,
    ActiveEnterpriseTaskContext,
    ActiveLicenseTaskContext,
    EaCTaskContext,
    AzureCLITaskContext,
    SubscriptionTaskContext {}

export default class Define extends FathymCommand<DefineTaskContext> {
  static description = `Used for defining a new cloud connection.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    generate: Flags.boolean({
      char: 'g',
      allowNo: true,
      description:
        'Determines if the CLI should help generate the cloud connection.',
    }),
  };

  static args = {
    cloudLookup: Args.string({
      description: 'The cloud lookup to use for define.',
    }),
  };

  static title = 'Define Azure Cloud';

  protected async loadTasks(): Promise<ListrTask<DefineTaskContext>[]> {
    const { args, flags } = await this.parse(Define);

    let { cloudLookup } = args;

    const { generate } = flags;

    cloudLookup = cloudLookup || randomUUID();

    return [
      setAzureSubTask(this.config.configDir),
      await this.createCloudConnection(generate, cloudLookup),
    ];
  }

  protected async createCloudConnection(
    generate: boolean,
    cloudLookup: string
  ): Promise<ListrTask<DefineTaskContext, any>> {
    const generated: Record<string, any> = {};

    return {
      title: 'Log cloud connection',
      task: async (ctx, task) => {
        ctx.Fathym.Result = JSON.stringify(
          {
            Name: ctx.SubscriptionName,
            Description: `Created using Fathym CLI with Azure CLI: ${ctx.SubscriptionName}`,
            Type: 'Azure',
            ApplicationID: ctx.ApplicationID,
            AuthKey: ctx.AuthKey,
            TenantID: ctx.TenantID,
            SubscriptionID: ctx.SubscriptionID,
          },
          undefined,
          2
        );
      },
    };
  }
}
