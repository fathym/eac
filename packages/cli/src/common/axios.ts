import axios from 'axios';
import { withUserAuthConfig } from './auth-helpers';

export default async function loadAxios(
  configDir: string
): Promise<typeof axios> {
  const config = await withUserAuthConfig(configDir);

  const accessToken = config.AccessToken.token.toString();

  if (accessToken) {
    axios.defaults.headers['lcu-access-token'] = accessToken;
  } else {
    throw new Error(
      'Access token not available, use `fathym auth` to sign in.'
    );
  }

  return axios;
}
