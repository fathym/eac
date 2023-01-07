import inquirer from 'inquirer';
import Listr, { ListrTask } from 'listr';
import { execa } from './task-helpers';
// import inquirer from 'inquirer';

export function confirmGitRepo(): ListrTask {
  return {
    title: 'Check valid Git repository',
    task: async () => {
      try {
        await execa('git', ['rev-parse', '--is-inside-git-dir']);
        // await execa('git', ['rev-parse', '--git-dir']);
        // await execa('git', ['rev-parse', '--is-inside-work-tree']);
      } catch {
        throw new Error('Not a Git repository');
      }
    },
  };
}

export function ensureOrganization(organization: string): ListrTask {
  return {
    title: `Ensuring organization`,
    task: async (ctx, task) => {
      if (!organization) {
        const user = (await execa('git', ['config', '--get user.name']))
          .toString()
          .trim();

        ctx.organization = user;
      }

      task.title = `Set organization to ${ctx.organization}`;
    },
  };
}

export function commitChanges(commitMessage?: string): ListrTask {
  return {
    title: 'Committing uncommitted changes',
    skip: () => hasCommittedChanges(),
    task: async () => {
      if (!commitMessage) {
        const { message } = await inquirer.prompt({
          type: 'input',
          name: 'message',
          message: 'Enter commit message:',
        });

        commitMessage = message;
      }

      return new Listr([
        {
          title: 'Stage changes',
          task: async () => {
            await execa('git', ['add', '.']);
          },
        },
        {
          title: 'Commit changes',
          task: async () => {
            await execa('git', ['commit', '-m', commitMessage!]);
          },
        },
      ]);
    },
  };
}

export async function hasCommittedChanges(): Promise<boolean> {
  const stdout = await execa('git', ['status', '--porcelain']);

  return stdout === '';
}

// export const pullLatestIntegration: ListrTask = {
//   title: 'Pull latest integration changes',
//   task: async (ctx, task) => {
//     await execa('git', ['checkout', 'integration']);
//     await execa('git', ['pull', 'origin', 'integration']);
//   },
// };

// export const addChanges: ListrTask = {
//   title: 'Add changes',
//   task: async (ctx, task) => {
//     await execa('git', ['add', '.']);
//   },
// };

// export const rebaseIntegration: ListrTask = {
//   title: 'Rebase changes onto integration',
//   task: async (ctx, task) => {
//     await execa('git', ['rebase', 'integration']);
//   },
// };

// const confirmUncommittedChanges = (): ListrTask => {
//   return {
//     title: 'Confirming uncommitted changes',
//     task: (ctx, task) => {
//       return new Promise((resolve, reject) => {
//         exec(`git diff-index --quiet HEAD --`, (err, stdout) => {
//           if (err) {
//             ctx.hasUncommittedChanges = true;
//             task.title = 'Uncommitted changes detected';
//             resolve();
//           } else {
//             ctx.hasUncommittedChanges = false;
//             task.title = 'No uncommitted changes detected';
//             resolve();
//           }
//         });
//       });
//     },
//   };
// };

// export async function syncIntegration() {
//   const tasks = new Listr([
//     {
//       title: 'Sync integration branch',
//       task: async () => {
//         await execa('git', ['checkout', 'integration']);
//         await execa('git', ['pull']);
//       },
//     },
//   ]);

//   await tasks.run();
// }

// export async function createFeatureBranch(name: string) {
//   const tasks = new Listr([
//     {
//       title: 'Confirm git repository',
//       task: confirmGitRepo,
//     },
//     {
//       title: 'Sync with integration branch',
//       task: syncIntegration,
//     },
//     {
//       title: 'Check for changes on current branch',
//       task: async () => {
//         const { stdout } = await execa('git', ['status', '--porcelain']);
//         if (stdout !== '') {
//           const { message } = await prompt({
//             type: 'input',
//             name: 'message',
//             message: 'Uncommitted changes detected. Enter commit message:',
//           });
//           await commitChanges(message);
//         }
//       },
//     },
//     {
//       title: 'Create feature branch',
//       task: () => execa('git', ['checkout', '-b', `feature/${name}`]),
//     },
//   ]);

//   await tasks.run();
// }
