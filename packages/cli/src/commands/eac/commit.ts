import { Args } from '@oclif/core';
import { ListrTask } from 'listr2';
import { FathymCommand } from '../../common/fathym-command';
import {
  commitDraftTask,
  ensureActiveEnterpriseTask,
} from '../../common/eac-services';

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
      ensureActiveEnterpriseTask(this.config.configDir),
      commitDraftTask(this.config.cacheDir, message!),
    ];
  }
}
