import {} from '@oclif/core';
import { ListrTask } from 'listr';
import {} from '@semanticjs/common';
import { ClosureInstruction, FathymCommand } from '../../common/fathym-command';
import { commitChanges, confirmGitRepo } from '../../common/git-tasks';

export default class Commit extends FathymCommand {
  static aliases = ['git commit', 'git sync'];

  static description = `Used for committing changes to the current working branch and syncing with integration.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [{ name: 'message' }];

  static title = 'Git Commit';

  protected async loadInstructions(): Promise<ClosureInstruction[]> {
    return [];
  }

  protected async loadTasks(): Promise<ListrTask[]> {
    // git add .
    // git commit "Added index.html template"

    // git checkout integration
    // git pull
    // git checkout -
    // git rebase integration
    // git push origin
    // git fetch --prune
    return [confirmGitRepo(), commitChanges()];
  }
}
