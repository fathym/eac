import { Command, Flags } from '@oclif/core';

export default class Auth extends Command {
  static description =
    'Used to start the authentication process with Fathym, so your application can work with the EaC and other features.';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    name: Flags.string({ char: 'n', description: 'name to print' }),
    force: Flags.boolean({ char: 'f' }),
  };

  static args = [{ name: 'file' }];

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Auth);

    const name = flags.name ?? 'world';

    this.log(
      `hello ${name} from C:\\Users\\micha_8ygdgy8\\Fathym\\Open Source\\fathym\\eac\\packages\\cli\\src\\commands\\auth.ts`
    );

    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`);
    }
  }
}
