import {} from '@oclif/core';
import { ListrTask } from 'listr2';
import {} from '@semanticjs/common';
import { FathymCommand } from '../../../../common/fathym-command';
import { ClosureInstruction } from '../../../../common/ClosureInstruction';

export default class Attach extends FathymCommand<any> {
  static description = `Used for attaching a build pipeline to a source control.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [];

  static title = 'Attach Build Pipeline to Source Control';

  protected async loadTasks(): Promise<ListrTask[]> {
    return [
      {
        title: `Attaching build pipeline to source control`,
        task: (ctx, task) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              task.title = `Build pipeline attached to source control`;

              resolve(true);
            }, 3000);
          });
        },
      },
    ];
  }
}
