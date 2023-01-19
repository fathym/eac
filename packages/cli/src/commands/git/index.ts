import { Flags } from '@oclif/core';
import { ListrTask } from 'listr';
import {} from '@semanticjs/common';
import { ClosureInstruction, FathymCommand } from '../../common/fathym-command';
import {
  commitChanges,
  confirmGitRepo,
  fetchChange,
  fetchPrune,
  mergeIntegration,
  pull,
  pushOrigin,
  rebaseIntegration,
} from '../../common/git-tasks';
import { ensureMessage } from '../../common/git-helpers';

export default class Commit extends FathymCommand {
  static aliases = ['commit', 'sync'];

  static description = `Used for committing changes to the current working branch and syncing with integration.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    rebase: Flags.boolean({
      char: 'r',
      description: 'When specified does a rebase instead of a merge.',
    }),
  };

  static args = [{ name: 'message' }];

  static title = 'Git Commit';

  protected async loadInstructions(): Promise<ClosureInstruction[]> {
    return [];
  }

  protected async loadTasks(): Promise<ListrTask[]> {
    const { args, flags } = await this.parse(Commit);

    const { rebase } = flags;

    let { message } = args;

    message = await ensureMessage(message);

    return [
      confirmGitRepo(),
      commitChanges(message),
      fetchChange(),
      rebase ? rebaseIntegration() : mergeIntegration(),
      pull(),
      pushOrigin(),
      fetchPrune(),
    ];
  }
}
