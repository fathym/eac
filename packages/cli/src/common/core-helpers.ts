import { color } from '@oclif/color';
import express from 'express';
import oauth2 from 'simple-oauth2';
import { ListrRendererFactory, ListrTask, ListrTaskWrapper } from 'listr2';
import { ClosureInstruction } from './ClosureInstruction';
import path from 'node:path';
import { readFile, existsSync, readJson, readdir } from 'fs-extra';
import { runProc } from './task-helpers';
import { downloadFile, ensureLicense} from './eac-services';
import { withSystemConfig, withUserAuthConfig } from './config-helpers';
import { Draft } from 'immer';

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

export interface AzureCLITaskContext {
  AzureCLIInstalled: boolean;
}

export interface AzureSubscription {
  appId?: string;

  authKey?: string;

  id: string;

  name: string;

  subscriptionId?: string;

  tenantId: string;
}

export interface DeployStatus {
  [key: string]: string;
}

export interface LCUParamAnswersTaskContext {
  LCUParamAnswers: ParamAnswers;
}

export interface ParamAnswers {
  [key: string]: string;
}

export interface SubscriptionTaskContext {
  SubscriptionID?: string;

  SubscriptionName: string;

  TenantID: string;

  ApplicationID?: string;

  AuthKey?: string;
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

export function azureCliInstallTask<
  TContext extends AzureCLITaskContext
>(): ListrTask<TContext> {
  return {
    title: `Azure CLI install check`,
    task: async (ctx, task) => {
      try {
        await runProc('az', []);

        ctx.AzureCLIInstalled = true;
      } catch {
        task.title = 'Azure CLI installing';

        task.output = 'Downloading the Azure CLI installer';

        await downloadFile(
          'https://aka.ms/installazurecliwindows',
          'azure-cli.msi'
        );

        task.output =
          'Laucnhing the Azure CLI installer; installing in the background.';

        // TODO: Cross platform support for msiexec

        await runProc('msiexec', ['/q', '/i', 'azure-cli.msi']);

        await runProc('refreshenv', []);

        ctx.AzureCLIInstalled = true;
      }

      task.title = 'Azure CLI installed';
    },
  };
}

export function ensureAzureCliLogin<
  TContext extends AzureCLITaskContext
>(configDir: string, user: boolean): ListrTask<TContext> {
  return {
    title: 'Azure CLI login check',
    skip: (ctx) => !ctx.AzureCLIInstalled,
    task: async (ctx, task) => {
      // const licenses = await ensureLicense(configDir, "fathym");
      //   if (licenses.length === 0){
      //     throw new Error(
      //       "You currently don't have an active license. Please visit https://fathym.com/dashboard/billing to purchase a license"
      //       );       
      //   }
        // else{
          try {
            await runProc('az', ['account', 'show']);
          } catch {
            if(user){
              task.title = 'Azure CLI logging in';
    
              task.output = color.yellow(
                'Opening a login form in your browser, complete sign in there, and return.'
              );
      
              await runProc('az', ['login']);
            }
          }   
          task.title = 'Azure CLI logged in';
        // }
    },
  };
}

export function ensureAzureCliSetupTask<
  TContext extends AzureCLITaskContext
>(configDir: string, user: boolean): ListrTask<TContext> {
  return {
    title: `Azure CLI Setup`,
    task: (ctx, task) => {
      return task.newListr((parent) => [
        azureCliInstallTask(),
        ensureAzureCliLogin(configDir, user),
      ]);
    },
  };
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function ensurePromptValue<
  Ctx,
  Renderer extends ListrRendererFactory
>(
  task: ListrTaskWrapper<Ctx, Renderer>,
  message: string,
  value?: string,
  choices?:
    | string[]
    | { name: string | (() => string); message?: string | (() => string) }[],
  createValue?: () => Promise<string>,
  createText = '- Create new -',
  type?: string
): Promise<string | string[]> {
  if (!value) {
    if (createValue && choices) {
      if (typeof choices[0] === 'string') {
        choices.unshift(createText as any);
      } else {
        choices.unshift({
          message: createText,
          name: createText,
        } as any);
      }
    }

    value = await task.prompt({
      type: type || (choices?.length! > 0 ? 'autocomplete' : 'input'),
      message: message,
      validate: (v) => !!createValue || Boolean(v),
      choices: choices,
    });

    value = value === createText ? '' : value;
  }

  if (!value && createValue) {
    value = await createValue();
  }

  return value || '';
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

export async function loadChildDirectories(
  directory: string,
  checkPath: string
): Promise<string[]> {
  const dirPath = path.join(directory, checkPath);

  const entries = await readdir(dirPath, { withFileTypes: true });

  const dirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);

  return dirs;
}

export async function loadFileAsJson<T>(
  directory: string,
  filename: string
): Promise<T> {
  const filePath = path.join(directory, filename);

  const json = existsSync(filePath) ? await readJson(filePath) : {};

  return json as T;
}

export async function loadFileAsString(
  directory: string,
  filename: string
): Promise<string> {
  const filePath = path.join(directory, filename);

  const str = existsSync(filePath) ? await readFile(filePath) : '';

  return String(str);
}

export function merge<T>(patch: T, draft: T): void {
  if (Array.isArray(patch) && Array.isArray(draft)) {
    draft.push(...(patch as any));
    return;
  }

  for (const key in patch) {
    const patchValue = patch[key];
    const draftValue = draft[key];

    if (typeof patchValue === 'object' && typeof draftValue === 'object') {
      merge(patchValue as T, draftValue as T);
    } else {
      draft[key] = patchValue;
    }
  }
}

export async function processAsyncArray<T>(
  vals: T[],
  process: (val: T) => Promise<void>
): Promise<void> {
  const val: T = vals?.shift()!;

  if (val) {
    await process(val);

    if (vals?.length > 0) {
      await processAsyncArray(vals, process);
    }
  }
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
  });

  return accessToken;
}

export function removeUndefined<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj
      .map((value) => removeUndefined(value))
      .filter((value) => value !== undefined) as any as T;
  }

  const result = {} as any as T;

  for (const key in obj) {
    const value = obj[key];
    const newValue = removeUndefined(value);

    if (newValue !== undefined) {
      result[key] = newValue;
    }
  }

  return result as T;
}

export async function setApiRoot(
  configDir: string,
  env: string
): Promise<void> {
  await withSystemConfig(configDir, async (cfg) => {
    if (env === 'prod') {
      cfg.APIRoot = `https://fcp-cli-stateflow.azurewebsites.net/api`;
    } else if (env === 'local') {
      cfg.APIRoot = `http://127.0.0.1:7119/api`;
    }
  });
}
