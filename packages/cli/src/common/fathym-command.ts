import { Command, Flags } from '@oclif/core';
import { color } from '@oclif/color';
import { Listr, ListrTask } from 'listr2';
import {
  AccessTokenTaskContext,
  FathymTaskContext,
  refreshAccessTokenTask,
} from './core-helpers';
import { ClosureInstruction } from './ClosureInstruction';
import path from 'node:path';
import { readFile, readJson } from 'fs-extra';

export abstract class FathymCommand<
  TContext extends FathymTaskContext
> extends Command {
  static globalFlags = {
    ci: Flags.boolean({
      description:
        'Run command in yield mode for automation, to prevent prompts.',
    }),
  };

  static enableJsonFlag = true;

  static title: string;

  static forceRefresh = true;

  static authPort = 8119;

  public async run(): Promise<any> {
    const result = await this.runCommandCycle();

    return result;
  }

  //#region Command Cycle
  protected async runCommandCycle(): Promise<any> {
    const CurCmd = <typeof FathymCommand>this.constructor;

    this.title(`Executing ${CurCmd.title}`);

    let tasks = await this.loadTasks();

    if (CurCmd.forceRefresh) {
      tasks = [
        await refreshAccessTokenTask<TContext>(this.config.configDir),
        ...tasks,
      ];
    }

    tasks = tasks?.filter((t) => Boolean(t)) || [];

    const listr = new Listr<TContext>(tasks);

    let ctx: TContext = {
      Fathym: {},
    } as TContext;

    try {
      ctx = await listr.run(ctx);

      if (ctx?.Fathym?.Lookups) {
        this.lookups(ctx?.Fathym?.Lookups.name, ctx?.Fathym?.Lookups.lookups);
      }

      if (ctx?.Fathym?.Result) {
        this.result(ctx?.Fathym?.Result);
      }

      this.closure(`${CurCmd.title} Executed`, ctx?.Fathym?.Instructions);
    } catch (error: any) {
      this.closure(`${CurCmd.title} Executed`, ctx?.Fathym?.Instructions);

      this.error(error);
    }
  }
  //#endregion

  //#region Helpers
  protected closure(title: string, instructions?: ClosureInstruction[]): void {
    this.log();

    this.log(color.blue(title));

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

  protected abstract loadTasks(): Promise<ListrTask<TContext>[]>;

  protected lookups(name: string, displays: string[]): void {
    this.log();

    this.log(this.indent(color.underline(`${name}`)));

    displays.forEach((display) => {
      this.log(this.indent(display));
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
