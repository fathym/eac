import { Flags } from '@oclif/core';
import { color } from '@oclif/color';
import { ListrTask, PromptOptions } from 'listr2';
import { randomUUID } from 'node:crypto';
import { FathymCommand } from '../../../../../common/fathym-command';
import {
  ActiveEnterpriseTaskContext,
  delay,
  EaCTaskContext,
  ensureActiveEnterprise,
  FathymTaskContext,
  loadEaCTask,
} from '../../../../../common/core-helpers';
import { runProc } from '../../../../../common/task-helpers';
import { downloadFile, withEaCDraft } from '../../../../../common/eac-services';
import { EaCCloudDetails } from '@semanticjs/common';
import loadAxios from '../../../../../common/axios';

interface AzureSubscription {
  id: string;

  name: string;

  tenantId: string;
}

interface UpsertTaskContext
  extends FathymTaskContext,
    ActiveEnterpriseTaskContext,
    EaCTaskContext {
  AzureCLIInstalled: boolean;

  SubscriptionID: string;

  SubscriptionName: string;

  TenantID: string;
}

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
      description:
        'The cloud lookup to use for upsert or declared lookup on create.',
    }),
  };

  static args = [];

  static title = 'Create Azure Cloud';

  protected async loadTasks(): Promise<ListrTask<UpsertTaskContext>[]> {
    const { args, flags } = await this.parse(Upsert);

    let { cloudLookup, generate } = flags;

    cloudLookup = cloudLookup || randomUUID();

    return [
      ensureActiveEnterprise(this.config.configDir),
      loadEaCTask(this.config.configDir),
      this.azureCliInstall(),
      this.setAzureSub(),
      this.createCloudConnection(generate, cloudLookup),
    ];
  }

  protected azureCliInstall(): ListrTask<UpsertTaskContext> {
    return {
      title: `Checking Azure CLI is installed`,
      task: async (ctx, task) => {
        try {
          await runProc('az', []);

          ctx.AzureCLIInstalled = true;
        } catch {
          task.title = 'Installing Azure CLI';

          task.output = 'Downloading the Azure CLI installer';

          await downloadFile(
            'https://aka.ms/installazurecliwindows',
            'azure-cli.msi'
          );

          task.output =
            'Laucnhing the Azure CLI installer.  Completing in the background.';

          // TODO: Cross platform support for msiexec

          await runProc('msiexec', ['/q', '/i', 'azure-cli.msi']);

          await runProc('refreshenv', []);

          task.title = 'Azure CLI was successfully installed';

          ctx.AzureCLIInstalled = true;
        }
      },
    };
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

  protected setAzureSub(): ListrTask<UpsertTaskContext> {
    return {
      title: `Setting Azure Subscription`,
      enabled: (ctx) => ctx.AzureCLIInstalled,
      task: (ctx, task) => {
        return task.newListr((parent) => [
          {
            title: 'Ensure login with Azure CLI',
            task: async (ctx, task) => {
              try {
                await runProc('az', ['account', 'show']);

                task.title = 'Azure CLI already authenticated';
              } catch {
                task.output = color.yellow(
                  'Opening a login form in your browser, complete sign in there, then return.'
                );

                await runProc('az', ['login']);
              }
            },
          },
          {
            title: 'Select Azure Subscription',
            task: async (ctx, task) => {
              const subsList: AzureSubscription[] = JSON.parse(
                (await runProc('az', ['account', 'list'])) || '[]'
              );

              subsList.unshift({
                id: '',
                name: '-- Create New Subscription --',
                tenantId: '',
              });

              ctx.SubscriptionID = (
                await task.prompt({
                  type: 'Select',
                  name: 'subId',
                  message: 'Choose Azure subscription:',
                  choices: subsList.map((account) => {
                    return {
                      message: `${account.name} (${color.blueBright(
                        account.id
                      )})`,
                      name: account.id,
                    };
                  }),
                  validate: (v) => Boolean(v),
                } as PromptOptions<true>)
              ).trim();

              if (ctx.SubscriptionID) {
                const sub = subsList.find((al) => al.id === ctx.SubscriptionID);

                ctx.TenantID = sub?.tenantId || '';

                ctx.SubscriptionName = sub?.name || ctx.SubscriptionID;

                task.title = `Azure subscription selected: ${ctx.SubscriptionName}`;
              } else {
                task.title = `Creating azure subscription`;

                ctx.SubscriptionName = (
                  await task.prompt({
                    type: 'Select',
                    name: 'subId',
                    message: 'Azure subscription name:',
                    choices: subsList.map((account) => {
                      return {
                        message: `${account.name} (${color.blueBright(
                          account.id
                        )})`,
                        name: account.id,
                      };
                    }),
                  } as PromptOptions<true>)
                ).trim();

                task.title = `Creating azure subscription: ${ctx.SubscriptionName}`;

                const sub = await this.createAzureSubscription(
                  this.config.configDir,
                  ctx.ActiveEnterpriseLookup,
                  ctx.SubscriptionName
                );

                ctx.SubscriptionID = sub.id;

                ctx.SubscriptionName = sub.name;

                ctx.TenantID = sub.tenantId;
              }

              await runProc('az', [
                'account',
                'set',
                `--subscription ${ctx.SubscriptionID}`,
              ]);

              parent.title = `Azure subscription set: ${ctx.SubscriptionName}`;
            },
          },
        ]);
      },
    };
  }

  protected async createAzureSubscription(
    configDir: string,
    entLookup: string,
    subName: string
  ): Promise<AzureSubscription> {
    const axios = await loadAxios(configDir);

    const response = await axios.post(`${entLookup}/subscriptions`, {
      Name: subName,
    });

    return response.data.Model as AzureSubscription;
  }
}
