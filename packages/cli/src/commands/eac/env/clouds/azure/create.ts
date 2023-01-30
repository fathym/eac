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

interface AzureCreateTaskContext
  extends FathymTaskContext,
    ActiveEnterpriseTaskContext,
    EaCTaskContext {
  AzureCLIInstalled: boolean;

  SubscriptionID: string;

  SubscriptionName: string;

  TenantID: string;
}

export default class AzureCreate extends FathymCommand<AzureCreateTaskContext> {
  static description = `Used for creating a new project.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    generate: Flags.boolean({
      char: 'g',
      description:
        'Determines if the CLI should help generate the service principal.',
    }),
  };

  static args = [];

  static title = 'Create Azure Cloud';

  protected async loadTasks(): Promise<ListrTask<AzureCreateTaskContext>[]> {
    const { args, flags } = await this.parse(AzureCreate);

    const { generate } = flags;

    return [
      ensureActiveEnterprise(this.config.configDir),
      loadEaCTask(this.config.configDir),
      {
        title: `Checking Azure CLI is installed`,
        enabled: generate,
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

            await runProc('msiexec', ['/q', '/i', 'azure-cli.msi']);

            await delay(2000);

            task.title = 'Azure CLI was successfully installed';

            ctx.AzureCLIInstalled = true;
          }
        },
      },
      {
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
                const subsList: {
                  id: string;
                  name: string;
                  tenantId: string;
                }[] = JSON.parse(
                  (await runProc('az', ['account', 'list'])) || '[]'
                );

                ctx.SubscriptionID = (
                  await task.prompt({
                    type: 'Select',
                    // type: 'Input',
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
                    validate: (v: any) => Boolean(v),
                  } as PromptOptions<true>)
                ).trim();

                const sub = subsList.find((al) => al.id === ctx.SubscriptionID);

                ctx.TenantID = sub?.tenantId || '';

                ctx.SubscriptionName = sub?.name || ctx.SubscriptionID;

                task.title = `Azure subscription selected: ${ctx.SubscriptionName}`;

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
      },
      {
        title: 'Create new subscription service principal',
        enabled: (ctx) => ctx.AzureCLIInstalled,
        task: async (ctx, task) => {
          // const svcPrincName = (
          //   await task.prompt({
          //     type: 'Input',
          //     name: 'svcPrincName',
          //     message: `Choose name for service principal:`,
          //     validate: (v: any) => Boolean(v),
          //   } as PromptOptions<true>)
          // ).trim();

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

          const azCloud: EaCCloudDetails = {
            Name: ctx.SubscriptionName,
            Description: `Created using Fathym CLI with Azure CLI: ${ctx.SubscriptionName}`,
            ApplicationID: svcPrinc.appId,
            AuthKey: svcPrinc.password,
            SubscriptionID: ctx.SubscriptionID,
            TenantID: svcPrinc.tenant,
            Type: 'Azure',
          };

          await withEaCDraft(
            this.config.configDir,
            ctx.ActiveEnterpriseLookup,
            async (draft) => {
              if (!draft.EaC!.Environments) {
                draft.EaC!.Environments = {};
              }

              if (
                !draft.EaC!.Environments![
                  ctx.EaC.Enterprise!.PrimaryEnvironment!
                ]
              ) {
                draft.EaC!.Environments![
                  ctx.EaC.Enterprise!.PrimaryEnvironment!
                ] = {};
              }

              draft.EaC!.Environments![
                ctx.EaC.Enterprise!.PrimaryEnvironment!
              ].Clouds = {
                [randomUUID()]: {
                  Cloud: azCloud,
                },
              };

              return draft;
            }
          );
        },
      },
    ];
  }
}
