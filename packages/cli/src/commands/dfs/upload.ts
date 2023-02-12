import { Args, Flags } from '@oclif/core';
import { color } from '@oclif/color';
import { ListrTask, PromptOptions } from 'listr2';
import {} from '@semanticjs/common';
import {
  ActiveEnterpriseTaskContext,
  ApplicationTaskContext,
  EaCTaskContext,
  ensureActiveEnterprise,
  ensureApplication,
  ensureProject,
  FathymTaskContext,
  loadEaCTask,
  ProjectTaskContext,
} from '../../common/core-helpers';
import { FathymCommand } from '../../common/fathym-command';
import {
  downloadFile,
  ensurePromptValue,
  uploadFile,
} from '../../common/eac-services';
import { url } from '@oclif/core/lib/flags';
import { outputFile } from 'fs-extra';

interface UploadTaskContext
  extends FathymTaskContext,
    ActiveEnterpriseTaskContext,
    EaCTaskContext,
    ProjectTaskContext,
    ApplicationTaskContext {}

export default class Upload extends FathymCommand<UploadTaskContext> {
  static description = `Used for downloading a file.`;

  static examples = ['<%= config.bin %> <%= command.id %> {url} {outputFile}'];

  static flags = {
    appLookup: Flags.string({
      char: 'a',
      description: 'The applookup to upload to.',
    }),
    findApp: Flags.boolean({
      char: 'f',
      description:
        'Whether or not to prompt for an application when no app lookup provided.',
    }),
    projectFilter: Flags.string({
      char: 'p',
      description: 'The project lookup to filter applications by.',
    }),
  };

  static args = {
    file: Args.string({
      description: 'Path to upload file',
    }),
    filePath: Args.string({
      description: 'The path within the DFS to upload the file.',
    }),
  };

  static title = 'Upload to DFS';

  protected async loadTasks(): Promise<ListrTask<UploadTaskContext>[]> {
    const { args, flags } = await this.parse(Upload);

    let { file, filePath } = args;

    const { appLookup, findApp, projectFilter } = flags;

    const tasks: ListrTask<UploadTaskContext>[] = [
      ensureActiveEnterprise(this.config.configDir),
      loadEaCTask(this.config.configDir),
    ];

    // if (projectFilter) {
    //   tasks.push(
    //     ensureProject(this.config.configDir, projectFilter, false, true)
    //   );
    // }

    tasks.push(
      findApp
        ? ensureApplication(
            this.config.configDir,
            appLookup,
            false,
            false,
            projectFilter
          )
        : {
            title: 'Setting Application Lookup',
            task: async (ctx, task) => {
              ctx.ApplicationLookup = appLookup || '';
            },
          }
    );

    tasks.push({
      title: `Upload DFS file`,
      task: async (ctx, task) => {
        file = await ensurePromptValue(
          task,
          Upload.args.file.description!,
          file
        );

        filePath = await ensurePromptValue(
          task,
          Upload.args.filePath.description!,
          filePath
        );

        await uploadFile(file, ctx.ActiveEnterpriseLookup, filePath);
      },
    });

    return tasks;
  }
}
