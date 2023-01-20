import {} from '@oclif/core';
import { ListrTask } from 'listr2';
import { EnterpriseAsCode } from '@semanticjs/common';
import { FathymCommand } from '../../common/fathym-command';
import { ClosureInstruction } from '../../common/ClosureInstruction';

export default class Export extends FathymCommand<any> {
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

  protected async loadTasks(): Promise<ListrTask[]> {
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
