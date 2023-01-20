import { exec } from 'node:child_process';
import { PassThrough } from 'node:stream';

export async function runProc(
  command: string,
  args: string[],
  log: boolean = false
): Promise<string> {
  return new Promise((resolve, reject) => {
    const cmd = [command, ...args].join(' ');
    if (log) resolve(cmd);
    else
      exec(cmd, (error, stdout) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
  });
}

export function readStreamAsJson<T>(stream: PassThrough): Promise<T> {
  const chunks: any[] = [];

  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => {
      const str = Buffer.concat(chunks).toString('utf8');

      return resolve(JSON.parse(str) as T);
    });
  });
}
