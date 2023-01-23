import {} from '@oclif/core';
import { ListrTask } from 'listr2';
import { EnterpriseAsCode } from '@semanticjs/common';
import { FathymCommand } from '../../common/fathym-command';
import { ClosureInstruction } from '../../common/ClosureInstruction';
import { FathymTaskContext } from '../../common/core-helpers';

export default class Changes extends FathymCommand<FathymTaskContext> {
  static description = `Used to retrieve the current changes to EaC that are queued for commit.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [];

  static title = 'EaC Changes';

  protected async loadTasks(): Promise<ListrTask<FathymTaskContext>[]> {
    return [
      {
        title: `Resolving EaC changes`,
        task: (ctx, task) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              task.title = `EaC changes resolved`;

              ctx.Fathym.Result = JSON.stringify({} as EnterpriseAsCode);

              resolve(true);
            }, 3000);
          });
        },
      },
    ];
  }
}
