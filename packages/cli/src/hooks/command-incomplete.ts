import { Hook, toConfiguredId, toStandardizedId } from '@oclif/core';
import { color } from '@oclif/color';
import enquirer from 'enquirer';

const hook: Hook.CommandIncomplete = async function ({
  config,
  matches,
  argv,
}) {
  const { command } = await enquirer.prompt<{ command: string }>([
    {
      type: 'select',
      name: 'command',
      message: 'Which of these commands would you like to run?',
      choices: matches.map((p: any) => {
        const command = color.green(
          `fathym ${p.id.toString().replace(/:/g, ' ')}`
        );

        return {
          message: `${p.title} - ${color.blueBright(
            p.description
          )} (${command})`,
          name: toConfiguredId(p.id, config),
        };
      }),
    },
  ]);

  if (argv.includes('--help') || argv.includes('-h')) {
    return config.runCommand('help', [toStandardizedId(command, config)]);
  }

  return config.runCommand(toStandardizedId(command, config), argv);
};

export default hook;
