import { Command, Flags } from '@oclif/core';
import { color } from '@oclif/color';
import Listr from 'listr';
import { AuthorizationCode, ModuleOptions } from 'simple-oauth2';
// import { indent } from '@semanticjs/common';

export class ClosureInstruction {
  public Description?: string;

  public Instruction!: string;
}

export class DisplayLookup {
  public Lookup!: string;

  public Name!: string;
}

export abstract class FathymCommand extends Command {
  static globalFlags = {
    interactive: Flags.boolean({
      char: 'i',
      description:
        'Run command in interactive mode, allowing prompts for missing required args and flags.',
    }),
  };

  static title: string;

  static useAuth = true;

  static forceRefresh = true;

  static authPort = 8119;

  public async run(): Promise<void> {
    await this.runCommandCycle();
  }

  //#region Command Cycle
  protected async runCommandCycle(): Promise<void> {
    const CurCmd = <typeof FathymCommand>this.constructor;

    this.title(`Executing ${CurCmd.title}`);

    let tasks = await this.loadTasks();

    if (CurCmd.useAuth || CurCmd.forceRefresh) {
      tasks = [
        {
          title: 'Loading Fathym auth client',
          task: (ctx, task) => {
            return new Promise((resolve) => {
              const clientId = '800193b8-028a-44dd-ba05-73e82ee8066a'; //prod
              // const clientId = '4ad51adf-6bad-4e5a-b885-c14d34a4c147'; //int

              ctx.authClient = new AuthorizationCode({
                client: {
                  id: clientId,
                  secret: '',
                },
                auth: {
                  tokenHost: `https://auth.fathym.com`,
                  tokenPath:
                    '/fathymcloudprd.onmicrosoft.com/oauth2/v2.0/token',
                  authorizePath:
                    '/fathymcloudprd.onmicrosoft.com/oauth2/v2.0/authorize',
                },
              });

              task.title = 'Fathym auth client loaded successfully';

              resolve(true);
            });
          },
        },
        ...tasks,
      ];
    }

    if (CurCmd.forceRefresh) {
      tasks = [
        {
          title: 'Refreshing access token',
          task: (ctx, task) => {
            return new Promise((resolve) => {
              const authClient = ctx.authClient as AuthorizationCode;

              authClient.authorizeURL({
                redirect_uri: `http://localhost:${CurCmd.authPort}/oauth`,
                scope: 'openid offline_access',
                // response_mode: 'form_post',
                // response_type: 'code id_token',
                // nonce: 'nonce',
                state: 'state',
                // prompt: 'login',
              });

              setTimeout(() => {
                task.title = 'User access token refreshed';

                resolve(true);
              }, 3000);
            });
          },
        },
        ...tasks,
      ];
    }

    const listr = new Listr(tasks);

    listr
      .run()
      .then(async () => {
        const lookups = await this.loadLookups();

        const instructions = await this.loadInstructions();

        const result = await this.loadResult();

        if (lookups) {
          this.lookups(lookups.name, lookups.lookups);
        }

        if (result) {
          this.result(result);
        }

        this.closure(`${CurCmd.title} Executed`, instructions);

        this.log('\n\n');
      })
      .catch((error) => {
        this.debug(error);
      });
  }
  //#endregion

  //#region Helpers
  protected closure(title: string, instructions?: ClosureInstruction[]): void {
    this.log();

    this.log(color.blue(title));

    // this.log();

    instructions?.forEach((instruction) => {
      let instruct = color.green(instruction.Instruction);

      if (instruction.Description) {
        instruct = `${instruct}\n${this.indent(instruction.Description)}`;
      }

      this.log(this.indent(instruct, 2));
      this.log();
    });

    if ((instructions?.length || 0) > 0) {
      this.log();
    }
  }

  protected createSpaces(spaces: number): string {
    let spacing = '';

    // Add num spaces to the string
    for (let i = 0; i < spaces; i++) {
      spacing += ' ';
    }

    return spacing;
  }

  protected indent(value: string, spaces = 2): string {
    const lines = value.split('\n');

    const spacing = this.createSpaces(spaces);

    const indentedLines = lines.map((line) => `${spacing}${line}`);

    const indentedStr = indentedLines.join('\n');

    return indentedStr;
  }

  protected async loadInstructions(): Promise<ClosureInstruction[]> {
    return [];
  }

  protected async loadLookups(): Promise<
    { name: string; lookups: DisplayLookup[] } | undefined
  > {
    return undefined;
  }

  protected async loadResult(): Promise<string | undefined> {
    return undefined;
  }

  protected abstract loadTasks(): Promise<Listr.ListrTask<any>[]>;

  protected lookups(name: string, lookups: DisplayLookup[]): void {
    this.log();

    this.log(this.indent(`{Name} ({${color.blueBright(name)}})`));

    lookups.forEach((ent) => {
      this.log(this.indent(`${ent.Name} (${color.blueBright(ent.Lookup)})`));
    });
  }

  protected result(result: string): void {
    this.log();

    this.log(this.indent(result));
  }

  protected title(title: string): void {
    this.log(color.bold(color.blue(title)));

    this.log();
  }
  //#endregion
}
