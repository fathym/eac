import {} from '@oclif/core';
import { ListrTask } from 'listr2';
import {} from '@semanticjs/common';
import { FathymCommand } from '../../common/fathym-command';
import { ClosureInstruction } from '../../common/ClosureInstruction';
import {
  commitGitChanges,
  confirmGitRepo,
  fetchPrune,
  pushOrigin,
} from '../../common/git-tasks';
import { runProc } from '../../common/task-helpers';

export default class Feature extends FathymCommand<any> {
  static description = `Used for configuring a repository with best practices.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [];

  static title = 'Initialize Repository';

  protected async loadTasks(): Promise<ListrTask[]> {
    const { args, flags } = await this.parse(Feature);

    const { name } = args;

    const { ci } = flags;

    return [
      confirmGitRepo(),
      {
        title: 'Ensure integration branch',
        task: async () => {
          await runProc(`git checkout`, [`-b integration`]);
        },
      },
      {
        title: 'Setting upstream for integration branch',
        task: async () => {
          await runProc(`git push`, ['--set-upstream origin', `integration`]);
        },
      },
      commitGitChanges('Setup integration branch'),
      pushOrigin(),
      fetchPrune(),
    ];
  }
}
