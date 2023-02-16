import { Args, Flags } from '@oclif/core';
import { ListrTask } from 'listr2';
import {} from '@semanticjs/common';
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
import { AccessTokenTaskContext } from '../../common/core-helpers';
import { ensurePromptValue } from '../../common/eac-services';

export default class Clone extends FathymCommand<any> {
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

  protected async loadTasks(): Promise<ListrTask[]> {
    const { args, flags } = await this.parse(Clone);

    let { organization, repository } = args;

    const depth = flags.depth ? `--depth ${flags.depth}` : '';

    const branch = flags.branch ? `--branch ${flags.branch}` : '';

    return [
      confirmGitRepo(),
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
          organization = await ensurePromptValue(
            task,
            'Set the organization to clone',
            organization
          );

          repository = await ensurePromptValue(
            task,
            'Set the organization to clone',
            repository
          );

          task.title = `Cloning repository ${organization}/${repository}`;

          const destination = path.join(process.cwd(), repository);

          const gitPath = `https://github.com/${organization}/${repository}.git`;

          await runProc(`git clone ${gitPath} ${destination}`, [depth, branch]);

          task.title = `Repository ${organization}/${repository} cloned`;
        },
      },
    ];
  }
}
