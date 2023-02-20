import { Args, Flags } from '@oclif/core';
import { color } from '@oclif/color';
import { ListrTask, PromptOptions } from 'listr2';

import { FathymTaskContext } from '../../common/core-helpers';
import { FathymCommand } from '../../common/fathym-command';
import { downloadFile } from '../../common/eac-services';

export default class Download extends FathymCommand<FathymTaskContext> {
  static description = `Used for downloading a file.`;

  static examples = ['<%= config.bin %> <%= command.id %> {url} {outputFile}'];

  static flags = {};

  static args = {
    url: Args.string({
      description: 'The URL of the artifact to download.',
      required: true,
    }),
    outputFile: Args.string({
      description: 'The output file location of the download.',
      required: true,
    }),
  };

  static title = 'Download File';

  protected async loadTasks(): Promise<ListrTask<FathymTaskContext>[]> {
    const { args } = await this.parse(Download);

    const { outputFile, url } = args;

    return [
      {
        title: `Download file`,
        task: async (ctx, task) => {
          task.output = `Downloading ${url} to ${outputFile}`;

          await downloadFile(url, outputFile);
        },
      },
    ];
  }
}
