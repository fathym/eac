import { Args, Flags } from '@oclif/core';
import { ListrTask } from 'listr2';
import { randomUUID } from 'node:crypto';
import { FathymCommand } from '../../../../../common/fathym-command';
import { runProc } from '../../../../../common/task-helpers';
import {
  ActiveEnterpriseTaskContext,
  EaCTaskContext,
  ensureActiveEnterpriseTask,
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
} from '../../../../../common/core-helpers';

interface DefineTaskContext
  extends FathymTaskContext,
    ActiveEnterpriseTaskContext,
    EaCTaskContext,
    AzureCLITaskContext,
    SubscriptionTaskContext {}

export default class Define extends FathymCommand<DefineTaskContext> {
  static description = `Used for creating a new project.`;

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
      ensureActiveEnterpriseTask(this.config.configDir),
      loadEaCTask(this.config.configDir),
      azureCliInstallTask(),
      setAzureSubTask(this.config.configDir),
      this.createCloudConnection(generate, cloudLookup),
    ];
  }

  protected createCloudConnection(
    generate: boolean,
    cloudLookup: string
  ): ListrTask<DefineTaskContext> {
    let generated: Record<string, any> = {};

    return withEaCDraftEditTask<DefineTaskContext, EaCCloudDetails>(
      'Create cloud subscription connection',
      this.config.configDir,
      (ctx) => [
        [
          'Environments',
          ctx.EaC.Enterprise!.PrimaryEnvironment!,
          'Clouds',
          cloudLookup,
          [
            'Cloud',
            {
              Name: ctx.SubscriptionName,
              Description: `Created using Fathym CLI with Azure CLI: ${ctx.SubscriptionName}`,
            },
          ],
        ],
      ],
      {
        enabled: (ctx) => ctx.AzureCLIInstalled,
        prompt: async (ctx, task) => {
          if (generate) {
            const svcPrincStr = await runProc('az', [
              'ad',
              'sp',
              'create-for-rbac',
              // `--name "${ctx.SubscriptionID}"`,
              '--role Contributor',
              `--scopes /subscriptions/${ctx.SubscriptionID}`,
              // `--tenant ${ctx.TenantID}`,
            ]);

            const svcPrinc = JSON.parse(svcPrincStr);

            generated = {
              Type: 'Azure',
              ApplicationID: svcPrinc.appId,
              AuthKey: svcPrinc.password,
              SubscriptionID: ctx.SubscriptionID,
              TenantID: svcPrinc.tenant,
            };
          }
        },
        draftPatch: (ctx) => {
          const patch = {
            ...removeUndefined(generated),
          };

          return patch;
        },
      }
    );
  }
}
