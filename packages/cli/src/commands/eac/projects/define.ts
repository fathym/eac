import { Args, Flags } from '@oclif/core';
import { color } from '@oclif/color';
import { ListrTask, PromptOptions } from 'listr2';
import { randomUUID } from 'node:crypto';
import { FathymCommand } from '../../../common/fathym-command';
import {
  ActiveEnterpriseTaskContext,
  azureCliInstallTask,
  AzureCLITaskContext,
  delay,
  EaCTaskContext,
  ensureActiveEnterprise,
  ensureProject,
  FathymTaskContext,
  loadEaCTask,
  ProjectTaskContext,
  setAzureSubTask,
  SubscriptionTaskContext,
} from '../../../common/core-helpers';
import { runProc } from '../../../common/task-helpers';
import { downloadFile, withEaCDraft } from '../../../common/eac-services';
import { EaCCloudDetails } from '@semanticjs/common';

interface DefineTaskContext
  extends FathymTaskContext,
    ActiveEnterpriseTaskContext,
    EaCTaskContext,
    ProjectTaskContext {}

export default class Define extends FathymCommand<DefineTaskContext> {
  static description = `Used for creating or updating a project.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    description: Flags.string({
      char: 'd',
      description: 'The description of the pojrect.',
    }),
    name: Flags.string({
      char: 'n',
      description: 'The name of the pojrect.',
    }),
  };

  static args = {
    projectLookup: Args.string({
      description: 'The project lookup to use for define.',
    }),
  };

  static title = 'Define Project';

  protected async loadTasks(): Promise<ListrTask<DefineTaskContext>[]> {
    const { args, flags } = await this.parse(Define);

    const { projectLookup } = args;

    const { name, description } = flags;

    return [
      ensureActiveEnterprise(this.config.configDir),
      loadEaCTask(this.config.configDir),
      ensureProject(this.config.configDir, projectLookup, true, true),
      this.addProjectToDraft(name, description),
    ];
  }

  protected addProjectToDraft(
    name?: string,
    description?: string
  ): ListrTask<DefineTaskContext> {
    return {
      title: 'Create project',
      task: async (ctx, task) => {
        const currentEaCProj =
          ctx.EaC.Projects && ctx.EaC.Projects[ctx.ProjectLookup]
            ? ctx.EaC.Projects[ctx.ProjectLookup] || {}
            : {};

        await withEaCDraft(
          this.config.configDir,
          ctx.ActiveEnterpriseLookup,
          async (draft) => {
            if (!draft.EaC.Projects) {
              draft.EaC.Projects = {};
            }

            if (!draft.EaC.Projects[ctx.ProjectLookup]) {
              draft.EaC.Projects[ctx.ProjectLookup] = {};
            }

            if (name || description) {
              draft.EaC.Projects[ctx.ProjectLookup].Project = {
                ...currentEaCProj.Project,
                Name:
                  name ||
                  draft.EaC.Projects[ctx.ProjectLookup]?.Project?.Name ||
                  currentEaCProj.Project?.Name,
                Description:
                  description ||
                  draft.EaC.Projects[ctx.ProjectLookup]?.Project?.Description ||
                  currentEaCProj.Project?.Description ||
                  name,
              };
            }

            return draft;
          }
        );
      },
    };
  }
}
