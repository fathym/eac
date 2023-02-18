import { Args, Flags } from '@oclif/core';
import { ListrTask } from 'listr2';
import {} from '@semanticjs/common';
import { FathymCommand } from '../../../common/fathym-command';
import { ClosureInstruction } from '../../../common/ClosureInstruction';
import {
  ActiveEnterpriseTaskContext,
  ApplicationTaskContext,
  EaCTaskContext,
  ensureActiveEnterprise,
  ensureApplication,
  FathymTaskContext,
  loadEaCTask,
  ProjectTaskContext,
} from '../../../common/core-helpers';
import { ensurePromptValue, withEaCDraft } from '../../../common/eac-services';

interface UnpackTaskContext
  extends FathymTaskContext,
    ActiveEnterpriseTaskContext,
    EaCTaskContext,
    ProjectTaskContext,
    ApplicationTaskContext {}

export default class Unpack extends FathymCommand<UnpackTaskContext> {
  static description = `Used for queuing an application unpack for existing configuration in the EaC.`;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {};

  static args = {
    appLookup: Args.string({
      description: 'The application lookup.',
    }),
  };

  static title = 'Unpack Application LCU';

  protected async loadTasks(): Promise<ListrTask<UnpackTaskContext>[]> {
    const { args } = await this.parse(Unpack);

    const { appLookup } = args;

    return [
      ensureActiveEnterprise(this.config.configDir),
      loadEaCTask(this.config.configDir),
      ensureApplication(this.config.configDir, appLookup, false, true),
      this.ensureApplicationUnpack(),
    ];
  }

  protected ensureApplicationUnpack(): ListrTask<UnpackTaskContext> {
    return {
      title: 'Create Unpack Application Draft',
      task: async (ctx, task) => {
        await withEaCDraft(
          this.config.configDir,
          ctx.ActiveEnterpriseLookup,
          async (draft) => {
            return draft;
          },
          [['Applications', ctx.ApplicationLookup]]
        );
      },
    };
  }
}
