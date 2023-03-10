import express from 'express';
import oauth2 from 'simple-oauth2';
// import keytar from 'keytar';
import { ListrTask } from 'listr';
import { withConfig } from './config-helpers';

const tenant = 'fathymcloudprd';
const clientId = '800193b8-028a-44dd-ba05-73e82ee8066a';
const policy = 'b2c_1_sign_up_sign_in';
const redirectUri = 'http://localhost:8119/oauth';
const scope = `openid offline_access ${clientId}`;

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

export class UserAuthConfig {
  public AccessToken!: oauth2.AccessToken;
}

export async function withUserAuthConfig(
  configDir: string,
  action?: (config: UserAuthConfig) => Promise<UserAuthConfig>
): Promise<UserAuthConfig> {
  return withConfig<UserAuthConfig>('user-auth.config.json', configDir, action);
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

export async function refreshAccessTokenTask(
  configDir: string,
  refreshWindow = 300
): Promise<ListrTask> {
  const accessToken = await loadAccessToken(configDir);

  return {
    title: `Refreshing access token`,
    enabled: () => accessToken.expired(refreshWindow),
    task: async () => {
      await refreshAccessToken(configDir, accessToken);
    },
  };
}

export async function refreshAccessToken(
  configDir: string,
  accessToken: oauth2.AccessToken
): Promise<void> {
  accessToken = await accessToken.refresh({ scope: scope });

  await withUserAuthConfig(configDir, async (cfg) => {
    cfg.AccessToken = accessToken;

    return cfg;
  });
}

export async function loadAccessToken(
  configDir: string
): Promise<oauth2.AccessToken> {
  const config = await withUserAuthConfig(configDir);

  return oauthCodeClient.createToken(config.AccessToken);
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
