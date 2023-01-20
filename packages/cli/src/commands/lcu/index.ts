import { Flags } from '@oclif/core';
import { ListrTask, PromptOptions } from 'listr2';
import { readFile, read, readJson } from 'fs-extra';
import { FathymCommand } from '../../common/fathym-command';
import { ClosureInstruction } from '../../common/ClosureInstruction';
import { runProc } from '../../common/task-helpers';
import { LcuPackageConfig } from '../../common/LcuPackageConfig';
import path from 'node:path';
import { compile } from 'handlebars';
import {
  AccessTokenTaskContext,
  loadApiRootUrl,
} from '../../common/core-helpers';
import { tsPath } from '@oclif/core/lib/config';
import loadAxios from '../../common/axios';

interface InstallContext extends AccessTokenTaskContext {
  EaCDraft: any;

  LCUParamAnswers: any;

  LCUPackageConfig: LcuPackageConfig;

  LCUPackageFiles: string;

  LCUPackageTarball: string;
}

export default class Install extends FathymCommand<InstallContext> {
  static description =
    'Used to install, or walk a user through installing an LCU.';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    parameters: Flags.string({
      char: 'p',
      description:
        'Specify values to use in the parameters list. ({ paramName: paramValue })',
    }),
  };

  static args = [{ name: 'lcu', required: true }];

  static title = 'Install LCU';

  protected async loadTasks(): Promise<ListrTask[]> {
    const { args, flags } = await this.parse(Install);

    const { lcu } = args;

    const { ci, parameters } = flags;

    return [
      this.downloadLcu(lcu),
      this.unpackLcu(),
      this.loadLcuConfig(),
      await this.confirmParameters(ci, parameters),
      // this.prepareLcuEaCDraft(),
      this.cleanupLcuFiles(),
    ];
  }

  protected cleanupLcuFiles(): ListrTask<InstallContext> {
    return {
      title: `Cleaning up LCU install files`,
      task: async (ctx) => {
        await runProc('npx', [
          'rimraf',
          ctx.LCUPackageFiles.replace('\\package', ''),
        ]);

        await runProc('npx', ['rimraf', ctx.LCUPackageTarball]);
      },
    };
  }

  protected async confirmParameters(
    ci: boolean,
    parameterDefaults?: string
  ): Promise<ListrTask<InstallContext>> {
    return {
      title: 'Collecting Parameters',
      skip: () => false,
      task: async (ctx, task) => {
        ctx.LCUParamAnswers = JSON.parse(parameterDefaults || '{}');

        if (!ci) {
          const promptCfg = await this.loadParametersPrompts(
            ctx.LCUPackageConfig,
            ctx.LCUPackageFiles,
            ctx.LCUParamAnswers
          );

          ctx.LCUParamAnswers = await task.prompt(promptCfg.Prompts);

          if (ctx.LCUParamAnswers && typeof ctx.LCUParamAnswers === 'string') {
            ctx.LCUParamAnswers = {
              [promptCfg.ParameterKeys[0]]: ctx.LCUParamAnswers,
            };
          }
        }

        task.title = 'Thanks for inputting your parameters';
      },
    };
  }

  protected downloadLcu(lcu: string): ListrTask<InstallContext> {
    return {
      title: `Download LCU: ${lcu}`,
      task: async (ctx, task) => {
        await runProc('npx', ['make-dir-cli', 'lcus']);

        ctx.LCUPackageTarball = await runProc('npm', [
          'pack',
          lcu,
          '--pack-destination="./lcus"',
        ]);

        ctx.LCUPackageTarball = `./lcus/${ctx.LCUPackageTarball}`.replace(
          '\n',
          ''
        );

        task.title = `Downloaded LCU: ${lcu}`;
      },
    };
  }

  protected async installLcu(configDir: string): Promise<void> {
    const axios = await loadAxios(configDir);

    const apiUrl = await loadApiRootUrl(
      configDir,
      `{entLookup}/cli/lcu/install/{project}`
    );

    const response = await axios.post(apiUrl, {});

    //  TODO: Handle bad stati

    return response.data?.Model || [];
  }

  protected async loadFileAsJson<T>(
    pckgFiles: string,
    filename: string
  ): Promise<T> {
    const filePath = path.join(pckgFiles, filename);

    const json = await readJson(filePath);

    return json as T;
  }

  protected async loadFileAsString(
    pckgFiles: string,
    filename: string
  ): Promise<string> {
    const filePath = path.join(pckgFiles, filename);

    const str = await readFile(filePath);

    return String(str);
  }

  protected loadLcuConfig(): ListrTask<InstallContext> {
    return {
      title: `Loading LCU Config`,
      task: async (ctx) => {
        ctx.LCUPackageConfig = await this.loadFileAsJson<LcuPackageConfig>(
          ctx.LCUPackageFiles,
          'lcu.json'
        );
      },
    };
  }

  protected async loadParametersPrompts(
    lcuCfg: LcuPackageConfig,
    pckgFiles: string,
    paramSet: any
  ): Promise<{ Prompts: PromptOptions<true>[]; ParameterKeys: string[] }> {
    const paramsCfg = await this.loadFileAsJson<any>(
      pckgFiles,
      lcuCfg.Parameters || './assets/parameters.json'
    );

    const paramKeys = Object.keys(paramsCfg);

    const prompts: PromptOptions<true>[] = [];

    paramKeys.forEach((key) => {
      const prompt: PromptOptions<true> = paramsCfg[key];

      prompt.name = key;

      prompt.validate = (value) => {
        return Boolean(value);
      };

      if (paramSet[key]) {
        prompt.initial = paramSet[key];
      }

      prompts.push(prompt);
    });

    return { Prompts: prompts, ParameterKeys: paramKeys };
  }

  // protected prepareLcuEaCDraft(): ListrTask<InstallContext> {
  //   return {
  //     title: `Preparing EaC for commit`,
  //     task: async (ctx, task) => {
  //       const eacDraftTemplate = await this.loadFileAsString(
  //         ctx.LCUPackageFiles,
  //         path.join('assets', 'eac.json')
  //       );

  //       const template = compile(eacDraftTemplate);

  //       const eacDraftStr = template(ctx.LCUParamAnswers);

  //       ctx.EaCDraft = JSON.parse(eacDraftStr);

  //       task.title = 'EaC draft prepared for commit';
  //     },
  //   };
  // }

  protected unpackLcu(): ListrTask<InstallContext> {
    return {
      title: `Unpacking LCU`,
      task: async (ctx, task) => {
        task.title = `Unpacking LCU: ${ctx.LCUPackageTarball}`;

        ctx.LCUPackageFiles = ctx.LCUPackageTarball.replace('.tgz', '');

        task.title = `Unpacking LCU to: ${ctx.LCUPackageFiles}`;

        await runProc('npx', ['make-dir-cli', `${ctx.LCUPackageFiles}`]);

        await runProc('tar', [
          '-xf',
          ctx.LCUPackageTarball,
          `-C ${ctx.LCUPackageFiles}`,
        ]);

        ctx.LCUPackageFiles = path.join(ctx.LCUPackageFiles, 'package');

        task.title = `Unpackad LCU: ${ctx.LCUPackageFiles}`;
      },
    };
  }
}
