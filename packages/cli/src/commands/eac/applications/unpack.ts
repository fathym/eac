import { Args } from '@oclif/core';
import { ListrTask } from 'listr2';
import { EaCApplicationAsCode } from '@semanticjs/common';
import { FathymCommand } from '../../../common/fathym-command';
import {
  ActiveEnterpriseTaskContext,
  ApplicationTaskContext,
  EaCTaskContext,
  ensureActiveEnterpriseTask,
  ensureApplicationTask,
  loadEaCTask,
  ProjectTaskContext,
  withEaCDraftEditTask,
} from '../../../common/eac-services';
import { FathymTaskContext } from '../../../common/core-helpers';

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
      ensureActiveEnterpriseTask(this.config.configDir),
      loadEaCTask(this.config.configDir),
      ensureApplicationTask(this.config.configDir, appLookup, false, true),
      this.ensureApplicationUnpack(),
    ];
  }

  protected ensureApplicationUnpack(
    name?: string,
    description?: string
  ): ListrTask<UnpackTaskContext> {
    return withEaCDraftEditTask<UnpackTaskContext, EaCApplicationAsCode>(
      'Unpack Application Draft',
      this.config.configDir,
      (ctx) => [['Applications', ctx.ApplicationLookup]]
      // {
      //   draftPatch: (ctx) => {
      //     const patch = {};

      //     return patch;
      //   },
      // }
    );
  }
}
