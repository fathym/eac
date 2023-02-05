import { ListrTask } from 'listr2';
import { FathymCommand } from '../../common/fathym-command';
import { FathymTaskContext, setApiRoot } from '../../common/core-helpers';

export default class SetAPIRoot extends FathymCommand<FathymTaskContext> {
  static description = 'Used to set the api root.';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [{ name: 'env', required: false }];

  static title = 'Set API Root';

  protected async loadTasks(): Promise<ListrTask<FathymTaskContext>[]> {
    const { args } = await this.parse(SetAPIRoot);

    let { env } = args;

    return [
      {
        title: `Setting API root`,
        task: async (ctx, task) => {
          if (!env) {
            env = await task.prompt({
              type: 'select',
              message: 'Select API Environment',
              choices: ['prod', 'local'],
            });
          }

          await setApiRoot(this.config.configDir, env);

          task.title = `Set API root for ${env}`;
        },
      },
    ];
  }
}
