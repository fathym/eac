import express from 'express';

export async function getAuthorizationUrl(): Promise<any> {
  const response = await fetch('http://localhost:7119/api/GetAuthorizationUrl');

  return response.json();
}

export async function getAccessToken(code: string): Promise<any> {
  const response = await fetch(
    `http://localhost:7119/api/GetAccessToken?code=${code}`
  );

  return response.json();
}

export async function getAuthorizationCode(): Promise<string> {
  return new Promise((resolve, reject) => {
    // start an express server that listens for the authorization response
    const app = express();
    app.get('/callback', (req, res) => {
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
