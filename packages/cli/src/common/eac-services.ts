// import express from 'express';
// import axios from 'axios';
import { ListrTask } from 'listr';
import loadAxios from './axios';

// export async function getAuthorizationUrl(): Promise<any> {
//   const response = await axios.post(`http://localhost:7119/api/GetAuthUrl`, {});

//   return response.data;
// }

// export async function getAccessToken(authCode: string): Promise<any> {
//   const response = await axios.post(
//     `http://localhost:7119/api/GetAccessToken`,
//     {},
//     {
//       headers: {
//         'lcu-auth-code': authCode,
//       },
//     }
//   );

//   return response.data;
// }

// export async function refreshAccessToken(refreshToken: string): Promise<any> {
//   const response = await axios.post(
//     `http://localhost:7119/api/RefreshAccessToken`,
//     {},
//     {
//       headers: {
//         'lcu-refresh-token': refreshToken,
//       },
//     }
//   );

//   return response.data;
// }

// export async function getAuthorizationCode(): Promise<string> {
//   return new Promise((resolve, reject) => {
//     // start an express server that listens for the authorization response
//     const app = express();
//     app.get('/oauth', (req, res) => {
//       // store the authorization code in the Listr context
//       const authorizationCode = req.query.code;

//       if (authorizationCode) {
//         // close the express server
//         res.send('Authorization successful! You can close this window now.');

//         // resolve the promise with the authorization code
//         resolve(authorizationCode as string);
//       } else {
//         reject(new Error(`Invalid authorization code`));

//         res.send('Authorization invalid! You can close this window now.');
//       }

//       server.close();
//     });
//     const server = app.listen(8119);
//   });
// }

export function createSendDataTask<TData>(
  title: string,
  completeTitle: string,
  path: string,
  data: TData
): ListrTask {
  return {
    title: title,
    task: async (ctx, task) => {
      const axios = await loadAxios();

      const response = await axios.post(path, data);

      ctx.response = response.data;

      // update the task title
      task.title = completeTitle;
    },
  };
}
