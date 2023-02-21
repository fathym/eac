import { Args, Flags } from '@oclif/core';
import { ListrTask } from 'listr2';
import { FathymCommand } from '../../../../common/fathym-command';
import { runProc } from '../../../../common/task-helpers';
import { FathymTaskContext } from '../../../../common/core-helpers';
import {
  isGitRepo,
  loadCurrentGitOrgRepo,
  loadCurrentGitPackageName,
} from '../../../../common/git-helpers';
import { readJSON, writeFile, writeJSON } from 'fs-extra';
import path from 'node:path';

export default class Create extends FathymCommand<FathymTaskContext> {
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
    name: Args.string({
      description: 'The name of the application to create.',
      default: '.',
    }),
  };

  static title = 'Create React Application';

  protected async loadTasks(): Promise<ListrTask<FathymTaskContext>[]> {
    const { args, flags } = await this.parse(Create);

    let { name } = args;

    const { mui, tailwind } = flags;

    name = name || '.';

    const pckgJsonPath = path.join(name, './package.json');

    return [
      {
        title: `Create react application`,
        task: async (ctx, task) => {
          await runProc('npx', [
            'create-react-app',
            name,
            '--template typescript',
          ]);

          await runProc('npm', ['install', '@fathym/cli@latest', '--save-dev']);
        },
      },
      {
        title: `Add Tailwind`,
        enabled: (ctx) => tailwind,
        task: async (ctx, task) => {
          await runProc('npm', [
            'install ',
            '-D',
            'tailwindcss ',
            'postcss',
            'autoprefixer',
            `--prefix ${name}`,
          ]);

          await runProc(`cd ${name} && npx`, ['tailwindcss ', 'init', '-p ']);

          await writeFile(
            path.join(name, './tailwind.config.js'),
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
            path.join(name, './src/index.css'),
            `@tailwind base;
@tailwind components;
@tailwind utilities;
`
          );
        },
      },
      {
        title: `Add MUI`,
        enabled: (ctx) => mui,
        task: async (ctx, task) => {
          throw new Error('MUI setup is not yet supported');
        },
      },
      {
        title: `Configure react app`,
        task: async (ctx, task) => {
          const pckgJson = await readJSON(pckgJsonPath);

          const gitRepo = await isGitRepo();

          pckgJson.name = gitRepo
            ? await loadCurrentGitPackageName()
            : pckgJson.name;
          pckgJson.version = '0.0.0';
          pckgJson.private = false;
          pckgJson.homepage = '.';

          await writeJSON(pckgJsonPath, pckgJson, {
            spaces: 2,
          });
        },
      },
      {
        title: `Configure scripts`,
        task: async (ctx, task) => {
          const pckgJson = await readJSON(pckgJsonPath);

          pckgJson.scripts.deploy = 'npm version patch && npm run deploy:app';
          pckgJson.scripts['deploy:app'] =
            'npm run build && npm run deploy:package-json && npm publish ./build --access public';
          pckgJson.scripts['deploy:package-json'] =
            'fathym dev package transform -d ./build';

          await writeJSON(pckgJsonPath, pckgJson, {
            spaces: 2,
          });
        },
      },
      {
        title: `Configure App.tsx`,
        task: async (ctx, task) => {
          const appTsx = `import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <h1 className="text-3xl font-bold underline text-red-600">
          Some Tailwind Styling
        </h1>

        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
`;

          await writeFile(path.join(name, './src/App.tsx'), appTsx);
        },
      },
      // {
      //   title: `Start application`,
      //   task: async (ctx, task) => {
      //     runProc('npm', ['start', `--prefix ${name}`]);
      //   },
      // },
    ];
  }
}
