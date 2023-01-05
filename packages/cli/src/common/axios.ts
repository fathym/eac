import axios from 'axios';
import keytar from 'keytar';

export default async function loadAxios(): Promise<typeof axios> {
  const accessToken = await keytar.getPassword('fathym-cli', 'access_token');

  if (accessToken) {
    axios.defaults.headers['lcu-access-token'] = accessToken;
  } else {
    throw new Error(
      'Access token not available, use `fathym auth` to sign in.'
    );
  }

  return axios;
}
