import { Flags } from '@oclif/core';
import { ListrTask } from 'listr2';
import {} from '@semanticjs/common';
import { FathymCommand } from '../../common/fathym-command';
import { ClosureInstruction } from '../../common/ClosureInstruction';
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

export default class Commit extends FathymCommand<any> {
  static aliases = ['commit', 'sync'];

  static description = `Used for committing changes to the current working branch and syncing with integration.`;

  static examples = [
    '<%= config.bin %> <%= command.id %> "Commit messag here"',
  ];

  static flags = {
    rebase: Flags.boolean({
      char: 'r',
      description: 'When specified does a rebase instead of a merge.',
    }),
  };

  static args = [{ name: 'message' }];

  static title = 'Git Commit';

  protected async loadTasks(): Promise<ListrTask<any>[]> {
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
