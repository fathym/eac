import { Args, Flags } from '@oclif/core';
import { ListrTask } from 'listr2';
import { EaCSourceControl } from '@semanticjs/common';
import { FathymCommand } from '../../../../common/fathym-command';
import { GitHubTaskContext } from '../../../../common/git-helpers';
import {
  ensureBranch,
  ensureOrganization,
  ensureRepository,
} from '../../../../common/git-tasks';
import {
  ActiveEnterpriseTaskContext,
  EaCTaskContext,
  ensureActiveEnterpriseTask,
  loadEaCTask,
  withEaCDraftEditTask,
} from '../../../../common/eac-services';
import { FathymTaskContext } from '../../../../common/core-helpers';

interface DefineTaskContext
  extends FathymTaskContext,
    ActiveEnterpriseTaskContext,
    EaCTaskContext,
    GitHubTaskContext {}

export default class Define extends FathymCommand<DefineTaskContext> {
  static description = `Used for defining a new source control.`;

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

  static title = 'Define Source Control';

  protected async loadTasks(): Promise<ListrTask<DefineTaskContext>[]> {
    const { args, flags } = await this.parse(Define);

    const { sourceLookup } = args;

    const { mainBranch, organization, repository } = flags;

    return [
      ensureActiveEnterpriseTask(this.config.configDir),
      loadEaCTask(this.config.configDir),
      ensureOrganization(this.config.configDir, organization),
      ensureRepository(this.config.configDir, repository),
      ensureBranch(
        this.config.configDir,
        (ctx, value) => {
          ctx.GitHubBranch = value || '';
        },
        mainBranch
      ),
      this.defineSourceControl(),
    ];
  }

  protected defineSourceControl(): ListrTask<DefineTaskContext> {
    return withEaCDraftEditTask<DefineTaskContext, EaCSourceControl>(
      'Define source control',
      this.config.configDir,
      (ctx) => {
        const sourceLookup = `github://${ctx.GitHubOrganization}/${ctx.GitHubRepository}`;

        return [
          [
            'Environments',
            ctx.EaC.Enterprise!.PrimaryEnvironment!,
            'Sources',
            sourceLookup,
          ],
        ];
      },
      {
        draftPatch: (ctx) => {
          const patch = {
            Type: 'GitHub',
            Name: `@${ctx.GitHubOrganization}/${ctx.GitHubRepository}`,
            Organization: ctx.GitHubOrganization,
            Repository: ctx.GitHubRepository,
            Branches: ctx.GitHubBranches || [ctx.GitHubBranch],
            MainBranch: ctx.GitHubBranch,
          };

          return patch;
        },
      }
    );
  }
}
