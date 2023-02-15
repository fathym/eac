import { Flags } from '@oclif/core';
import { ListrTask } from 'listr2';
import open from 'open';
import {} from '@semanticjs/common';
import { FathymCommand } from '../../common/fathym-command';
import { ClosureInstruction } from '../../common/ClosureInstruction';
import {
  ActiveEnterpriseTaskContext,
  EaCTaskContext,
  ensureActiveEnterprise,
  FathymTaskContext,
  loadEaCTask,
} from '../../common/core-helpers';

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
  };

  static args = {};

  static title = 'Git Authentication';

  protected async loadTasks(): Promise<ListrTask<AuthTaskContext>[]> {
    const { flags } = await this.parse(Auth);

    const { edit } = flags;

    return [
      ensureActiveEnterprise(this.config.configDir),
      loadEaCTask(this.config.configDir),
      {
        title: 'Open GitHub in browser for authentication',
        task: async (ctx) => {
          const query = edit
            ? 'oauth-force-edit=true'
            : `entLookup=${ctx.EaC.Enterprise!.ParentEnterpriseLookup}`;

          open(
            `https://www.fathym.com/.oauth/GitHubOAuth?${query}`
            // `https://localhost:44358/.oauth/GitHubOAuth?entLookup=${ctx.ActiveEnterpriseLookup}`
          );
        },
      },
    ];
  }
}
