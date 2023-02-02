import { Flags } from '@oclif/core';
import { ListrTask, PromptOptions } from 'listr2';
import { FathymCommand } from '../../common/fathym-command';
import { ClosureInstruction } from '../../common/ClosureInstruction';
import { runProc } from '../../common/task-helpers';
import { LcuPackageConfig } from '../../common/LcuPackageConfig';
import {
  ActiveEnterpriseTaskContext,
  EaCTaskContext,
  ensureActiveEnterprise,
  ensureProject,
  FathymTaskContext,
  loadEaCTask,
  loadFileAsJson,
  ProjectTaskContext,
} from '../../common/core-helpers';
import loadAxios from '../../common/axios';
import { GitHubTaskContext } from '../../common/git-helpers';
import { ensureOrganization } from '../../common/git-tasks';
import path from 'node:path';
import { InstallLCURequest } from '../../common/InstallLCURequest';

import { EnterpriseAsCode } from '@semanticjs/common';
import { EaCSelectPromptOptions } from '../../common/prompts/EaCSelectPromptOptions';

export interface InstallContext
  extends FathymTaskContext,
    ActiveEnterpriseTaskContext,
    EaCTaskContext,
    GitHubTaskContext,
    ProjectTaskContext {
  EaCDraft: any;

  LCUPackageConfig: LcuPackageConfig;

  LCUPackageFiles: string;

  LCUPackageTarball: string;

  LCUParamAnswers: { [key: string]: string };
}

export default class Install extends FathymCommand<InstallContext> {
  static description =
    'Used to install, or walk a user through installing an LCU.';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    organization: Flags.string({
      char: 'o',
      description: 'The organization to deploy LCU code repositories to.',
    }),
    parameters: Flags.string({
      description:
        'Specify values to use in the parameters list: ({ paramName: paramValue })',
    }),
    project: Flags.string({
      char: 'p',
      description: 'The project to deploy the LCU into.',
    }),
  };

  static args = [{ name: 'lcu', required: true }];

  static title = 'Install LCU';

  protected async loadTasks(): Promise<ListrTask[]> {
    const { args, flags } = await this.parse(Install);

    let { lcu } = args;

    const { ci, parameters, organization, project } = flags;

    lcu = lcu.replace(/\\/g, '/');

    return [
      ensureActiveEnterprise(this.config.configDir),
      loadEaCTask(this.config.configDir),
      this.downloadLcu(lcu),
      this.unpackLcu(),
      this.loadLcuConfig(),
      this.confirmParameters(ci, parameters),
      ensureOrganization(this.config.configDir, organization),
      ensureProject(project),
      // // this.prepareLcuEaCDraft(),
      this.runInstallLcu(lcu),
      this.cleanupLcuFiles(),
    ];
  }

  protected cleanupLcuFiles(): ListrTask<InstallContext> {
    return {
      title: `Cleaning up LCU install files`,
      task: async (ctx) => {
        // await runProc('npx', [
        //   'rimraf',
        //   ctx.LCUPackageFiles.replace('\\package', ''),
        // ]);

        // await runProc('npx', ['rimraf', ctx.LCUPackageTarball]);

        await runProc('npx', ['rimraf', './lcus']);
      },
    };
  }

  protected confirmParameters(
    ci: boolean,
    parameterDefaults?: string
  ): ListrTask<InstallContext> {
    return {
      title: 'Collecting LCU Parameters',
      skip: () => false,
      task: async (ctx, task) => {
        ctx.LCUParamAnswers = JSON.parse(parameterDefaults || '{}');

        if (!ci) {
          const promptCfg = await this.loadParametersPrompts(
            ctx.LCUPackageConfig,
            ctx.LCUPackageFiles,
            ctx.LCUParamAnswers,
            ctx.EaC
          );

          promptCfg.Prompts.forEach(async (prompt) => {
            if (!prompt) {
              const answer = await task.prompt(prompt);

              ctx.LCUParamAnswers =
                answer && typeof answer === 'string'
                  ? {
                      ...ctx.LCUParamAnswers,
                      [promptCfg.ParameterKeys[0]]: ctx.LCUParamAnswers,
                    }
                  : {
                      ...ctx.LCUParamAnswers,
                      ...answer,
                    };
            }
          });
        }

        task.title = 'Thanks for inputing your parameters';
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

  protected async installLcu(
    configDir: string,
    entLookup: string,
    installReq: InstallLCURequest
  ): Promise<void> {
    const axios = await loadAxios(configDir);

    const response = await axios.post(`${entLookup}/lcu/install`, installReq);

    return response.data?.Model || [];
  }

  protected loadLcuConfig(): ListrTask<InstallContext> {
    return {
      title: `Loading LCU Config`,
      task: async (ctx) => {
        ctx.LCUPackageConfig = await loadFileAsJson<LcuPackageConfig>(
          ctx.LCUPackageFiles,
          'lcu.json'
        );
      },
    };
  }

  protected async loadParametersPrompts(
    lcuCfg: LcuPackageConfig,
    pckgFiles: string,
    paramSet: any,
    eac: EnterpriseAsCode
  ): Promise<{ Prompts: PromptOptions<true>[]; ParameterKeys: string[] }> {
    const paramsCfg = await loadFileAsJson<any>(
      pckgFiles,
      lcuCfg.Parameters || './assets/parameters.json'
    );

    const paramKeys = Object.keys(paramsCfg);

    const prompts: PromptOptions<true>[] = [];

    paramKeys.forEach((key) => {
      const prompt: PromptOptions<true> = paramsCfg[key];

      prompt.name = key;

      prompt.validate = (value) => {
        return (prompt as any).optional || Boolean(value);
      };

      if (paramSet[key]) {
        prompt.initial = paramSet[key];
      }

      (prompt as any).eac = eac;

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

  protected runInstallLcu(lcu: string): ListrTask<InstallContext> {
    return {
      title: `Installing LCU`,
      task: async (ctx, task) => {
        await this.installLcu(
          this.config.configDir,
          ctx.ActiveEnterpriseLookup,
          {
            LCUPackage: lcu,
            Organization: ctx.GitHubOrganization,
            Parameters: ctx.LCUParamAnswers,
            ProjectCreate: !ctx.ProjectLookup,
            Project: ctx.ProjectLookup,
          }
        );
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
