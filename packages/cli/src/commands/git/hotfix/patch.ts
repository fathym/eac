import { Args, Flags } from '@oclif/core';
import { ListrTask } from 'listr2';
import { FathymCommand } from '../../../common/fathym-command';
import {
  commitGitChanges,
  confirmGitRepo,
  ensureBranch,
  ensureOrganization,
  ensureRepository,
  fetchPrune,
  pull,
  pullRequest,
  pushOrigin,
} from '../../../common/git-tasks';
import { FathymTaskContext } from '../../../common/core-helpers';
import {
  getCurrentBranch,
  GitHubTaskContext,
  loadCurrentGitOrgRepo,
} from '../../../common/git-helpers';

interface PatchTaskContext extends FathymTaskContext, GitHubTaskContext {}

export default class Patch extends FathymCommand<PatchTaskContext> {
  static description = `Used for patching a hotfix branch into 'main' in git.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    useLocal: Flags.boolean({
      description: 'Whether to use local git information for args.',
    }),
  };

  static args = {
    organization: Args.string({
      description: 'The organization to patch from.',
    }),
    repository: Args.string({
      description: 'The repository to patch from.',
    }),
    branch: Args.string({
      description: 'The branch to patch from.',
    }),
  };

  static title = 'Patch Hotfix Branch';

  protected async loadTasks(): Promise<ListrTask<PatchTaskContext>[]> {
    const { args, flags } = await this.parse(Patch);

    let { branch, organization, repository } = args;

    const { useLocal } = flags;

    if (useLocal) {
      const orgRepo = await (await loadCurrentGitOrgRepo('|')).split('|');

      if (!organization) {
        organization = orgRepo[0];
      }

      if (!repository) {
        repository = orgRepo[1];
      }

      if (!branch) {
        branch = await getCurrentBranch();
      }
    }

    return [
      confirmGitRepo(),
      commitGitChanges(),
      pushOrigin(),
      ensureOrganization(this.config.configDir, organization),
      ensureRepository(this.config.configDir, repository),
      ensureBranch(
        this.config.configDir,
        (ctx, value) => {
          ctx.GitHubBranch = value || '';
        },
        branch,
        undefined,
        false,
        'hotfix'
      ),
      pullRequest(this.config.configDir, 'hotfix'),
      pull(),
      fetchPrune(),
    ];
  }
}
