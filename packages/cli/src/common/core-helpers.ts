import { color } from '@oclif/color';
import express from 'express';
import oauth2 from 'simple-oauth2';
// import keytar from 'keytar';
import { ListrTask, PromptOptions } from 'listr2';
import { withConfig } from './config-helpers';
import { ClosureInstruction } from './ClosureInstruction';
import path from 'node:path';
import { readFile, readJson } from 'fs-extra';
import loadAxios from './axios';
// import { EnterpriseAsCode } from '@semanticjs/common';

const tenant = 'fathymcloudprd';
const clientId = '800193b8-028a-44dd-ba05-73e82ee8066a';
const policy = 'b2c_1_sign_up_sign_in';
const redirectUri = 'http://localhost:8119/oauth';
const scope = `openid offline_access ${clientId}`;

export interface FathymTaskContext extends AccessTokenTaskContext {
  Fathym: {
    Instructions: ClosureInstruction[];

    Lookups: { name: string; lookups: string[] } | undefined;

    Result: string;
  };
}

export interface AccessTokenTaskContext {
  AccessToken?: oauth2.AccessToken;
}

export interface EaCTaskContext {
  EaC: any; // EaC: EnterpriseAsCode;
}

export interface ProjectTaskContext {
  ProjectLookup: string;
}

export interface ActiveEnterpriseTaskContext {
  ActiveEnterpriseLookup: string;
}

export class SystemConfig {
  public APIRoot!: string;
}

export class UserAuthConfig {
  public AccessToken?: oauth2.AccessToken;

  public ActiveEnterpriseLookup!: string;
}

const oauthCodeClient = new oauth2.AuthorizationCode({
  client: {
    id: clientId,
    secret: '',
  } as any,
  auth: {
    tokenHost: `https://auth.fathym.com`,
    tokenPath: `/${tenant}.onmicrosoft.com/${policy}/oauth2/v2.0/token`,
    authorizePath: `/${tenant}.onmicrosoft.com/${policy}/oauth2/v2.0/authorize`,
  },
});

export function ensureActiveEnterprise<
  TContext extends ActiveEnterpriseTaskContext
>(configDir: string, refreshWindow = 300): ListrTask<TContext> {
  return {
    title: `Ensuring active enterprise`,
    task: async (ctx, task) => {
      ctx.ActiveEnterpriseLookup = await loadActieEnterpriseLookup(configDir);

      if (ctx.ActiveEnterpriseLookup) {
        task.title = `Active enterprise is currently set to ${ctx.ActiveEnterpriseLookup}`;
      } else {
        throw new Error(
          `Active enterprise must be set with 'fathym enterprises set' command.`
        );
      }
    },
  };
}

export function ensureProject(
  project?: string
): ListrTask<ProjectTaskContext & EaCTaskContext> {
  return {
    title: `Ensuring project set`,
    task: async (ctx, task) => {
      if (!project) {
        const projects = Object.keys(ctx.EaC?.Projects || {}) || [];

        projects.push('');

        project = (
          await task.prompt({
            type: 'Select',
            // type: 'Input',
            name: 'project',
            message: 'Choose EaC Project:',
            choices: projects.map((proj) => {
              return {
                message: `${
                  ctx.EaC.Projects[proj]?.Project?.Name || '-Create new-'
                }`, //  (${color.blueBright(proj)})
                name: proj,
              };
            }),
          } as PromptOptions<true>)
        ).trim();
      }

      project = project === '-Create new-' ? '' : project;

      ctx.ProjectLookup = project || '';

      task.title = `Selected project is ${
        ctx.EaC.Projects[ctx.ProjectLookup]?.Project?.Name ||
        'Creating New Project'
      }`; //  (${ctx.ProjectLookup})
    },
  };
}

export async function getAccessToken(
  configDir: string,
  authCode: string
): Promise<void> {
  const tokenConfig = {
    redirect_uri: redirectUri,
    scope: scope,
    code: authCode,
  };

  const accessToken = await oauthCodeClient.getToken(tokenConfig);

  await withUserAuthConfig(configDir, async (cfg) => {
    cfg.AccessToken = accessToken;

    return cfg;
  });
}

