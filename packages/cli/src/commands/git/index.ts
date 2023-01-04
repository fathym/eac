import {} from '@oclif/core';
import Listr from 'listr';
import {} from '@semanticjs/common';
import { ClosureInstruction, FathymCommand } from '../../common/fathym-command';

export default class Feature extends FathymCommand {
  static aliases = ['git:commit', 'git:sync'];

  static description = `Used for committing changes to the current working branch.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [{ name: 'message' }];

  static title = 'Git Commit';

  protected async loadInstructions(): Promise<ClosureInstruction[]> {
    return [];
  }

  protected async loadTasks(): Promise<Listr> {
    // git add .
    // git commit "Added index.html template"
    // git checkout integration
    // git pull
    // git checkout -
    // git rebase integration
    // git push origin
    // git fetch --prune
    return [
      {
        title: `Commiting git changes`,
        task: (ctx, task) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              task.title = `Git changes committed`;

              resolve(true);
            }, 3000);
          });
        },
      },
    ];
  }
}
