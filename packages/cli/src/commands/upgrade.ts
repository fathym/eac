import { ListrTask } from 'listr2';
import { FathymCommand } from '../common/fathym-command';
import { FathymTaskContext, setApiRoot } from '../common/core-helpers';
import { runProc } from '../common/task-helpers';

export default class Upgrade extends FathymCommand<FathymTaskContext> {
  static description = 'Used to upgrade the Fathym CLI in global scope.';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [];

  static title = 'Upgrade';

  protected async loadTasks(): Promise<ListrTask<FathymTaskContext>[]> {
    return [
      {
        title: `Upgrade Fathym CLI`,
        task: async (ctx) => {
          await runProc('npm', ['i', '@fathym/cli@latest', '-g']);
        },
      },
    ];
  }
}
