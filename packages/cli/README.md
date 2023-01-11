oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @fathym/cli
$ fathym COMMAND
running command...
$ fathym (--version)
@fathym/cli/0.0.18 win32-x64 node-v18.12.1
$ fathym --help [COMMAND]
USAGE
  $ fathym COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`fathym auth`](#fathym-auth)
* [`fathym auth config`](#fathym-auth-config)
* [`fathym auth out`](#fathym-auth-out)
* [`fathym eac applications create`](#fathym-eac-applications-create)
* [`fathym eac applications lcu`](#fathym-eac-applications-lcu)
* [`fathym eac applications modifiers add`](#fathym-eac-applications-modifiers-add)
* [`fathym eac applications processor`](#fathym-eac-applications-processor)
* [`fathym eac applications set APPLOOKUP`](#fathym-eac-applications-set-applookup)
* [`fathym eac changes`](#fathym-eac-changes)
* [`fathym eac commit MESSAGE`](#fathym-eac-commit-message)
* [`fathym eac export`](#fathym-eac-export)
* [`fathym eac modifiers create`](#fathym-eac-modifiers-create)
* [`fathym eac pipelines create`](#fathym-eac-pipelines-create)
* [`fathym eac projects applications add`](#fathym-eac-projects-applications-add)
* [`fathym eac projects applications preview`](#fathym-eac-projects-applications-preview)
* [`fathym eac projects create`](#fathym-eac-projects-create)
* [`fathym eac projects modifiers add`](#fathym-eac-projects-modifiers-add)
* [`fathym eac projects set APPLOOKUP`](#fathym-eac-projects-set-applookup)
* [`fathym eac sources create`](#fathym-eac-sources-create)
* [`fathym eac sources pipeline attach`](#fathym-eac-sources-pipeline-attach)
* [`fathym enterprises get`](#fathym-enterprises-get)
* [`fathym enterprises list`](#fathym-enterprises-list)
* [`fathym enterprises set ENTLOOKUP`](#fathym-enterprises-set-entlookup)
* [`fathym git [MESSAGE]`](#fathym-git-message)
* [`fathym git commit [MESSAGE]`](#fathym-git-commit-message)
* [`fathym git sync [MESSAGE]`](#fathym-git-sync-message)
* [`fathym git auth`](#fathym-git-auth)
* [`fathym git clone [ORGANIZATION] REPOSITORY`](#fathym-git-clone-organization-repository)
* [`fathym git feature NAME`](#fathym-git-feature-name)
* [`fathym git hotfix NAME`](#fathym-git-hotfix-name)
* [`fathym help [COMMAND]`](#fathym-help-command)
* [`fathym plugins`](#fathym-plugins)
* [`fathym plugins:install PLUGIN...`](#fathym-pluginsinstall-plugin)
* [`fathym plugins:inspect PLUGIN...`](#fathym-pluginsinspect-plugin)
* [`fathym plugins:install PLUGIN...`](#fathym-pluginsinstall-plugin-1)
* [`fathym plugins:link PLUGIN`](#fathym-pluginslink-plugin)
* [`fathym plugins:uninstall PLUGIN...`](#fathym-pluginsuninstall-plugin)
* [`fathym plugins:uninstall PLUGIN...`](#fathym-pluginsuninstall-plugin-1)
* [`fathym plugins:uninstall PLUGIN...`](#fathym-pluginsuninstall-plugin-2)
* [`fathym plugins update`](#fathym-plugins-update)

## `fathym auth`

Used to start the authentication process with Fathym, so your CLI can work with the EaC and other features.

```
USAGE
  $ fathym auth [-i]

FLAGS
  -i, --interactive  Run command in interactive mode, allowing prompts for missing required args and flags.

DESCRIPTION
  Used to start the authentication process with Fathym, so your CLI can work with the EaC and other features.

EXAMPLES
  $ fathym auth
```

_See code: [dist/commands/auth/index.ts](https://github.com/fathym/eac/blob/v0.0.18/dist/commands/auth/index.ts)_

## `fathym auth config`

Used to retrieve the current auth config for the user.

```
USAGE
  $ fathym auth config [-i]

FLAGS
  -i, --interactive  Run command in interactive mode, allowing prompts for missing required args and flags.

DESCRIPTION
  Used to retrieve the current auth config for the user.

EXAMPLES
  $ fathym auth config
```

## `fathym auth out`

Used to sign out, so your CLI will NOT work with the EaC and other features.

```
USAGE
  $ fathym auth out [-i]

FLAGS
  -i, --interactive  Run command in interactive mode, allowing prompts for missing required args and flags.

DESCRIPTION
  Used to sign out, so your CLI will NOT work with the EaC and other features.

EXAMPLES
  $ fathym auth out
```

## `fathym eac applications create`

Used for creating a new application.

```
USAGE
  $ fathym eac applications create [-i]

FLAGS
  -i, --interactive  Run command in interactive mode, allowing prompts for missing required args and flags.

DESCRIPTION
  Used for creating a new application.

EXAMPLES
  $ fathym eac applications create
```

## `fathym eac applications lcu`

Used for creating a managing application LCU settings.

```
USAGE
  $ fathym eac applications lcu [-i]

FLAGS
  -i, --interactive  Run command in interactive mode, allowing prompts for missing required args and flags.

DESCRIPTION
  Used for creating a managing application LCU settings.

EXAMPLES
  $ fathym eac applications lcu
```

## `fathym eac applications modifiers add`

Used for adding a DFS modifier to a application.

```
USAGE
  $ fathym eac applications modifiers add [-i]

FLAGS
  -i, --interactive  Run command in interactive mode, allowing prompts for missing required args and flags.

DESCRIPTION
  Used for adding a DFS modifier to a application.

EXAMPLES
  $ fathym eac applications modifiers add
```

## `fathym eac applications processor`

Used for creating a managing application Processor settings.

```
USAGE
  $ fathym eac applications processor [-i]

FLAGS
  -i, --interactive  Run command in interactive mode, allowing prompts for missing required args and flags.

DESCRIPTION
  Used for creating a managing application Processor settings.

EXAMPLES
  $ fathym eac applications processor
```

## `fathym eac applications set APPLOOKUP`

Used for setting an active application lookup for use in other commands.

```
USAGE
  $ fathym eac applications set [APPLOOKUP] [-i]

FLAGS
  -i, --interactive  Run command in interactive mode, allowing prompts for missing required args and flags.

DESCRIPTION
  Used for setting an active application lookup for use in other commands.

EXAMPLES
  $ fathym eac applications set
```

## `fathym eac changes`

Used to retrieve the current changes to EaC that are queued for commit.

```
USAGE
  $ fathym eac changes [-i]

FLAGS
  -i, --interactive  Run command in interactive mode, allowing prompts for missing required args and flags.

DESCRIPTION
  Used to retrieve the current changes to EaC that are queued for commit.

EXAMPLES
  $ fathym eac changes
```

## `fathym eac commit MESSAGE`

Used for commiting changes to the EaC.

```
USAGE
  $ fathym eac commit [MESSAGE] [-i]

FLAGS
  -i, --interactive  Run command in interactive mode, allowing prompts for missing required args and flags.

DESCRIPTION
  Used for commiting changes to the EaC.

EXAMPLES
  $ fathym eac commit
```

## `fathym eac export`

Used for exporting the EaC.

```
USAGE
  $ fathym eac export [-i]

FLAGS
  -i, --interactive  Run command in interactive mode, allowing prompts for missing required args and flags.

DESCRIPTION
  Used for exporting the EaC.

EXAMPLES
  $ fathym eac export
```

## `fathym eac modifiers create`

Used for creating a new DFS modifier.

```
USAGE
  $ fathym eac modifiers create [-i]

FLAGS
  -i, --interactive  Run command in interactive mode, allowing prompts for missing required args and flags.

DESCRIPTION
  Used for creating a new DFS modifier.

EXAMPLES
  $ fathym eac modifiers create
```

## `fathym eac pipelines create`

Used for creating a new build pipeline.

```
USAGE
  $ fathym eac pipelines create [-i]

FLAGS
  -i, --interactive  Run command in interactive mode, allowing prompts for missing required args and flags.

DESCRIPTION
  Used for creating a new build pipeline.

EXAMPLES
  $ fathym eac pipelines create
```

## `fathym eac projects applications add`

Used for adding an application to a project.

```
USAGE
  $ fathym eac projects applications add [-i]

FLAGS
  -i, --interactive  Run command in interactive mode, allowing prompts for missing required args and flags.

DESCRIPTION
  Used for adding an application to a project.

EXAMPLES
  $ fathym eac projects applications add
```

## `fathym eac projects applications preview`

Used for getting a preview link to a project application.

```
USAGE
  $ fathym eac projects applications preview [-i]

FLAGS
  -i, --interactive  Run command in interactive mode, allowing prompts for missing required args and flags.

DESCRIPTION
  Used for getting a preview link to a project application.

EXAMPLES
  $ fathym eac projects applications preview
```

## `fathym eac projects create`

Used for creating a new project.

```
USAGE
  $ fathym eac projects create [-i]

FLAGS
  -i, --interactive  Run command in interactive mode, allowing prompts for missing required args and flags.

DESCRIPTION
  Used for creating a new project.

EXAMPLES
  $ fathym eac projects create
```

## `fathym eac projects modifiers add`

Used for adding a DFS modifier to a project.

```
USAGE
  $ fathym eac projects modifiers add [-i]

FLAGS
  -i, --interactive  Run command in interactive mode, allowing prompts for missing required args and flags.

DESCRIPTION
  Used for adding a DFS modifier to a project.

EXAMPLES
  $ fathym eac projects modifiers add
```

## `fathym eac projects set APPLOOKUP`

Used for setting an active project lookup for use in other commands.

```
USAGE
  $ fathym eac projects set [APPLOOKUP] [-i]

FLAGS
  -i, --interactive  Run command in interactive mode, allowing prompts for missing required args and flags.

DESCRIPTION
  Used for setting an active project lookup for use in other commands.

EXAMPLES
  $ fathym eac projects set
```

## `fathym eac sources create`

Used for creating a new source control.

```
USAGE
  $ fathym eac sources create [-i]

FLAGS
  -i, --interactive  Run command in interactive mode, allowing prompts for missing required args and flags.

DESCRIPTION
  Used for creating a new source control.

EXAMPLES
  $ fathym eac sources create
```

## `fathym eac sources pipeline attach`

Used for attaching a build pipeline to a source control.

```
USAGE
  $ fathym eac sources pipeline attach [-i]

FLAGS
  -i, --interactive  Run command in interactive mode, allowing prompts for missing required args and flags.

DESCRIPTION
  Used for attaching a build pipeline to a source control.

EXAMPLES
  $ fathym eac sources pipeline attach
```

## `fathym enterprises get`

Get's the current user's active enterprise for the CLI. Determines

```
USAGE
  $ fathym enterprises get [-i]

FLAGS
  -i, --interactive  Run command in interactive mode, allowing prompts for missing required args and flags.

DESCRIPTION
  Get's the current user's active enterprise for the CLI. Determines
  which enterprise commands are executed against.

EXAMPLES
  $ fathym enterprises get
```

## `fathym enterprises list`

Used to list the current users available enterprises.

```
USAGE
  $ fathym enterprises list [-i]

FLAGS
  -i, --interactive  Run command in interactive mode, allowing prompts for missing required args and flags.

DESCRIPTION
  Used to list the current users available enterprises.

EXAMPLES
  $ fathym enterprises list
```

## `fathym enterprises set ENTLOOKUP`

Set's the current user's active enterprise for the CLI. Determines

```
USAGE
  $ fathym enterprises set [ENTLOOKUP] [-i]

FLAGS
  -i, --interactive  Run command in interactive mode, allowing prompts for missing required args and flags.

DESCRIPTION
  Set's the current user's active enterprise for the CLI. Determines
  which enterprise commands are executed against.

EXAMPLES
  $ fathym enterprises set
```

## `fathym git [MESSAGE]`

Used for committing changes to the current working branch and syncing with integration.

```
USAGE
  $ fathym git [MESSAGE] [-i]

FLAGS
  -i, --interactive  Run command in interactive mode, allowing prompts for missing required args and flags.

DESCRIPTION
  Used for committing changes to the current working branch and syncing with integration.

ALIASES
  $ fathym git commit
  $ fathym git sync

EXAMPLES
  $ fathym git
```

_See code: [dist/commands/git/index.ts](https://github.com/fathym/eac/blob/v0.0.18/dist/commands/git/index.ts)_

## `fathym git commit [MESSAGE]`

Used for committing changes to the current working branch and syncing with integration.

```
USAGE
  $ fathym git commit [MESSAGE] [-i]

FLAGS
  -i, --interactive  Run command in interactive mode, allowing prompts for missing required args and flags.

DESCRIPTION
  Used for committing changes to the current working branch and syncing with integration.

ALIASES
  $ fathym git commit
  $ fathym git sync

EXAMPLES
  $ fathym git commit
```

## `fathym git sync [MESSAGE]`

Used for committing changes to the current working branch and syncing with integration.

```
USAGE
  $ fathym git sync [MESSAGE] [-i]

FLAGS
  -i, --interactive  Run command in interactive mode, allowing prompts for missing required args and flags.

DESCRIPTION
  Used for committing changes to the current working branch and syncing with integration.

ALIASES
  $ fathym git commit
  $ fathym git sync

EXAMPLES
  $ fathym git sync
```

## `fathym git auth`

Used for authenticating the user with Git.

```
USAGE
  $ fathym git auth [-i] [-f]

FLAGS
  -f, --force        Force authentication process to present git rights, even if the user is already authenticated.
  -i, --interactive  Run command in interactive mode, allowing prompts for missing required args and flags.

DESCRIPTION
  Used for authenticating the user with Git.

EXAMPLES
  $ fathym git auth
```

## `fathym git clone [ORGANIZATION] REPOSITORY`

Used for cloning the source control for Git.

```
USAGE
  $ fathym git clone [ORGANIZATION] [REPOSITORY] [-i] [-d <value>] [-b <value>]

FLAGS
  -b, --branch=<value>  Specifies the branch or tag to clone
  -d, --depth=<value>   Specifies the depth of the clone
  -i, --interactive     Run command in interactive mode, allowing prompts for missing required args and flags.

DESCRIPTION
  Used for cloning the source control for Git.

EXAMPLES
  $ fathym git clone
```

## `fathym git feature NAME`

Used for creating a feature branch from 'integration' in git.

```
USAGE
  $ fathym git feature [NAME] [-i]

ARGUMENTS
  NAME  Name for the new feature branch

FLAGS
  -i, --interactive  Run command in interactive mode, allowing prompts for missing required args and flags.

DESCRIPTION
  Used for creating a feature branch from 'integration' in git.

EXAMPLES
  $ fathym git feature
```

## `fathym git hotfix NAME`

Used for creating a hotfix branch from 'main' in git.

```
USAGE
  $ fathym git hotfix [NAME] [-i]

ARGUMENTS
  NAME  Name for the new hotfix branch

FLAGS
  -i, --interactive  Run command in interactive mode, allowing prompts for missing required args and flags.

DESCRIPTION
  Used for creating a hotfix branch from 'main' in git.

EXAMPLES
  $ fathym git hotfix
```

## `fathym help [COMMAND]`

Display help for fathym.

```
USAGE
  $ fathym help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for fathym.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.22/src/commands/help.ts)_

## `fathym plugins`

List installed plugins.

```
USAGE
  $ fathym plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ fathym plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.1.12/src/commands/plugins/index.ts)_

## `fathym plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ fathym plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ fathym plugins add

EXAMPLES
  $ fathym plugins:install myplugin 

  $ fathym plugins:install https://github.com/someuser/someplugin

  $ fathym plugins:install someuser/someplugin
```

## `fathym plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ fathym plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ fathym plugins:inspect myplugin
```

## `fathym plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ fathym plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ fathym plugins add

EXAMPLES
  $ fathym plugins:install myplugin 

  $ fathym plugins:install https://github.com/someuser/someplugin

  $ fathym plugins:install someuser/someplugin
```

## `fathym plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ fathym plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ fathym plugins:link myplugin
```

## `fathym plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ fathym plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ fathym plugins unlink
  $ fathym plugins remove
```

## `fathym plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ fathym plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ fathym plugins unlink
  $ fathym plugins remove
```

## `fathym plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ fathym plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ fathym plugins unlink
  $ fathym plugins remove
```

## `fathym plugins update`

Update installed plugins.

```
USAGE
  $ fathym plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
