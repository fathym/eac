import { Flags } from '@oclif/core';
import { ListrTask } from 'listr2';
import open from 'open';
import { FathymTaskContext } from '../../common/core-helpers';
import {
  ActiveEnterpriseTaskContext,
  EaCTaskContext,
  ensureActiveEnterpriseTask,
  loadEaCTask,
} from '../../common/eac-services';
import { FathymCommand } from '../../common/fathym-command';

interface AuthTaskContext
  extends FathymTaskContext,
    ActiveEnterpriseTaskContext,
    EaCTaskContext {}
export default class Auth extends FathymCommand<AuthTaskContext> {
  static description = `Used for authenticating the user with Git.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    edit: Flags.boolean({
      char: 'e',
      description: 'Open page to manage git authorization.',
    }),
    self: Flags.boolean({
      char: 's',
      description: 'Whether to capture auth for self or parent enterprise.',
    }),
  };

  static args = {};

  static title = 'Git Authentication';

  protected async loadTasks(): Promise<ListrTask<AuthTaskContext>[]> {
    const { flags } = await this.parse(Auth);

    const { edit, self } = flags;

    return [
      ensureActiveEnterpriseTask(this.config.configDir),
      loadEaCTask(this.config.configDir),
      {
        title: 'Open GitHub in browser for authentication',
        task: async (ctx) => {
          const query = edit
            ? 'oauth-force-edit=true'
            : `entLookup=${
                self
                  ? ctx.ActiveEnterpriseLookup
                  : ctx.EaC.Enterprise!.ParentEnterpriseLookup
              }`;

          open(
            `https://www.fathym.com/.oauth/GitHubOAuth?${query}`
            // `https://localhost:44358/.oauth/GitHubOAuth?entLookup=${ctx.ActiveEnterpriseLookup}`
          );
        },
      },
    ];
  }
}
