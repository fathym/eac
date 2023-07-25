import { Args, Flags } from '@oclif/core';
import { ListrTask } from 'listr2';
import { FathymCommand } from '../../../common/fathym-command';
import { runProc } from '../../../common/task-helpers';
import { FathymTaskContext } from '../../../common/core-helpers';
import { loadCurrentGitPackageName } from '../../../common/git-helpers';

export default class Scaffold extends FathymCommand<FathymTaskContext> {
  static description = 'Used to scaffold a new Deno project.';

  static examples = [
    '<%= config.bin %> <%= command.id %> dev deno scaffold --help',
  ];

  static flags = {
    directory: Flags.string({
      char: 'd',
      description: 'The directory to initialize and scaffold.',
    }),
  };

  static args = {
    name: Args.string({
      description: 'The name of the deno project to scaffold.',
    }),
  };

  static title = 'Scaffold LCU';

  protected async loadTasks(): Promise<ListrTask<FathymTaskContext>[]> {
    const { args, flags } = await this.parse(Scaffold);

    let { name } = args;

    let { directory } = flags;

    directory = directory || './';

    let projectType = '';

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
        title: `Select project type`,
        task: async (ctx, task) => {
          projectType = await task.prompt({
            type: 'select',
            message: 'Project type',
            choices: [{
              message: 'Module',
              name: '@fathym/create-deno-module-package@latest',
            }, {
              message: 'Fresh',
              name: '@fathym/create-deno-fresh-package@latest'
            }],
            validate: (v) => Boolean(v),
          } as any);

          if (!name) {
            name = await loadCurrentGitPackageName();
          }
        },
      },
      {
        title: `Initializing Deno project`,
        task: async (ctx, task) => {
          task.title = `Initializing Deno project ${name}: ${projectType}`;

          await runProc('npx', [
            projectType,
            name!,
            directory!,
          ]);
        },
      },
    ];
  }
}
