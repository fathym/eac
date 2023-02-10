import { Flags } from '@oclif/core';
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
  FathymTaskContext,
  loadEaCTask,
  setAzureSubTask,
  SubscriptionTaskContext,
} from '../../../common/core-helpers';
import { runProc } from '../../../common/task-helpers';
import { downloadFile, withEaCDraft } from '../../../common/eac-services';
import { EaCCloudDetails } from '@semanticjs/common';

interface UpsertTaskContext
  extends FathymTaskContext,
    ActiveEnterpriseTaskContext,
    EaCTaskContext {}

export default class Upsert extends FathymCommand<UpsertTaskContext> {
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

  static args = [
    {
      name: 'projectLookup',
      description:
        'The project lookup to use for upsert or declared lookup on create.',
    },
  ];

  static title = 'Upsert Azure Cloud';

  protected async loadTasks(): Promise<ListrTask<UpsertTaskContext>[]> {
    return [
      ensureActiveEnterprise(this.config.configDir),
      loadEaCTask(this.config.configDir),
      await this.addProjectToDraft(),
    ];
  }

  protected async addProjectToDraft(): Promise<ListrTask<UpsertTaskContext>> {
    const { args, flags } = await this.parse(Upsert);

    let { projectLookup } = args;

    const { name, description } = flags;

    projectLookup = projectLookup || randomUUID();

    return {
      title: 'Create project',
      task: async (ctx, task) => {
        const currentEaCProj =
          ctx.EaC.Projects && ctx.EaC.Projects[projectLookup]
            ? ctx.EaC.Projects[projectLookup] || {}
            : {};

        await withEaCDraft(
          this.config.configDir,
          ctx.ActiveEnterpriseLookup,
          async (draft) => {
            if (!draft.EaC!.Projects) {
              draft.EaC!.Projects = {};
            }

            if (!draft.EaC!.Projects[projectLookup]) {
              draft.EaC!.Projects[projectLookup] = {};
            }

            draft.EaC!.Projects[projectLookup].Project = {
              ...currentEaCProj.Project,
              Name: name,
              Description: description,
            };

            return draft;
          }
        );
      },
    };
  }
}
