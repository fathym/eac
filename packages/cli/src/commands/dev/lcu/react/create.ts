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

          await runProc('npm', [
            'install',
            '@fathym/cli@latest',
            '--save-dev',
            `--prefix ${name}`,
          ]);
        },
      },
      {
        title: `Add Tailwind`,
        enabled: (ctx) => tailwind,
        task: async (ctx, task) => {
          await runProc('npm', [
            'install ',
            'tailwindcss ',
            '@tailwindcss/typography',
            'postcss',
            'autoprefixer',
            '--save-dev',
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
  plugins: [
    require('@tailwindcss/typography'),
  ]
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
        title: `Configure App`,
        task: async (ctx, task) => {
          await runProc('npx rimraf', ['src/App.css']);

          await writeFile(
            path.join(name, './src/App.tsx'),
            `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <title>React App</title>
    <base href="/">
    <meta
      name="description"
      content="Web site created using create-react-app"
    />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>

    <template id="fathym-compose" style="display: none"></template>
  </body>
</html>
`
          );

          await writeFile(
            path.join(name, './src/App.tsx'),
            `import React from 'react';
import logo from './logo.svg';
import TemplateInjector from './TemplateInjector';

function App() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 dark:bg-gray-800">
      <header className="flex flex-col items-center">
        <img src={logo} className="h-60 mb-4" alt="logo" />

        <h1 className="text-3xl font-bold underline text-red-600 mb-2 dark:text-white">
          Some Tailwind Styling
        </h1>

        <p className="text-gray-700 mb-4 dark:text-gray-300">
          Edit
          <code className="font-mono bg-white dark:bg-gray-900 rounded px-1 text-gray-900 dark:text-gray-100">
            src/App.tsx
          </code>
          and save to reload.
        </p>

        <a
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded dark:bg-gray-500 dark:hover:bg-gray-700 dark:text-gray-900"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

        <TemplateInjector templateId='fathym-compose' className="mt-8 prose dark:prose-invert"></TemplateInjector>
      </header>
    </div>
  );
}

export default App;
          `
          );

          await writeFile(
            path.join(name, './src/TemplateInjector.tsx'),
            `import React, { useEffect, useRef } from "react";

interface Props {
  templateId: string;
  className?: string;
}

const TemplateInjector: React.FC<Props> = ({ templateId, className }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const template = document.getElementById(templateId);

    if (template) {
      const html = template.innerHTML;

      if (ref.current) {
        ref.current.innerHTML = html;
      }
    }
  }, [templateId]);

  return (
    <div ref={ref} className={className}>
    </div>
  );
};

export default TemplateInjector;
`
          );
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
