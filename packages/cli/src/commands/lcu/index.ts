import { Command, Flags } from '@oclif/core';
import { ListrTask } from 'listr';
import { ClosureInstruction, FathymCommand } from '../../common/fathym-command';

export default class Install extends FathymCommand {
  static aliases = ['install', 'i']; // How to get all variations working 'lcu install', 'lcu i',

  static description =
    'Used to install, or walk a user through installing an LCU.';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    // lcu: Flags.string({
    //   char: 't',
    //   description: 'Specifies the template to be used for installing the lcu',
    // }),
  };

  static args = [{ name: 'lcu', required: true }];

  protected async loadInstructions(): Promise<ClosureInstruction[]> {
    return [];
  }

  protected async loadTasks(): Promise<ListrTask[]> {
    const { args, flags } = await this.parse(Install);

    const { lcu } = args;

    return [this.task()];
  }

  public task(): ListrTask {
    return {
      title: 'Fetch changes',
      task: async (ctx, task) => {
        task.title = `hello from C:\\fathym\\os\\fathym\\eac\\packages\\cli\\src\\commands\\lcu\\index.ts`;
      },
    };
  }
}
