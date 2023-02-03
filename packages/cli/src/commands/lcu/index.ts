import { Flags } from '@oclif/core';
import { color } from '@oclif/color';
import { ListrTask, ListrTaskWrapper, PromptOptions } from 'listr2';
import Table from 'table-layout';
import open from 'open';
import { FathymCommand } from '../../common/fathym-command';
import { ClosureInstruction } from '../../common/ClosureInstruction';
import { runProc } from '../../common/task-helpers';
import { LcuPackageConfig } from '../../common/LcuPackageConfig';
import {
  ActiveEnterpriseTaskContext,
  azureCliInstallTask,
  EaCTaskContext,
  ensureActiveEnterprise,
  ensureProject,
  FathymTaskContext,
  loadEaCTask,
  loadFileAsJson,
  processAsyncArray,
  ProjectTaskContext,
} from '../../common/core-helpers';
import loadAxios from '../../common/axios';
import { GitHubTaskContext } from '../../common/git-helpers';
import { ensureOrganization } from '../../common/git-tasks';
import path from 'node:path';
import { InstallLCURequest } from '../../common/InstallLCURequest';

import { EnterpriseAsCode } from '@semanticjs/common';
import { downloadContents } from '../../common/eac-services';

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

  LCUParamAnswers: ParamAnswers;
}

export interface ParamAnswers {
  [key: string]: string;
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
      azureCliInstallTask(),
      this.downloadLcu(lcu),
      this.unpackLcu(),
      this.loadLcuConfig(),
      this.confirmParameters(ci, parameters),
      this.confirmAgreements(ci),
      ensureOrganization(this.config.configDir, organization),
      ensureProject(project),
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

  protected confirmAgreements(ci: boolean): ListrTask<InstallContext> {
    return {
      title: 'Processing LCU Agreements',
      skip: () => false,
      task: async (ctx, task) => {
        if (ci) {
          // TODO: This should do something to automatically accept agreements
        } else {
          const agreesCfg = await loadFileAsJson<any>(
            ctx.LCUPackageFiles,
            ctx.LCUPackageConfig.Agreements || './assets/agreements.json'
          );

          const prompts = await this.loadAgreementsPrompts(task, agreesCfg);

          await processAsyncArray(prompts, async (prompt) => {
            const agreeKey =
              typeof prompt.name === 'function' ? prompt.name() : prompt.name;

            const agreeCfg = agreesCfg[agreeKey];

            const value = await task.prompt(prompt);

            task.output = color.green(`Processing agreement for ${agreeKey}`);

            if (value) {
              const urn = `${agreeCfg.publisher}:${agreeCfg.offer}:${agreeCfg.sku}:${agreeCfg.version}`;

              await runProc(agreeCfg.type, [
                'vm',
                'image',
                'terms',
                'accept',
                `--urn ${urn}`,
              ]);
            } else {
              task.output = '';

              throw new Error(`Agreement declined for ${agreeKey}`);
            }

            return value;
          });
        }

        task.title = 'Thanks for accepting agreements';
      },
      options: { persistentOutput: true },
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
            ctx.LCUPackageFiles
          );

          ctx.LCUParamAnswers = await this.processPromptsSet(
            task,
            promptCfg.Prompts || [],
            promptCfg.ParameterKeys,
            ctx.LCUParamAnswers,
            ctx.EaC
          );
        }

