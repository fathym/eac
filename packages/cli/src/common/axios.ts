import axios from 'axios';
import { withUserAuthConfig } from './config-helpers';
import { loadApiRootUrl } from './core-helpers';

export default async function loadAxios(
  configDir: string
): Promise<typeof axios> {
  const config = await withUserAuthConfig(configDir);

  const accessToken = (config.AccessToken as any).access_token;

  axios.defaults.baseURL = await loadApiRootUrl(configDir);

  //  TODO: Handle bad stati and failed requests universally

  if (accessToken) {
    axios.defaults.headers.Authorization = `Bearer ${accessToken}`;
  } else {
    throw new Error(
      'Access token not available, use `fathym auth` to sign in.'
    );
  }

  return axios;
}
