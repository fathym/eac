import { ListrTask } from 'listr2';
import { FathymCommand } from '../../common/fathym-command';
import { FathymTaskContext, setApiRoot } from '../../common/core-helpers';
import path from 'node:path';
import open from 'open';
import { Args, Flags } from '@oclif/core';
import { runProc } from '../../common/task-helpers';

export default class Open extends FathymCommand<FathymTaskContext> {
  static description =
    'Used to open the current directory or a file within it.';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    code: Flags.boolean({
      char: 'c',
      description: 'If activated, opens in VS Code. Default: true',
      default: true,
    }),
  };

  static args = {
    path: Args.string({
      description: 'The path to open.',
      default: './',
    }),
  };

  static title = 'Open Git';

  protected async loadTasks(): Promise<ListrTask<FathymTaskContext>[]> {
    const { args, flags } = await this.parse(Open);

    const { path } = args;

    const { code } = flags;

    return [
      {
        title: `Opening`,
        task: async (ctx, task) => {
          task.title = `Opening ${path}`;

          try {
            await (code ? runProc('code', [path]) : open(path));
          } catch {
            throw new Error(
              'Ensure that VS Code is installed and that `code` is installed to the system path.'
            );
          }
        },
      },
    ];
  }
}
