import { Flags } from '@oclif/core';
import { ListrTask, PromptOptions } from 'listr2';
import { readFile, read, readJson } from 'fs-extra';
import { FathymCommand } from '../../common/fathym-command';
import { ClosureInstruction } from '../../common/ClosureInstruction';
import { runProc } from '../../common/task-helpers';
import { LcuPackageConfig } from '../../common/LcuPackageConfig';
import path from 'node:path';
import { compile } from 'handlebars';
import { AccessTokenTaskContext } from '../../common/auth-helpers';
import { tsPath } from '@oclif/core/lib/config';

interface InstallContext extends AccessTokenTaskContext {
  EaCDraft: any;

  LCUParamAnswers: any;

  LCUPackageConfig: LcuPackageConfig;

  LCUPackageFiles: string;

  LCUPackageTarball: string;
}

export default class Install extends FathymCommand<InstallContext> {
  static aliases = ['install', 'i']; // How to get all variations working 'lcu install', 'lcu i',

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

    const { parameters } = flags;

    return [
      this.downloadLcu(lcu),
      this.unpackLcu(),
      this.loadLcuConfig(),
      await this.confirmParameters(parameters),
      this.prepareLcuEaCDraft(),
      // this.cleanupLcuFiles()
    ];
  }

  protected cleanupLcuFiles(): ListrTask<InstallContext> {
    return {
      title: `Cleaning up LCU setup files`,
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
    parameterDefaults?: string
  ): Promise<ListrTask<InstallContext>> {
    return {
      title: 'Collecting Parameters',
      skip: () => false,
      task: async (ctx, task) => {
        const prompts = await this.loadParametersPrompts(
          ctx.LCUPackageConfig,
          ctx.LCUPackageFiles,
          parameterDefaults
        );
        task.title = JSON.stringify(prompts);

        ctx.LCUParamAnswers = await task.prompt(prompts); // {
        //   type: 'input',
        //   message: 'Enter Alfresco host:',
        //   name: 'HOST_IP_VARIABLE',
        //   initial: paramSet['HOST_IP_VARIABLE'] || undefined,
        // });
        // console.log(JSON.stringify(ctx.LCUParamAnswers));

        // task.title = 'Thanks for inputting your parameters';
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

        task.title = `Downloaded LCU: ${ctx.LCUPackageTarball}`;
      },
    };
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
    parameterDefaults?: string
  ): Promise<PromptOptions<true>[]> {
    const paramSet = JSON.parse(parameterDefaults || '{}');

    const paramsCfg = await this.loadFileAsJson<any>(
      pckgFiles,
      lcuCfg.Parameters || './assets/parameters.json'
    );

    const paramKeys = Object.keys(paramsCfg);

    const prompts: PromptOptions<true>[] = [];

    paramKeys.forEach((key) => {
      const prompt: PromptOptions<true> = paramsCfg[key];

      prompt.name = key;

      if (paramSet[key]) {
        prompt.initial = paramSet[key];
      }

      prompts.push(prompt);
    });

    return prompts;
  }

  protected prepareLcuEaCDraft(): ListrTask<InstallContext> {
    return {
      title: `Preparing EaC for commit`,
      task: async (ctx, task) => {
        const eacDraftTemplate = await this.loadFileAsString(
          ctx.LCUPackageFiles,
          path.join('assets', 'eac.json')
        );

        const template = compile(eacDraftTemplate);

        const eacDraftStr = template(ctx.LCUParamAnswers);

        ctx.EaCDraft = JSON.parse(eacDraftStr);

        // task.title = JSON.stringify(ctx.LCUParamAnswers);
        // task.title = JSON.stringify(
        //   ctx.EaCDraft.Applications.API[0].Application.LowCodeUnit
        // );
      },
    };
  }

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
