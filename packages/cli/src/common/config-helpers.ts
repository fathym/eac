import path from 'node:path';
import { createFile, pathExists, readJSON, writeJSON } from 'fs-extra';
import produce, { Draft, createDraft } from 'immer';
import oauth2 from 'simple-oauth2';

export class SystemConfig {
  public APIRoot!: string;
}

export class UserAuthConfig {
  public AccessToken?: oauth2.AccessToken;

  public ActiveEnterpriseLookup!: string;
}

export async function withConfig<TConfig>(
  file: string,
  configDir: string,
  action?: (config: Draft<TConfig>) => Promise<void>
): Promise<TConfig> {
  if (!action) {
    action = async (cfg) => {
      cfg || ({} as TConfig);
    };
  }

  const configFile = path.join(configDir, file);

  if (!(await pathExists(configFile))) {
    await createFile(configFile);

    await writeJSON(configFile, {});
  }

  let userConfig: TConfig = (await readJSON(configFile)) || {};

  userConfig = await produce(userConfig, async (cfg) => {
    await action?.(cfg);
  });

  if (userConfig) {
    await writeJSON(configFile, userConfig);
  }

  return userConfig || ({} as TConfig);
}

export async function withSystemConfig(
  configDir: string,
  action?: (config: Draft<SystemConfig>) => Promise<void>
): Promise<SystemConfig> {
  return withConfig<SystemConfig>('lcu.system.json', configDir, async (cfg) => {
    if (!cfg.APIRoot) {
      cfg.APIRoot = `https://fcp-cli-stateflow.azurewebsites.net/api`;
    }

    await action?.(cfg);
  });
}

export async function withUserAuthConfig(
  configDir: string,
  action?: (config: Draft<UserAuthConfig>) => Promise<void>
): Promise<UserAuthConfig> {
  return withConfig<UserAuthConfig>(
    'user-auth.config.json',
    configDir,
    async (cfg) => {
      await action?.(cfg);
    }
  );
}
