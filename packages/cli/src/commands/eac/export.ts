import {} from '@oclif/core';
import Listr from 'listr';
import { EnterpriseAsCode } from '@semanticjs/common';
import { ClosureInstruction, FathymCommand } from '../../common/fathym-command';

export default class Export extends FathymCommand {
  static description = `Used for exporting the EaC.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [];

  static title = 'EaC Export';

  protected async loadInstructions(): Promise<ClosureInstruction[]> {
    return [];
  }

  protected async loadResult(): Promise<string | undefined> {
    return JSON.stringify({} as EnterpriseAsCode);
  }

  protected async loadTasks(): Promise<Listr> {
    return [
      {
        title: `Exporting EaC`,
        task: (ctx, task) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              task.title = `EaC exported`;

              resolve(true);
            }, 3000);
          });
        },
      },
    ];
  }
}
