import {} from '@oclif/core';
import { ListrTask } from 'listr';
import {} from '@semanticjs/common';
import { ClosureInstruction, FathymCommand } from '../../common/fathym-command';
import {
  commitChanges,
  confirmGitRepo,
  fetchChange,
  fetchPrune,
  hasCommittedChanges,
  pull,
  pushOrigin,
  rebaseIntegration,
} from '../../common/git-tasks';
import inquirer from 'inquirer';

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
    const { args } = await this.parse(Commit);

    let { message } = args;

    if (!message && !(await hasCommittedChanges())) {
      const { commitMessage } = await inquirer.prompt({
        type: 'input',
        name: 'commitMessage',
        message: 'Enter commit message:',
      });

      message = commitMessage;
    }

    return [
      confirmGitRepo(),
      commitChanges(message),
      fetchChange(),
      pull(),
      rebaseIntegration(),
      pull(),
      pushOrigin(),
      fetchPrune(),
    ];
  }
}
