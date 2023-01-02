import { Command, Flags } from '@oclif/core';
import { color } from '@oclif/color';
import Listr from 'listr';
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

  public async run(): Promise<void> {
    await this.runCommandCycle();
  }

  //#region Command Cycle
  protected async runCommandCycle(): Promise<void> {
    const CurCmd = <typeof FathymCommand>this.constructor;

    this.title(`Executing ${CurCmd.title}`);

    const tasks = await this.loadTasks();

    tasks
      ?.run()
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

  protected abstract loadTasks(): Promise<Listr>;

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