        task.title = 'Thanks for inputing your parameters';
      },
      options: { persistentOutput: true },
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

  protected async loadAgreementsPrompts(
    task: ListrTaskWrapper<InstallContext, any>,
    agreesCfg: any
  ): Promise<PromptOptions<true>[]> {
    task.output = `Looking for required agreements`;

    const agreeKeys = Object.keys(agreesCfg);

    const prompts: PromptOptions<true>[] = [];

    await processAsyncArray(agreeKeys, async (agreeKey) => {
      const agreeCfg = agreesCfg[agreeKey];

      if (agreeCfg) {
        task.output = `Retrieving agreement details for '${agreeKey}'`;

        const agreeCfg = agreesCfg[agreeKey];

        // const urn = `${agreeCfg.publisher}:${agreeCfg.offer}:${agreeCfg.sku}:${agreeCfg.version}`;

        // const pckg = JSON.parse(
        //   await runProc(agreeCfg.type, [
        //     'vm',
        //     'image',
        //     'terms',
        //     'show',
        //     `--urn ${urn}`,
        //   ])
        // );

        // task.output = `Download marketplace terms for '${agreeKey}'`;
        // await open(pckg.marketplaceTermsLink);
        // await open(pckg.licenseTermsLink);

        // const marketplace = await downloadContents(pckg.marketplaceTermsLink);

        // task.output = `Download license terms for '${agreeKey}'`;

        // const license = await downloadContents(pckg.licenseTermsLink);

        // const footer = new Table(
        //   {
        //     agreements: '', // `${marketplace}\n\n${license}`,
        //   },
        //   { maxWidth: 80 }
        // );

        task.output = `Agree to use ${agreeKey}:`;

        prompts.push({
          type: 'confirm',
          // type: 'select',
          message: `Agree to use '${agreeKey}'`,
          name: agreeKey,
          // footer: footer,
          // choices: ['Agree', 'Cancel'],
        } as PromptOptions<true>);
      } else {
        task.output = `No agreement details provided for '${agreeKey}'; skipping.`;
      }
    });

    return prompts;
  }

  protected async loadParametersPrompts(
    lcuCfg: LcuPackageConfig,
    pckgFiles: string
  ): Promise<{ Prompts: PromptOptions<true>[][]; ParameterKeys: string[] }> {
    const paramsCfg = await loadFileAsJson<any>(
      pckgFiles,
      lcuCfg.Parameters || './assets/parameters.json'
    );

    const paramKeys = Object.keys(paramsCfg);

    const prompts: PromptOptions<true>[][] = [];

    paramKeys.forEach((key) => {
      let promptCfgs: PromptOptions<true> | PromptOptions<true>[] =
        paramsCfg[key];

      if (!Array.isArray(promptCfgs)) {
        promptCfgs = [promptCfgs as PromptOptions<true>];
      }

      prompts.push(promptCfgs);
    });

    return { Prompts: prompts, ParameterKeys: paramKeys };
  }

  protected async processPromptSet(
    task: ListrTaskWrapper<InstallContext, any>,
    prompts: PromptOptions<true>[],
    paramKey: string,
    paramAnswers: ParamAnswers,
    eac: EnterpriseAsCode
  ): Promise<ParamAnswers> {
    await processAsyncArray(prompts, async (prompt) => {
      if (!paramAnswers[paramKey]) {
        const answerKeys = Object.keys(paramAnswers);

        const promptKeys = Object.keys(prompt);

        answerKeys.forEach((answerKey) => {
          if (promptKeys.includes(answerKey)) {
            const lookup = (prompt as any)[answerKey];

            delete (prompt as any)[answerKey];

            (prompt as any)[lookup] = paramAnswers[answerKey];
          }
        });

        prompt.name = paramKey;

        prompt.validate = (value) => {
          return (prompt as any).optional || Boolean(value);
        };

        if (paramAnswers[paramKey]) {
          prompt.initial = paramAnswers[paramKey];
        }

        (prompt as any).eac = eac;

        const answer = await task.prompt(prompt);

        paramAnswers =
          answer && typeof answer === 'string'
            ? {
                ...paramAnswers,
                [paramKey]: answer,
              }
            : {
                ...paramAnswers,
                ...answer,
              };
      }
    });

    return paramAnswers;
  }

  protected async processPromptsSet(
    task: ListrTaskWrapper<InstallContext, any>,
    promptsSet: PromptOptions<true>[][],
    paramKeys: string[],
    paramAnswers: ParamAnswers,
    eac: EnterpriseAsCode
  ): Promise<ParamAnswers> {
    await processAsyncArray(promptsSet, async (prompts) => {
      const paramKey = paramKeys.shift() || '';

      paramAnswers = await this.processPromptSet(
        task,
        prompts,
        paramKey,
        paramAnswers,
        eac
      );
    });

    return paramAnswers;
  }

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
