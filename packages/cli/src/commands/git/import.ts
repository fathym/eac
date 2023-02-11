import { Args } from '@oclif/core';
import { ListrTask } from 'listr2';
import {} from '@semanticjs/common';
import { ClosureInstruction } from '../../common/ClosureInstruction';
import { confirmGitRepo, ensureOrganization } from '../../common/git-tasks';
import { runProc } from '../../common/task-helpers';
import path from 'node:path';
import Clone from './clone';
import { GitHubTaskContext, loadGitUsername } from '../../common/git-helpers';
import { AccessTokenTaskContext } from '../../common/core-helpers';
import { ensurePromptValue } from '../../common/eac-services';

export default class Import extends Clone {
  static description = `Used for importing a remote source control into a configured EaC Source control.`;

  static examples = [
    '<%= config.bin %> <%= command.id %> import organization repository "https://github.com/fathym-it/smart-building-demo',
  ];

  static flags = { ...Clone.flags };

  static args = {
    ...Clone.args,
    remote: Args.string({
      description: 'The name of the remote to import.',
    }),
  };

  static title = 'Git Import';

  protected async loadTasks(): Promise<ListrTask[]> {
    const { args, flags } = await this.parse(Import);

    let { organization, repository, remote } = args;

    const depth = flags.depth ? `--depth ${flags.depth}` : '';

    const branch = flags.branch ? `--branch ${flags.branch}` : '';

    return [
      confirmGitRepo(),
      {
        title: `Importing remote repository ${remote}`,
        task: async (ctx, task) => {
          const destination = path.join(process.cwd(), repository!);

          remote = await ensurePromptValue(
            task,
            'Set the remote to import',
            remote
          );

          //  TODO: Use ensure organization task
          organization = await ensurePromptValue(
            task,
            'Set the organization to clone',
            organization,
            undefined,
            () => loadGitUsername(),
            '- Use Default -'
          );

          repository = await ensurePromptValue(
            task,
            'Set the organization to clone',
            repository
          );

          await runProc(`git`, [
            'clone',
            remote,
            destination,
            depth,
            branch,
            ' --bare',
          ]);

          const gitPath = `https://github.com/${organization}/${repository}.git`;

          task.title = `Pushing import to remote ${organization}/${repository}`;

          await runProc('cd', [repository]);

          await runProc(`git`, ['push', '--mirror', gitPath]);

          await runProc('cd', ['..']);

          task.title = `Remote ${remote} imported to ${organization}/${repository}`;
        },
      },
    ];
  }
}