export async function getAuthorizationCode(): Promise<string> {
  return new Promise((resolve, reject) => {
    // start an express server that listens for the authorization response
    const app = express();

    app.get('/oauth', (req, res) => {
      // store the authorization code in the Listr context
      const authorizationCode = req.query.code;

      if (authorizationCode) {
        // close the express server
        res.send('Authorization successful! You can close this window now.');

        // resolve the promise with the authorization code
        resolve(authorizationCode as string);
      } else {
        reject(new Error(`Invalid authorization code`));

        res.send('Authorization invalid! You can close this window now.');
      }

      server.close();
    });

    const server = app.listen(8119);
  });
}

export async function getAuthorizationUrl(state?: any): Promise<any> {
  const authorizationUri = oauthCodeClient.authorizeURL({
    redirect_uri: redirectUri,
    scope: scope,
    client_id: clientId,
    state: state,
  });

  return authorizationUri;
}

export async function loadAccessToken(
  configDir: string
): Promise<oauth2.AccessToken | undefined> {
  const config = await withUserAuthConfig(configDir);

  return config.AccessToken
    ? oauthCodeClient.createToken(config.AccessToken)
    : undefined;
}

export async function loadActieEnterpriseLookup(
  configDir: string
): Promise<string> {
  const { ActiveEnterpriseLookup } = await withUserAuthConfig(configDir);

  return ActiveEnterpriseLookup;
}

export async function loadApiRootUrl(configDir: string): Promise<string> {
  const config = await withSystemConfig(configDir);

  return config.APIRoot;
}

export async function loadEaC(
  configDir: string,
  entLookup: string
): Promise<any[]> {
  const axios = await loadAxios(configDir);

  const response = await axios.get(`${entLookup}/eac`);

  return response.data?.Model || [];
}

export function loadEaCTask<
  TContext extends EaCTaskContext & ActiveEnterpriseTaskContext
>(configDir: string): ListrTask<TContext> {
  return {
    title: `Load EaC for active enterprise`,
    task: async (ctx, task) => {
      ctx.EaC = await loadEaC(configDir, ctx.ActiveEnterpriseLookup);
    },
  };
}

export async function loadFileAsJson<T>(
  directory: string,
  filename: string
): Promise<T> {
  const filePath = path.join(directory, filename);

  const json = await readJson(filePath);

  return json as T;
}

export async function loadFileAsString(
  directory: string,
  filename: string
): Promise<string> {
  const filePath = path.join(directory, filename);

  const str = await readFile(filePath);

  return String(str);
}

export async function refreshAccessTokenTask<
  TContext extends AccessTokenTaskContext
>(configDir: string, refreshWindow = 300): Promise<ListrTask<TContext>> {
  return {
    title: `Refreshing access token`,
    task: async (ctx) => {
      ctx.AccessToken = await loadAccessToken(configDir);

      if (!ctx.AccessToken) {
        throw new Error(
          `Access token is required, use 'fathym auth' command to sign in.`
        );
      } else if (ctx.AccessToken.expired(refreshWindow)) {
        ctx.AccessToken = await refreshAccessToken(configDir, ctx.AccessToken);
      }
    },
  };
}

export async function refreshAccessToken(
  configDir: string,
  accessToken: oauth2.AccessToken
): Promise<oauth2.AccessToken> {
  accessToken = await accessToken.refresh({ scope: scope });

  await withUserAuthConfig(configDir, async (cfg) => {
    cfg.AccessToken = accessToken;

    return cfg;
  });

  return accessToken;
}

export async function setApiRoot(
  configDir: string,
  env: 'prod' | 'local'
): Promise<void> {
  await withSystemConfig(configDir, async (cfg) => {
    if (env === 'prod') {
      cfg.APIRoot = `https://fcp-cli-stateflow.azurewebsites.net/api`;
    } else if (env === 'local') {
      cfg.APIRoot = `http://127.0.0.1:7119/api`;
    }

    return cfg;
  });
}

export async function withSystemConfig(
  configDir: string,
  action?: (config: SystemConfig) => Promise<SystemConfig>
): Promise<SystemConfig> {
  return withConfig<SystemConfig>('lcu.system.json', configDir, async (cfg) => {
    if (!cfg.APIRoot) {
      cfg.APIRoot = `https://fcp-cli-stateflow.azurewebsites.net/api`;
    }

    if (action) {
      cfg = await action(cfg);
    }

    return cfg;
  });
}

export async function withUserAuthConfig(
  configDir: string,
  action?: (config: UserAuthConfig) => Promise<UserAuthConfig>
): Promise<UserAuthConfig> {
  return withConfig<UserAuthConfig>('user-auth.config.json', configDir, action);
}
