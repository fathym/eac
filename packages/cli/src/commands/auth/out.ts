import {} from '@oclif/core';
import { ListrTask } from 'listr2';
import {} from '@semanticjs/common';
import { FathymCommand } from '../../common/fathym-command';
import { ClosureInstruction } from '../../common/ClosureInstruction';
import { withUserAuthConfig } from '../../common/core-helpers';

export default class Out extends FathymCommand<any> {
  static description =
    'Used to sign out, so your CLI will NOT work with the EaC and other features.';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = {};

  static title = 'Fathym Sign Out';

  protected async loadTasks(): Promise<ListrTask[]> {
    return [
      {
        title: 'Opened browser for sign out',
        task: () => 'Opened',
      },
      {
        title: `Waiting for sign out`,
        task: async (ctx, task) => {
          await withUserAuthConfig(this.config.configDir, async (userAuth) => {
            delete userAuth.AccessToken;

            return userAuth;
          });

          task.title = `Sign out completed successfully`;
        },
      },
    ];
  }
}
