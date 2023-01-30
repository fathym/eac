import {} from '@oclif/core';
import { ListrTask } from 'listr2';
import open from 'open';
import { FathymCommand } from '../../../common/fathym-command';
import { FathymTaskContext } from '../../../common/core-helpers';
import { runProc } from '../../../common/task-helpers';

export default class Azure extends FathymCommand<FathymTaskContext> {
  static description = `Used for opening the link the the Azure CLI installer.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [];

  static title = 'Install Azure CLI';

  protected async loadTasks(): Promise<ListrTask<FathymTaskContext>[]> {
    // const { args } = await this.parse(Azure);

    return [
      {
        title: `Open Azure CLI install link`,
        task: async (ctx, task) => {
          await open('https://aka.ms/installazurecliwindows');

          // await runProc('npx', [
          //   'node-curl',
          //   '-L',
          //   '-o',
          //   'azure-cli.msi',
          //   'https://aka.ms/installazurecliwindows',
          // ]);

          // await runProc('msiexec', ['/q', '/i', 'azure-cli.msi']);

          ctx.Fathym.Instructions = [
            {
              Instruction: 'az login',
              Description: `Make sure to run 'az login' command to sign in after installing.`,
            },
          ];
        },
      },
    ];
  }
}
