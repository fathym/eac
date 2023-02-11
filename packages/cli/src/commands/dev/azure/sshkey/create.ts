import { Args, Flags } from '@oclif/core';
import { ListrTask } from 'listr2';
import open from 'open';
import { FathymCommand } from '../../../../common/fathym-command';
import {
  ActiveEnterpriseTaskContext,
  azureCliInstallTask,
  AzureCLITaskContext,
  EaCTaskContext,
  ensureActiveEnterprise,
  FathymTaskContext,
  loadEaCTask,
} from '../../../../common/core-helpers';
import { runProc } from '../../../../common/task-helpers';
import {
  azSshKeyCreateTask,
  CloudResourceGroupTaskContext,
  CloudTaskContext,
  ensureCloudResourceGroupTask,
  ensureCloudTask,
  SSHKeyTaskContext,
} from '../../../../common/eac-services';

interface SSHKeyContext
  extends FathymTaskContext,
    CloudTaskContext,
    CloudResourceGroupTaskContext,
    EaCTaskContext,
    ActiveEnterpriseTaskContext,
    AzureCLITaskContext,
    SSHKeyTaskContext {}

export default class SSHKey extends FathymCommand<SSHKeyContext> {
  static description = `Used for opening the link the the Azure CLI installer.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    keyName: Flags.string({
      char: 'n',
      description: 'Set the name of the SSH key to create.',
    }),
  };

  static args = {
    resourceGroup: Args.string({
      description: 'The resource group to create the SSH key for',
    }),
  };

  static title = 'Azure SSH Key Create';

  protected async loadTasks(): Promise<ListrTask<SSHKeyContext>[]> {
    const { args, flags } = await this.parse(SSHKey);

    const { resourceGroup } = args;

    const { keyName } = flags;

    return [
      ensureActiveEnterprise(this.config.configDir),
      azureCliInstallTask(),
      loadEaCTask(this.config.configDir),
      ensureCloudTask(this.config.configDir), // , cloudLookup),
      ensureCloudResourceGroupTask(this.config.configDir, resourceGroup),
      azSshKeyCreateTask(this.config, keyName!),
      {
        title: 'SSH Key Public Key',
        task: (ctx) => {
          ctx.Fathym.Result = ctx.SSHPublicKey;
        },
      },
    ];
  }
}
