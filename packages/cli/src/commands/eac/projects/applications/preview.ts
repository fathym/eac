import {} from '@oclif/core';
import { ListrTask } from 'listr2';
import {} from '@semanticjs/common';
import { FathymCommand } from '../../../../common/fathym-command';
import { ClosureInstruction } from '../../../../common/ClosureInstruction';

export default class Preview extends FathymCommand<any> {
  static description = `Used for getting a preview link to a project application.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [];

  static title = 'Project Application Preview';

  protected async loadTasks(): Promise<ListrTask[]> {
    // const { args } = await this.parse(Preview);

    return [
      {
        title: `Loading preview URL for project application`,
        task: (ctx, task) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              task.title = `Project application preview URL loaded successfully`;

              resolve(true);
            }, 3000);
          });
        },
      },
    ];
  }
}
