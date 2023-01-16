import { Command, Flags } from '@oclif/core';

export default class Install extends Command {
  static aliases = ['lcu install', 'lcu', 'install', 'i'];

  static description =
    'Used to install, or walk a user through installing an LCU.';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    force: Flags.boolean({ char: 'f' }),
  };

  static args = [{ name: 'template', required: true }];

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Install);

    const { template } = args;

    this.log(
      `hello ${template} from C:\\fathym\\os\\fathym\\eac\\packages\\cli\\src\\commands\\lcu\\index.ts`
    );

    if (flags.force) {
      this.log(`you input --force`);
    }
  }
}
