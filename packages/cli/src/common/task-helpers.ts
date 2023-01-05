import { exec } from 'node:child_process';

export async function execa(command: string, args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const cmd = [command, ...args].join(' ');

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}
