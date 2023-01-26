import { Flags } from '@oclif/core';
import path from 'node:path';
import { ListrTask, PromptOptions } from 'listr2';
import { readFile, read, readJson } from 'fs-extra';
import { FathymCommand } from '../../common/fathym-command';
import { ClosureInstruction } from '../../common/ClosureInstruction';
import { runProc } from '../../common/task-helpers';
import { LcuPackageConfig } from '../../common/LcuPackageConfig';
import {
  ActiveEnterpriseTaskContext,
  ensureActiveEnterprise,
  FathymTaskContext,
  setApiRoot,
} from '../../common/core-helpers';
import loadAxios from '../../common/axios';
import { GitHubTaskContext } from '../../common/git-helpers';
import { InstallLCURequest } from '../../common/InstallLCURequest';

export default class SetAPIRoot extends FathymCommand<FathymTaskContext> {
  static description = 'Used to set the api root.';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = [{ name: 'env', required: true }];

  static title = 'Set API Root';

  protected async loadTasks(): Promise<ListrTask<FathymTaskContext>[]> {
    const { args } = await this.parse(SetAPIRoot);

    const { env } = args;

    return [
      {
        title: `Setting API root for ${env}`,
        task: async (ctx) => {
          await setApiRoot(this.config.configDir, env);
        },
      },
    ];
  }
}