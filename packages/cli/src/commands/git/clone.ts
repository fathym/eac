import { Args, Flags } from '@oclif/core';
import { ListrTask } from 'listr2';

import { FathymCommand } from '../../common/fathym-command';
import { ClosureInstruction } from '../../common/ClosureInstruction';
import {
  confirmGitRepo,
  ensureOrganization,
  ensureRepository,
} from '../../common/git-tasks';
import { runProc } from '../../common/task-helpers';
import path from 'node:path';
import { GitHubTaskContext, loadGitUsername } from '../../common/git-helpers';
import {
  AccessTokenTaskContext,
  FathymTaskContext,
} from '../../common/core-helpers';

interface CloneTaskContext extends FathymTaskContext, GitHubTaskContext {}

export default class Clone extends FathymCommand<CloneTaskContext> {
  static description = `Used for cloning the source control for Git.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    depth: Flags.integer({
      char: 'd',
      description: 'Specifies the depth of the clone',
    }),
    branch: Flags.string({
      char: 'b',
      description: 'Specifies the branch or tag to clone',
    }),
  };

  static args = {
    organization: Args.string({
      description: 'The organization to clone from.',
    }),
    repository: Args.string({
      description: 'The repository to clone from.',
    }),
  };

  static title = 'Git Clone';

  protected async loadTasks(): Promise<ListrTask<CloneTaskContext>[]> {
    const { args, flags } = await this.parse(Clone);

    const { organization, repository } = args;

    const depth = flags.depth ? `--depth ${flags.depth}` : '';

    const branch = flags.branch ? `--branch ${flags.branch}` : '';

    return [
      ensureOrganization(this.config.configDir, organization, undefined, true),
      ensureRepository(
        this.config.configDir,
        repository,
        undefined,
        false,
        true
      ),
      {
        title: `Cloning repository`,
        task: async (ctx, task) => {
          task.title = `Cloning repository ${ctx.GitHubOrganization}/${ctx.GitHubRepository}`;

          const destination = path.join(process.cwd(), ctx.GitHubRepository);

          const gitPath = `https://github.com/${ctx.GitHubOrganization}/${ctx.GitHubRepository}.git`;

          await runProc(`git clone ${gitPath} ${destination}`, [depth, branch]);

          await runProc(`cd`, [destination]);

          task.title = `Repository ${ctx.GitHubOrganization}/${ctx.GitHubRepository} cloned`;
        },
      },
    ];
  }
}
