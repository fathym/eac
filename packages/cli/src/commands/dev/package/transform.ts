import { Args, Flags } from '@oclif/core';
import { ListrTask } from 'listr2';
import { FathymCommand } from '../../../common/fathym-command';
import { runProc } from '../../../common/task-helpers';
import {
  ensurePromptValue,
  FathymTaskContext,
} from '../../../common/core-helpers';
import { isGitRepo, loadCurrentGitOrgRepo } from '../../../common/git-helpers';
import { readFile, readJSON, writeFile, writeJSON } from 'fs-extra';
import path from 'node:path';

export default class PackageTransform extends FathymCommand<FathymTaskContext> {
  static description = 'Used to transform the package json file.';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    destination: Flags.string({
      char: 'd',
      description: 'Used to determine where to move the transformed package.',
    }),
    transform: Flags.string({
      char: 't',
      description:
        'The package json property keys to bring along, | separated.',
      default: 'name|version',
    }),
    transformOverrides: Flags.string({
      char: 'o',
      description:
        'The values to use in place of the included properties, | separated.',
      default: 'a-specific-name|',
    }),
  };

  static args = {};

  static title = 'PackageJSON Transform';

  static forceRefresh = false;

  protected async loadTasks(): Promise<ListrTask<FathymTaskContext>[]> {
    const { flags } = await this.parse(PackageTransform);

    const { transformOverrides } = flags;

    let { destination, transform } = flags;

    return [
      {
        title: `Ensure parameters`,
        task: async (ctx, task) => {
          transform = (await ensurePromptValue(
            task,
            'Package keys to transform:',
            transform
          )) as string;

          destination = (await ensurePromptValue(
            task,
            'Destination of transformed package:',
            destination
          )) as string;
        },
      },
      {
        title: `Transform package json`,
        task: async (ctx, task) => {
          const pckgJson = await readJSON('./package.json');

          const newPckgJson = {};

          const overrides = transformOverrides?.split('|');

          transform?.split('|').forEach((key, i) => {
            newPckgJson[key] = overrides?.[i] ?? pckgJson[key];
          });

          await writeJSON(
            path.join(destination || './dist', './package.json'),
            newPckgJson,
            {
              spaces: 2,
            }
          );
        },
      },
    ];
  }
}
