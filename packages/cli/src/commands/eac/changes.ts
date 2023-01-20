import {} from '@oclif/core';
import { ListrTask } from 'listr2';
import { EnterpriseAsCode } from '@semanticjs/common';
import { FathymCommand } from '../../common/fathym-command';
import { ClosureInstruction } from '../../common/ClosureInstruction';

export default class Changes extends FathymCommand<any> {
  static description = `Used to retrieve the current changes to EaC that are queued for commit.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [];

  static title = 'EaC Changes';

  protected async loadInstructions(): Promise<ClosureInstruction[]> {
    return [];
  }

  protected async loadResult(): Promise<string | undefined> {
    return JSON.stringify({} as EnterpriseAsCode);
  }

  protected async loadTasks(): Promise<ListrTask[]> {
    return [
      {
        title: `Resolving EaC changes`,
        task: (ctx, task) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              task.title = `EaC changes resolved`;

              resolve(true);
            }, 3000);
          });
        },
      },
    ];
  }
}
