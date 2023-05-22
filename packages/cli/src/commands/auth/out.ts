import { ListrTask } from 'listr2';
import open from 'open';
import { withUserAuthConfig } from '../../common/config-helpers';
import { FathymCommand } from '../../common/fathym-command';
import { runProc } from '../../common/task-helpers';

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
        task: async (ctx, task) => {
          open("https://www.fathym.com/.oauth/logout");
        },
      },
      {
        title: `Waiting for sign out`,
        task: async (ctx, task) => {          
          await withUserAuthConfig(this.config.configDir, async (userAuth) => {
            delete userAuth.AccessToken;           
          });
          try{
            await runProc('npx rimraf', [this.config.configDir.toString()]);
          }
          catch{}

          try{
            await runProc('az', ['logout']);
          }
          catch{}
                   
          task.title = `Sign out completed successfully`;
        },
      },
    ];
  }
}
