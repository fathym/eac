import { ListrTask } from 'listr2';
import { FathymCommand } from '../../../common/fathym-command';
import { FathymTaskContext, setApiRoot } from '../../../common/core-helpers';
import path from 'node:path';
import open from 'open';
import { Args } from '@oclif/core';

export default class Open extends FathymCommand<FathymTaskContext> {
  static description = 'Used to open the config directory.';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = {
    config: Args.string({
      description: 'The config location to open.',
    }),
  };

  static title = 'Open Config';

  protected async loadTasks(): Promise<ListrTask<FathymTaskContext>[]> {
    const { args } = await this.parse(Open);

    const { config } = args;

    return [
      {
        title: `Opening Config`,
        task: async (ctx, task) => {
          let openPath = this.config.configDir;

          if (config) {
            openPath = path.join(openPath, config);
          }

          task.title = `Opening config ${openPath}`;

          await open(openPath);
        },
      },
    ];
  }
}
