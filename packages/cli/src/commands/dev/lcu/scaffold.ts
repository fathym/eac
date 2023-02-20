import { Args, Flags } from '@oclif/core';
import { ListrTask } from 'listr2';
import { FathymCommand } from '../../../common/fathym-command';
import { runProc } from '../../../common/task-helpers';
import { FathymTaskContext } from '../../../common/core-helpers';
import { loadCurrentGitPackageName } from '../../../common/git-helpers';

export default class Scaffold extends FathymCommand<FathymTaskContext> {
  static description = 'Used to scaffold a new LCU.';

  static examples = [
    '<%= config.bin %> <%= command.id %> dev lcu scaffold --help',
  ];

  static flags = {
    directory: Flags.string({
      char: 'd',
      description: 'The directory to initialize and scaffold.',
    }),
  };

  static args = {
    name: Args.string({
      description: 'The name of the LCUt to scaffold.',
    }),
  };

  static title = 'Scaffold LCU';

  protected async loadTasks(): Promise<ListrTask<FathymTaskContext>[]> {
    const { args, flags } = await this.parse(Scaffold);

    let { name } = args;

    let { directory } = flags;

    directory = directory || './';

    return [
      {
        title: `Ensuring package name`,
        task: async (ctx, task) => {
          if (!name) {
            name = await loadCurrentGitPackageName();
          }
        },
      },
      {
        title: `Initializing LCU package`,
        task: async (ctx, task) => {
          task.title = `Initializing LCU package ${name}`;

          await runProc('npx', [
            '@fathym/create-lcu-package@latest',
            name!,
            directory!,
          ]);
        },
      },
    ];
  }
}
