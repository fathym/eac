import { Args, Flags } from '@oclif/core';
import { ListrTask } from 'listr2';
import { FathymCommand } from '../../../../common/fathym-command';
import { runProc } from '../../../../common/task-helpers';
import {
  ensurePromptValue,
  FathymTaskContext,
} from '../../../../common/core-helpers';
import {
  isGitRepo,
  loadCurrentGitOrgRepo,
  loadCurrentGitPackageName,
} from '../../../../common/git-helpers';
import { readFile, readJSON, writeFile, writeJSON } from 'fs-extra';

interface CreateReactTaskContext extends FathymTaskContext {}

export default class CreateReact extends FathymCommand<FathymTaskContext> {
  static description = 'Used to create a new react application.';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    mui: Flags.boolean({
      char: 'm',
      description: 'Used to determine if mui should be installed.',
    }),
    tailwind: Flags.boolean({
      char: 't',
      description: 'Used to determine if tailwind should be installed.',
    }),
  };

  static args = {
    // name: Args.string({
    //   description: 'The name of the application to create.',
    // }),
  };

  static title = 'Create React Application';

  protected async loadTasks(): Promise<ListrTask<FathymTaskContext>[]> {
    const { args, flags } = await this.parse(CreateReact);

    let { mui, tailwind } = flags;

    return [
      {
        title: `Create react application`,
        task: async (ctx, task) => {
          await runProc('npx', [
            'create-react-app',
            '.',
            '--template typescript',
          ]);
        },
      },
      {
        title: `Add Tailwind`,
        enabled: tailwind,
        task: async (ctx, task) => {
          await runProc('npm', [
            'install ',
            '-D',
            'tailwindcss ',
            'postcss',
            'autoprefixer',
          ]);

          await runProc('npx', ['tailwindcss ', 'init', '-p ']);

          await writeFile(
            './tailwind.config.js',
            `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`
          );

          await writeFile(
            './src/index.css',
            `@tailwind base;
@tailwind components;
@tailwind utilities;
`
          );
        },
      },
      {
        title: `Add MUI`,
        enabled: mui,
        task: async (ctx, task) => {
          throw new Error('MUI setup is not yet supported');
        },
      },
      {
        title: `Configure react app`,
        task: async (ctx, task) => {
          const pckgJson = await readJSON('./package.json');

          const gitRepo = await isGitRepo();

          const [organization, repository] = gitRepo
            ? await loadCurrentGitOrgRepo('|')
            : [];

          pckgJson.name = organization
            ? `@${organization}/${repository}`
            : pckgJson.name;
          pckgJson.version = '0.0.0';
          pckgJson.private = false;
          pckgJson.homepage = '.';

          await writeJSON('./package.json', pckgJson, {
            spaces: 2,
          });
        },
      },
      {
        title: `Configure scripts`,
        task: async (ctx, task) => {
          const pckgJson = await readJSON('./package.json');

          pckgJson.scripts.deploy = 'npm version patch && npm run deploy:app';
          pckgJson.scripts['deploy:app'] =
            'npm run build && npm run deploy:package-json && npm publish ./build --access public';
          pckgJson.scripts['deploy:package-json'] =
            'npx fathym dev package transform -d ./build';

          await writeJSON('./package.json', pckgJson, {
            spaces: 2,
          });
        },
      },
      {
        title: `Configure index.html`,
        task: async (ctx, task) => {
          // const indexHtml = await readFile('./public/index.html');
          // await writeFile('./public/index.html', indexHtml);
          // // Update the index.html file to have some default styles applied
        },
      },
      {
        title: `Start application`,
        task: async (ctx, task) => {
          await runProc('npm', ['start']);
        },
      },
    ];
  }
}
