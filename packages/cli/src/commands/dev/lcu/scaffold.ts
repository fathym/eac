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

export default class Scaffold extends FathymCommand<FathymTaskContext> {
  static description = 'Used to scaffold a new LCU.';

  static examples = [
    '<%= config.bin %> <%= command.id %> dev lcu scaffold --help',
  ];

  static flags = {
    directory: Flags.string({
      char: 'd',
      description: 'The directory to initialize and scaffold.',
    }),
  };

  static args = [{ name: 'name', required: false }];

  static title = 'Seed LCU';

  protected async loadTasks(): Promise<ListrTask<FathymTaskContext>[]> {
    const { args, flags } = await this.parse(Scaffold);

    let { name } = args;

    let { directory } = flags;

    directory = directory || './';

    return [
      {
        title: `Ensuring package name`,
        task: async (ctx, task) => {
          if (!name) {
            const remoteUrl = await runProc('git', [
              'remote',
              'get-url',
              'origin',
            ]);

            const match = remoteUrl.match(
              /http.*:\/\/.*\/(?<org>.*)\/(?<repo>.*)\.git/
            );

            name = `@${match![1]}/${match![2]}`;
          }
        },
      },
      {
        title: `Initializing LCU package`,
        task: async (ctx, task) => {
          task.title = `Initializing LCU package ${name}`;

          await runProc('npx', [
            '@fathym/create-lcu-package@latest .',
            name,
            directory,
          ]);
        },
      },
    ];
  }
}
