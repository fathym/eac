import { Args } from '@oclif/core';
import open from 'open';
import { ListrTask } from 'listr2';
import { FathymCommand } from '../../../../common/fathym-command';
import { FathymTaskContext } from '../../../../common/core-helpers';
import {
  EaCTaskContext,
  ActiveEnterpriseTaskContext,
  ProjectTaskContext,
  ApplicationTaskContext,
  ensureActiveEnterpriseTask,
  loadEaCTask,
  ensureProjectTask,
  ensureApplicationTask,
} from '../../../../common/eac-services';

interface PreivewContext
  extends FathymTaskContext,
    EaCTaskContext,
    ActiveEnterpriseTaskContext,
    ProjectTaskContext,
    ApplicationTaskContext {}

export default class Preview extends FathymCommand<PreivewContext> {
  static description = `Used for preivewing a application.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = {
    projectLookup: Args.string({
      description: 'The project lookup to preview.',
    }),
    appLookup: Args.string({
      description: 'The application lookup to preview.',
    }),
  };

  static title = 'Preivew Project Application';

  protected async loadTasks(): Promise<ListrTask<PreivewContext>[]> {
    const { args } = await this.parse(Preview);

    const { appLookup, projectLookup } = args;

    return [
      ensureActiveEnterpriseTask(this.config.configDir) as ListrTask,
      loadEaCTask(this.config.configDir),
      ensureProjectTask(this.config.configDir, projectLookup),
      ensureApplicationTask(
        this.config.configDir,
        appLookup,
        false,
        false,
        true
      ),
      {
        title: `Open application preview`,
        task: async (ctx, task) => {
          const project = ctx.EaC.Projects![ctx.ProjectLookup];

          const host = project.PrimaryHost;

          const application = ctx.EaC.Applications![ctx.ApplicationLookup];

          const appRoot = application.LookupConfig!.PathRegex!.replace(
            '.*',
            ''
          );

          const previewUrl = `https://${host}${appRoot}`;

          open(previewUrl);

          task.output = previewUrl;
        },
        options: { persistentOutput: true },
      },
    ];
  }
}
