import {} from '@oclif/core';
import Listr from 'listr';
import {} from '@semanticjs/common';
import {
  ClosureInstruction,
  FathymCommand,
} from '../../../../common/fathym-command';

export default class Attach extends FathymCommand {
  static description = `Used for attaching a build pipeline to a source control.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [];

  static title = 'Attach Build Pipeline to Source Control';

  protected async loadInstructions(): Promise<ClosureInstruction[]> {
    return [];
  }

  protected async loadTasks(): Promise<Listr> {
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
