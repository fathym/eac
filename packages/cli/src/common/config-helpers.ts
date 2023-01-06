import path from 'node:path';
import { createFile, pathExists, readJSON, writeJSON } from 'fs-extra';

export async function withConfig<TConfig>(
  file: string,
  configDir: string,
  action?: (config: TConfig) => Promise<TConfig>
): Promise<TConfig> {
  if (!action) {
    action = async (cfg) => cfg || ({} as TConfig);
  }

  const configFile = path.join(configDir, file);

  if (!(await pathExists(configFile))) {
    await createFile(configFile);

    await writeJSON(configFile, {});
  }

  const userConfig: TConfig = (await readJSON(configFile)) || {};

  const newUserConfig = await action(userConfig);

  if (newUserConfig) {
    await writeJSON(configFile, newUserConfig);
  }

  return newUserConfig || userConfig;
}
