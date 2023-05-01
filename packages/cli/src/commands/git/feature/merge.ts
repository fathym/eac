import { Args } from '@oclif/core';
import { ListrTask } from 'listr2';
import { ensurePromptValue } from '../../../common/core-helpers';
import { FathymCommand } from '../../../common/fathym-command';
import {
  commitGitChanges,
  confirmGitRepo,
  fetchPrune,
  pushOrigin,
} from '../../../common/git-tasks';
import { runProc } from '../../../common/task-helpers';

export default class Feature extends FathymCommand<any> {
  static description = `Used for merging 2 feature branches where 1 is merged into the other.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = {
    name: Args.string({
      description: 'Name for the new feature branch.',
    }),
  };

  static title = 'Merge Feature Branch';

  protected async loadTasks(): Promise<ListrTask[]> {
    const { args, flags } = await this.parse(Feature);

    let { name } = args;

    const { ci } = flags;

    return [
      confirmGitRepo(),
      commitGitChanges(''),
      {
        title: 'Create new feature branch',
        task: async (ctx, task) => {
          name = (await ensurePromptValue(
            task,
            'What is the name of the feature branch?',
            name
          )) as string;

          await runProc(`git checkout`, [
            `-b feature/${name}`,
            'origin/integration',
          ]);
        },
      },
      {
        title: 'Setting upstream for feature branch',
        task: async () => {
          await runProc(`git push`, [
            '--set-upstream origin',
            `feature/${name}`,
          ]);
        },
      },
      pushOrigin(),
      fetchPrune(),
    ];
  }
}
