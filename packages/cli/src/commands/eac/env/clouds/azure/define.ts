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
  ensureAzureCliSetupTask,
} from '../../../../../common/core-helpers';

interface DefineTaskContext
  extends FathymTaskContext,
    ActiveEnterpriseTaskContext,
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
      ensureActiveEnterpriseTask(this.config.configDir),
      loadEaCTask(this.config.configDir),
      await setAzureSubTask(this.config.configDir),
      await this.createCloudConnection(generate, cloudLookup),
    ];
  }

  protected async  createCloudConnection(
    generate: boolean,
    cloudLookup: string
  ): Promise<ListrTask<DefineTaskContext, any>> {
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
              Type: "Azure",
            },
          ],
        ],
      ],
      {
        enabled: (ctx) => ctx.AzureCLIInstalled,
        prompt: async (ctx, task) => {
          //if (generate) {
            let svcPrincStr = '{}';

            try {
              svcPrincStr = await runProc('az', [
                'ad',
                'sp',
                'create-for-rbac',
                // `--name "${ctx.SubscriptionID}"`,
                '--role Contributor',
                `--scopes /subscriptions/${ctx.SubscriptionID}`,
                // `--tenant ${ctx.TenantID}`,
              ]);
            } catch {
              //  TODO:  Would be nice if this was done in it's own task as part of the ensureAzureCli step, but couldn't find a way to get it to fail without actual rbac creation
              await runProc('az', ['account', 'clear']);

              await runProc('az', ['logout']);

              await runProc('az', ['login']);

              svcPrincStr = await runProc('az', [
                'ad',
                'sp',
                'create-for-rbac',
                // `--name "${ctx.SubscriptionID}"`,
                '--role Contributor',
                `--scopes /subscriptions/${ctx.SubscriptionID}`,
                // `--tenant ${ctx.TenantID}`,
              ]);
            }

            const svcPrinc = JSON.parse(svcPrincStr || '{}');

            generated = {
              Type: 'Azure',
              ApplicationID: svcPrinc.appId,
              AuthKey: svcPrinc.password,
              SubscriptionID: ctx.SubscriptionID,
              TenantID: svcPrinc.tenant,
            };
          //}
        },
        draftPatch: (ctx) => {
          const patch = {
            ...removeUndefined(generated),
            // Type: generated['Type'],
            // ApplicationID: "My APplication Id",
            // AuthKey: generated['AuthKey'] as string,
            // SubscriptionID: generated['SubscriptionID'],
            // TenantID: generated['TenantID'],
          };

          return patch;
        },
      }
    );
  }
}
