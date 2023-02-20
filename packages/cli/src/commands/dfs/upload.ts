import { Args, Flags } from '@oclif/core';
import { ListrTask } from 'listr2';
import { FathymCommand } from '../../common/fathym-command';
import {
  ActiveEnterpriseTaskContext,
  ApplicationTaskContext,
  EaCTaskContext,
  ensureActiveEnterpriseTask,
  ensureApplicationTask,
  ensureProjectTask,
  loadEaCTask,
  ProjectTaskContext,
  uploadFile,
} from '../../common/eac-services';
import {
  FathymTaskContext,
  ensurePromptValue,
} from '../../common/core-helpers';

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
    projectFilter: Flags.boolean({
      char: 'p',
      description: 'Whether to filter filter applications by project lookup.',
    }),
  };

  static args = {
    file: Args.string({
      description: 'Path to upload file',
    }),
    filePath: Args.string({
      description: 'The path within the DFS to upload the file to.',
    }),
  };

  static title = 'Upload to DFS';

  protected async loadTasks(): Promise<ListrTask<UploadTaskContext>[]> {
    const { args, flags } = await this.parse(Upload);

    let { file, filePath } = args;

    const { appLookup, findApp, projectFilter } = flags;

    const tasks: ListrTask<UploadTaskContext>[] = [
      ensureActiveEnterpriseTask(this.config.configDir),
      loadEaCTask(this.config.configDir),
    ];

    if (projectFilter) {
      tasks.push(ensureProjectTask(this.config.configDir, '', false, true));
    }

    tasks.push(
      findApp
        ? ensureApplicationTask(
            this.config.configDir,
            appLookup,
            false,
            true,
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
