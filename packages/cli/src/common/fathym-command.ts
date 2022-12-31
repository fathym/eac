import { Command, Flags } from '@oclif/core';
import { color } from '@oclif/color';
// import { indent } from '@semanticjs/common';

export class ClosureInstruction {
  public Description?: string;

  public Instruction!: string;
}

function CreateSpaces(spaces: number) {
  let spacing = '';

  // Add num spaces to the string
  for (let i = 0; i < spaces; i++) {
    spacing += ' ';
  }

  return spacing;
}

function indent(value: string, spaces = 2): string {
  const lines = value.split('\n');

  const spacing = CreateSpaces(spaces);

  const indentedLines = lines.map((line) => `${spacing}${line}`);

  const indentedStr = indentedLines.join('\n');

  return indentedStr;
}

export abstract class FathymCommand extends Command {
  static globalFlags = {
    interactive: Flags.boolean({
      char: 'i',
      description:
        'Run command in interactive mode, allowing prompts for missing required args and flags.',
    }),
  };

  //#region Helpers
  protected closure(title: string, instructions?: ClosureInstruction[]): void {
    this.log();

    this.log(color.blue(title));

    this.log();

    instructions?.forEach((instruction) => {
      let instruct = color.green(instruction.Instruction);

      if (instruction.Description) {
        instruct = `${instruct} ${instruction.Description}`;
      }

      this.log(indent(instruct, 2));
    });

    if ((instructions?.length || 0) > 0) {
      this.log();
    }
  }

  protected title(title: string): void {
    this.log(color.bold(color.blue(title)));

    this.log();
  }
  //#endregion
}
