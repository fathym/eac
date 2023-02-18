import { Args, Flags } from '@oclif/core';
import { color } from '@oclif/color';
import crypto from 'node:crypto';
import { ListrTask } from 'listr2';
import {} from '@semanticjs/common';
import { FathymCommand } from '../../../../common/fathym-command';
import {
  ActiveEnterpriseTaskContext,
  EaCTaskContext,
  ensureActiveEnterprise,
  FathymTaskContext,
  loadEaCTask,
} from '../../../../common/core-helpers';
import { GitHubTaskContext } from '../../../../common/git-helpers';
import {
  ensureBranch,
  ensureOrganization,
  ensureRepository,
} from '../../../../common/git-tasks';
import {
  EaCDraft,
  ensurePromptValue,
  withEaCDraft,
} from '../../../../common/eac-services';

interface DefineTaskContext
  extends FathymTaskContext,
    ActiveEnterpriseTaskContext,
    EaCTaskContext {}

export default class Define extends FathymCommand<DefineTaskContext> {
  static description = `Used for creating a new pipeline control.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    name: Flags.string({
      description: 'The name of the build pipeline.',
    }),
    path: Flags.string({
      description: 'The path of the generated action file.',
    }),
    buildCommand: Flags.string({
      description: 'The build command of the generated action file.',
    }),
    installCommand: Flags.string({
      description: 'The install command of the generated action file.',
    }),
    templates: Flags.string({
      description: `The template(s) ('|' delimited for multiple) to use for generated action file.`,
    }),
  };

  static args = {
    type: Args.string({
      description: 'The pipeline lookup for the definition.',
      options: ['GitHub', 'NPM'],
    }),
    pipelineLookup: Args.string({
      description: 'The pipeline lookup for the definition.',
    }),
  };

  static title = 'Create Pipeline Control';

  protected async loadTasks(): Promise<ListrTask<DefineTaskContext>[]> {
    const { args, flags } = await this.parse(Define);

    const { type, pipelineLookup } = args;

    const { name, path, buildCommand, installCommand, templates } = flags;

    return [
      ensureActiveEnterprise(this.config.configDir),
      loadEaCTask(this.config.configDir),
      this.definePipeline(
        type,
        pipelineLookup,
        name,
        path,
        buildCommand,
        installCommand,
        templates
      ),
    ];
  }

  protected definePipeline(
    type?: string,
    pipelineLookup?: string,
    name?: string,
    path?: string,
    output?: string,
    buildCommand?: string,
    installCommand?: string,
    templates?: string
  ): ListrTask<DefineTaskContext> {
    return {
      title: 'Define build pipeline',
      task: async (ctx, task) => {
        if (!pipelineLookup) {
          pipelineLookup = await task.prompt({
            type: 'eac:env:pipelines|select',
            eac: ctx.EaC,
            optional: true,
          } as any);
        }

        if (!pipelineLookup) {
          pipelineLookup = await task.prompt({
            type: 'input',
            message: 'Unique lookup for the pipeline',
            // validate: v => regexValidate,
          });
        }

        if (!pipelineLookup) {
          pipelineLookup = crypto.randomUUID();
        }

        if (!type) {
          type = await task.prompt({
            type: 'select',
            choices: ['GitHub', 'NPM'],
            validate: (v) => Boolean(v),
          } as any);
        }

        if (!name) {
          name = await task.prompt({
            type: 'input',
            message: 'Name of the build pipeline',
            validate: (v) => Boolean(v),
          });
        }

        if (!path) {
          path = await task.prompt({
            type: 'input',
            message: 'Path of the build pipeline',
            validate: (v) => Boolean(v),
          });
        }

        if (!output) {
          output = await task.prompt({
            type: 'input',
            message: 'Output of artifacts of the build pipeline',
            validate: (v) => Boolean(v),
          });
        }

        if (!templates) {
          templates = await task.prompt({
            type: 'input',
            message: `Templates of the build pipeline ('|' delimited for multiples)`,
            validate: (v) => Boolean(v),
          });
        }

        if (!buildCommand) {
          buildCommand = await task.prompt({
            type: 'input',
            message: 'Build command of the build pipeline',
            validate: (v) => Boolean(v),
          });
        }

        if (!installCommand) {
          installCommand = await task.prompt({
            type: 'input',
            message: 'Install command of the build pipeline',
            validate: (v) => Boolean(v),
          });
        }

        const env =
          ctx.EaC.Environments![ctx.EaC.Enterprise?.PrimaryEnvironment!];

        await withEaCDraft(
          this.config.configDir,
          ctx.ActiveEnterpriseLookup,
          async (draft) => {
            const buildDeployKey =
              type === 'GitHub' ? 'BuildCommand' : 'DeployCommand';

            draft.EaC.Environments![
              ctx.EaC.Enterprise!.PrimaryEnvironment!
            ].Artifacts![pipelineLookup!] = {
              ...env.Artifacts![pipelineLookup!],
              Type: type,
              Name: name,
              Output: output,
              [buildDeployKey]: buildCommand,
              InstallCommand: installCommand,
              NPMRegistry: `https://registry.npmjs.org/`,
            };

            draft.EaC.Environments![
              ctx.EaC.Enterprise!.PrimaryEnvironment!
            ].DevOpsActions![pipelineLookup!] = {
              ...env.DevOpsActions![pipelineLookup!],
              Name: name,
              ArtifactLookups: [pipelineLookup!],
              Path: path,
              Templates: templates?.split('|') || [],
            };

            return draft;
          },
          [
            [
              'Environments',
              ctx.EaC.Enterprise!.PrimaryEnvironment!,
              'DevOpsActions',
            ],
            [
              'Environments',
              ctx.EaC.Enterprise!.PrimaryEnvironment!,
              'Artifacts',
            ],
          ]
        );
      },
    };
  }
}
