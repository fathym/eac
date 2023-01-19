import {} from '@oclif/core';
import { ListrTask } from 'listr';
import {} from '@semanticjs/common';
import { ClosureInstruction } from '../../common/fathym-command';
import { confirmGitRepo, ensureOrganization } from '../../common/git-tasks';
import { execa } from '../../common/task-helpers';
import path from 'node:path';
import Clone from './clone';

export default class Import extends Clone {
  static description = `Used for importing a remote source control into a configured EaC Source control.`;

  static examples = [
    '<%= config.bin %> <%= command.id %> import organization repository "https://github.com/fathym-it/smart-building-demo',
  ];

  static flags = { ...Clone.flags };

  static args = [...Clone.args, { name: 'remote', required: true }];

  static title = 'Git Import';

  protected async loadInstructions(): Promise<ClosureInstruction[]> {
    return [];
  }

  protected async loadTasks(): Promise<ListrTask[]> {
    const { args, flags } = await this.parse(Import);

    const { organization, repository, remote } = args;

    const depth = flags.depth ? `--depth ${flags.depth}` : '';

    const branch = flags.branch ? `--branch ${flags.branch}` : '';

    return [
      confirmGitRepo(),
      ensureOrganization(organization),
      {
        title: `Importing remote repository ${remote}`,
        task: async (ctx, task) => {
          const destination = path.join(process.cwd(), repository);

          await execa(`git`, [
            'clone',
            remote,
            destination,
            depth,
            branch,
            ' --bare',
          ]);

          const gitPath = `https://github.com/${organization}/${repository}.git`;

          task.title = `Pushing import to remote ${organization}/${repository}`;

          await execa('cd', [repository]);

          await execa(`git`, ['push', '--mirror', gitPath]);

          await execa('cd', ['..']);

          task.title = `Remote ${remote} imported to ${organization}/${repository}`;
        },
      },
    ];
  }
}
