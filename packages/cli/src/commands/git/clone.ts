import { Flags } from '@oclif/core';
import { ListrTask } from 'listr2';
import {} from '@semanticjs/common';
import { FathymCommand } from '../../common/fathym-command';
import { ClosureInstruction } from '../../common/ClosureInstruction';
import { confirmGitRepo, ensureOrganization } from '../../common/git-tasks';
import { runProc } from '../../common/task-helpers';
import path from 'node:path';

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

  static args = [
    { name: 'organization', required: false },
    { name: 'repository', required: true },
  ];

  static title = 'Git Clone';

  protected async loadInstructions(): Promise<ClosureInstruction[]> {
    return [];
  }

  protected async loadTasks(): Promise<ListrTask[]> {
    const { args, flags } = await this.parse(Clone);

    const { organization, repository } = args;

    const depth = flags.depth ? `--depth ${flags.depth}` : '';

    const branch = flags.branch ? `--branch ${flags.branch}` : '';

    return [
      confirmGitRepo(),
      ensureOrganization(organization),
      {
        title: `Cloning repository ${organization}/${repository}`,
        task: async (ctx, task) => {
          const destination = path.join(process.cwd(), repository);

          const gitPath = `https://github.com/${organization}/${repository}.git`;

          await runProc(`git clone ${gitPath} ${destination}`, [depth, branch]);

          task.title = `Repository ${organization}/${repository} cloned`;
        },
      },
    ];
  }
}
