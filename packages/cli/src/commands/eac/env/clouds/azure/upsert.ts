import { Flags } from '@oclif/core';
import { color } from '@oclif/color';
import { ListrTask, PromptOptions } from 'listr2';
import { randomUUID } from 'node:crypto';
import { FathymCommand } from '../../../../../common/fathym-command';
import {
  ActiveEnterpriseTaskContext,
  azureCliInstallTask,
  AzureCLITaskContext,
  delay,
  EaCTaskContext,
  ensureActiveEnterprise,
  FathymTaskContext,
  loadEaCTask,
  setAzureSubTask,
  SubscriptionTaskContext,
} from '../../../../../common/core-helpers';
import { runProc } from '../../../../../common/task-helpers';
import { downloadFile, withEaCDraft } from '../../../../../common/eac-services';
import { EaCCloudDetails } from '@semanticjs/common';
import loadAxios from '../../../../../common/axios';

interface UpsertTaskContext
  extends FathymTaskContext,
    ActiveEnterpriseTaskContext,
    EaCTaskContext,
    AzureCLITaskContext,
    SubscriptionTaskContext {}

export default class Upsert extends FathymCommand<UpsertTaskContext> {
  static description = `Used for creating a new project.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    generate: Flags.boolean({
      char: 'g',
      allowNo: true,
      description:
        'Determines if the CLI should help generate the cloud connection.',
    }),
    cloudLookup: Flags.string({
      char: 'c',
      description: 'The cloud lookup to use for upsert.',
    }),
  };

  static args = [];

  static title = 'Upsert Azure Cloud';

  protected async loadTasks(): Promise<ListrTask<UpsertTaskContext>[]> {
    const { args, flags } = await this.parse(Upsert);

    let { cloudLookup } = flags;

    const { generate } = flags;

    cloudLookup = cloudLookup || randomUUID();

    return [
      ensureActiveEnterprise(this.config.configDir),
      loadEaCTask(this.config.configDir),
      azureCliInstallTask(),
      setAzureSubTask(this.config.configDir),
      this.createCloudConnection(generate, cloudLookup),
    ];
  }

  protected createCloudConnection(
    generate: boolean,
    cloudLookup: string
  ): ListrTask<UpsertTaskContext> {
    return {
      title: 'Create cloud subscription connection',
      enabled: (ctx) => ctx.AzureCLIInstalled,
      task: async (ctx, task) => {
        const env =
          ctx.EaC.Environments![ctx.EaC.Enterprise?.PrimaryEnvironment!];

        const currentCloud =
          env.Clouds && env.Clouds[cloudLookup]
            ? env.Clouds[cloudLookup!].Cloud || {}
            : {};

        let azCloud: EaCCloudDetails = {
          Name: ctx.SubscriptionName,
          Description: `Created using Fathym CLI with Azure CLI: ${ctx.SubscriptionName}`,
          Type: 'Azure',
          SubscriptionID: currentCloud.SubscriptionID,
          TenantID: currentCloud.TenantID,
          ApplicationID: currentCloud.ApplicationID,
          AuthKey: currentCloud.AuthKey,
        };

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

          azCloud = {
            ...azCloud,
            ApplicationID: svcPrinc.appId,
            AuthKey: svcPrinc.password,
            SubscriptionID: ctx.SubscriptionID,
            TenantID: svcPrinc.tenant,
          };
        }

        await withEaCDraft(
          this.config.configDir,
          ctx.ActiveEnterpriseLookup,
          async (draft) => {
            if (!draft.EaC!.Environments) {
              draft.EaC!.Environments = {};
            }

            if (
              !draft.EaC!.Environments![ctx.EaC.Enterprise!.PrimaryEnvironment!]
            ) {
              draft.EaC!.Environments![
                ctx.EaC.Enterprise!.PrimaryEnvironment!
              ] = {};
            }

            draft.EaC!.Environments![
              ctx.EaC.Enterprise!.PrimaryEnvironment!
            ].Clouds = {
              [cloudLookup]: {
                Cloud: azCloud,
              },
            };

            return draft;
          }
        );
      },
    };
  }
}
