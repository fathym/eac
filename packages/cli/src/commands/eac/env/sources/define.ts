import { Args, Flags } from '@oclif/core';
import { color } from '@oclif/color';
import { ListrTask } from 'listr2';
import {} from '@semanticjs/common';
import { FathymCommand } from '../../../../common/fathym-command';
import {
  ActiveEnterpriseTaskContext,
  EaCTaskContext,
  ensureActiveEnterprise,
  ensureSourceControl,
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
    EaCTaskContext,
    GitHubTaskContext {}

export default class Create extends FathymCommand<DefineTaskContext> {
  static description = `Used for creating a new source control.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    organization: Flags.string({
      description: 'The organization to define from.',
    }),
    repository: Flags.string({
      description: 'The repository to define from.',
    }),
    mainBranch: Flags.string({
      description: 'The branch to use as main.',
    }),
  };

  static args = {
    sourceLookup: Args.string({
      description: 'The source lookup for the definition.',
    }),
  };

  static title = 'Create Source Control';

  protected async loadTasks(): Promise<ListrTask<DefineTaskContext>[]> {
    const { args, flags } = await this.parse(Create);

    const { sourceLookup } = args;

    const { mainBranch, organization, repository } = flags;

    return [
      ensureActiveEnterprise(this.config.configDir),
      loadEaCTask(this.config.configDir),
      ensureOrganization(this.config.configDir, organization),
      ensureRepository(this.config.configDir, repository),
      ensureBranch(
        this.config.configDir,
        (ctx, value) => {
          ctx.GitHubMainBranch = value || '';
        },
        mainBranch
      ),
      this.defineSourceControl(),
    ];
  }

  protected defineSourceControl(): ListrTask<DefineTaskContext> {
    return {
      title: 'Define source control location',
      task: async (ctx, task) => {
        const env =
          ctx.EaC.Environments![ctx.EaC.Enterprise?.PrimaryEnvironment!];

        await withEaCDraft(
          this.config.configDir,
          ctx.ActiveEnterpriseLookup,
          async (draft) => {
            const sourceLookup = `github://${ctx.GitHubOrganization}/${ctx.GitHubRepository}`;

            if (!draft.EaC.Environments) {
              draft.EaC.Environments = {};
            }

            if (
              !draft.EaC.Environments![ctx.EaC.Enterprise!.PrimaryEnvironment!]
            ) {
              draft.EaC.Environments![ctx.EaC.Enterprise!.PrimaryEnvironment!] =
                {};
            }

            if (
              !draft.EaC.Environments![ctx.EaC.Enterprise!.PrimaryEnvironment!]
                .Sources
            ) {
              draft.EaC.Environments![
                ctx.EaC.Enterprise!.PrimaryEnvironment!
              ].Sources = {};
            }

            draft.EaC.Environments![
              ctx.EaC.Enterprise!.PrimaryEnvironment!
            ].Sources![sourceLookup!] = {
              ...env.Sources![sourceLookup!],
              Type: 'GitHub',
              Name: `@${ctx.GitHubOrganization}/${ctx.GitHubRepository}`,
              Organization: ctx.GitHubOrganization,
              Repository: ctx.GitHubRepository,
              Branches: ctx.GitHubBranches || [ctx.GitHubMainBranch],
              MainBranch: ctx.GitHubMainBranch,
            };

            return draft;
          }
        );
      },
    };
  }
}
