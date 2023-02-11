import { Args } from '@oclif/core';
import { ListrTask } from 'listr2';
import {} from '@semanticjs/common';
import { FathymCommand } from '../../common/fathym-command';
import { ClosureInstruction } from '../../common/ClosureInstruction';
import { ensureActiveEnterprise } from '../../common/core-helpers';
import { commitGitChanges } from '../../common/git-tasks';
import { commitDraftTask } from '../../common/eac-services';

export default class Commit extends FathymCommand<any> {
  static description = `Used for commiting changes to the EaC.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = {
    message: Args.string({
      description: 'The commit message.',
    }),
  };

  static title = 'EaC Commit';

  protected async loadTasks(): Promise<ListrTask[]> {
    const { args } = await this.parse(Commit);

    const { message } = args;

    return [
      ensureActiveEnterprise(this.config.configDir),
      commitDraftTask(this.config.cacheDir, message!),
    ];
  }
}
