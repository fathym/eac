import { Flags } from '@oclif/core';
import path from 'node:path';
import { ListrTask, PromptOptions } from 'listr2';
import { readFile, read, readJson } from 'fs-extra';
import { FathymCommand } from '../../../common/fathym-command';
import { ClosureInstruction } from '../../../common/ClosureInstruction';
import { runProc } from '../../../common/task-helpers';
import { LcuPackageConfig } from '../../../common/LcuPackageConfig';
import {
  ActiveEnterpriseTaskContext,
  ensureActiveEnterprise,
  FathymTaskContext,
  setApiRoot,
} from '../../../common/core-helpers';

export default class DevLCUSeed extends FathymCommand<FathymTaskContext> {
  static description = 'Used to scaffold a new LCU.';

  static examples = ['<%= config.bin %> <%= command.id %> dev lcu seed --help'];

  static flags = {};

  static args = [{ name: 'name', required: true }];

  static title = 'Seed LCU';

  protected async loadTasks(): Promise<ListrTask<FathymTaskContext>[]> {
    const { args } = await this.parse(DevLCUSeed);

    const { name } = args;

    return [
      {
        title: `Initializing LCU with npm`,
        task: async (ctx) => {
          await runProc('npm', ['init', '-y']);
        },
      },
    ];
  }
}
