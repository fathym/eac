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
@fathym/cli/0.0.64 win32-x64 node-v18.12.1
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
* [`fathym dev azure cli-install`](#fathym-dev-azure-cli-install)
* [`fathym dev download URL OUTPUTFILE`](#fathym-dev-download-url-outputfile)
* [`fathym dev lcu scaffold [NAME]`](#fathym-dev-lcu-scaffold-name)
* [`fathym dev set-api-root ENV`](#fathym-dev-set-api-root-env)
* [`fathym eac applications create`](#fathym-eac-applications-create)
* [`fathym eac applications lcu`](#fathym-eac-applications-lcu)
* [`fathym eac applications modifiers add`](#fathym-eac-applications-modifiers-add)
* [`fathym eac applications processor`](#fathym-eac-applications-processor)
* [`fathym eac applications set APPLOOKUP`](#fathym-eac-applications-set-applookup)
* [`fathym eac clear`](#fathym-eac-clear)
* [`fathym eac commit NAME [DESCRIPTION]`](#fathym-eac-commit-name-description)
* [`fathym eac draft`](#fathym-eac-draft)
* [`fathym eac env clouds azure upsert`](#fathym-eac-env-clouds-azure-upsert)
* [`fathym eac env clouds list`](#fathym-eac-env-clouds-list)
* [`fathym eac env pipelines create`](#fathym-eac-env-pipelines-create)
* [`fathym eac env sources create`](#fathym-eac-env-sources-create)
* [`fathym eac env sources pipeline attach`](#fathym-eac-env-sources-pipeline-attach)
* [`fathym eac export`](#fathym-eac-export)
* [`fathym eac modifiers create`](#fathym-eac-modifiers-create)
* [`fathym eac projects applications add`](#fathym-eac-projects-applications-add)
* [`fathym eac projects applications preview`](#fathym-eac-projects-applications-preview)
* [`fathym eac projects create`](#fathym-eac-projects-create)
* [`fathym eac projects list`](#fathym-eac-projects-list)
* [`fathym eac projects modifiers add`](#fathym-eac-projects-modifiers-add)
* [`fathym eac projects set APPLOOKUP`](#fathym-eac-projects-set-applookup)
* [`fathym enterprises get`](#fathym-enterprises-get)
* [`fathym enterprises list`](#fathym-enterprises-list)
* [`fathym enterprises set [ENTLOOKUP]`](#fathym-enterprises-set-entlookup)
* [`fathym git [MESSAGE]`](#fathym-git-message)
* [`fathym git auth`](#fathym-git-auth)
* [`fathym git clone [ORGANIZATION] REPOSITORY`](#fathym-git-clone-organization-repository)
* [`fathym git feature NAME`](#fathym-git-feature-name)
* [`fathym git hotfix NAME`](#fathym-git-hotfix-name)
* [`fathym git import [ORGANIZATION] REPOSITORY REMOTE`](#fathym-git-import-organization-repository-remote)
* [`fathym git init`](#fathym-git-init)
* [`fathym git repos [ORGANIZATION] [REPOSITORY] [BRANCH]`](#fathym-git-repos-organization-repository-branch)
* [`fathym help [COMMAND]`](#fathym-help-command)
* [`fathym lcu LCU`](#fathym-lcu-lcu)
* [`fathym plugins`](#fathym-plugins)
* [`fathym plugins:install PLUGIN...`](#fathym-pluginsinstall-plugin)
* [`fathym plugins:inspect PLUGIN...`](#fathym-pluginsinspect-plugin)
* [`fathym plugins:install PLUGIN...`](#fathym-pluginsinstall-plugin-1)
* [`fathym plugins:link PLUGIN`](#fathym-pluginslink-plugin)
* [`fathym plugins:uninstall PLUGIN...`](#fathym-pluginsuninstall-plugin)
* [`fathym plugins:uninstall PLUGIN...`](#fathym-pluginsuninstall-plugin-1)
* [`fathym plugins:uninstall PLUGIN...`](#fathym-pluginsuninstall-plugin-2)
* [`fathym plugins update`](#fathym-plugins-update)
* [`fathym upgrade`](#fathym-upgrade)

## `fathym auth`

Used to start the authentication process with Fathym, so your CLI can work with the EaC and other features.

```
USAGE
  $ fathym auth [--ci] [--json]

FLAGS
  --ci  Run command in yield mode for automation, to prevent prompts.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used to start the authentication process with Fathym, so your CLI can work with the EaC and other features.

EXAMPLES
  $ fathym auth
```

_See code: [dist/commands/auth/index.ts](https://github.com/fathym/eac/blob/v0.0.64/dist/commands/auth/index.ts)_

## `fathym auth config`

Used to retrieve the current auth config for the user.

```
USAGE
  $ fathym auth config [--ci] [--json]

FLAGS
  --ci  Run command in yield mode for automation, to prevent prompts.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used to retrieve the current auth config for the user.

EXAMPLES
  $ fathym auth config
```

## `fathym auth out`

Used to sign out, so your CLI will NOT work with the EaC and other features.

```
USAGE
  $ fathym auth out [--ci] [--json]

FLAGS
  --ci  Run command in yield mode for automation, to prevent prompts.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used to sign out, so your CLI will NOT work with the EaC and other features.

EXAMPLES
  $ fathym auth out
```

## `fathym dev azure cli-install`

Used for opening the link the the Azure CLI installer.

```
USAGE
  $ fathym dev azure cli-install [--ci] [--json]

FLAGS
  --ci  Run command in yield mode for automation, to prevent prompts.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for opening the link the the Azure CLI installer.

EXAMPLES
  $ fathym dev azure cli-install
```

## `fathym dev download URL OUTPUTFILE`

Used for downloading a file.

```
USAGE
  $ fathym dev download [URL] [OUTPUTFILE] [--ci] [--json]

FLAGS
  --ci  Run command in yield mode for automation, to prevent prompts.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for downloading a file.

EXAMPLES
  $ fathym dev download {url} {outputFile}
```

## `fathym dev lcu scaffold [NAME]`

Used to scaffold a new LCU.

```
USAGE
  $ fathym dev lcu scaffold [NAME] [--ci] [--json] [-d <value>]

FLAGS
  -d, --directory=<value>  The directory to initialize and scaffold.
  --ci                     Run command in yield mode for automation, to prevent prompts.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used to scaffold a new LCU.

EXAMPLES
  $ fathym dev lcu scaffold dev lcu scaffold --help
```

## `fathym dev set-api-root ENV`

Used to set the api root.

```
USAGE
  $ fathym dev set-api-root [ENV] [--ci] [--json]

FLAGS
  --ci  Run command in yield mode for automation, to prevent prompts.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used to set the api root.

EXAMPLES
  $ fathym dev set-api-root
```

## `fathym eac applications create`

Used for creating a new application.

```
USAGE
  $ fathym eac applications create [--ci] [--json]

FLAGS
  --ci  Run command in yield mode for automation, to prevent prompts.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for creating a new application.

EXAMPLES
  $ fathym eac applications create
```

## `fathym eac applications lcu`

Used for creating a managing application LCU settings.

```
USAGE
  $ fathym eac applications lcu [--ci] [--json]

FLAGS
  --ci  Run command in yield mode for automation, to prevent prompts.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for creating a managing application LCU settings.

EXAMPLES
  $ fathym eac applications lcu
```

## `fathym eac applications modifiers add`

Used for adding a DFS modifier to a application.

```
USAGE
  $ fathym eac applications modifiers add [--ci] [--json]

FLAGS
  --ci  Run command in yield mode for automation, to prevent prompts.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for adding a DFS modifier to a application.

EXAMPLES
  $ fathym eac applications modifiers add
```

## `fathym eac applications processor`

Used for creating a managing application Processor settings.

```
USAGE
  $ fathym eac applications processor [--ci] [--json]

FLAGS
  --ci  Run command in yield mode for automation, to prevent prompts.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for creating a managing application Processor settings.

EXAMPLES
  $ fathym eac applications processor
```

## `fathym eac applications set APPLOOKUP`

Used for setting an active application lookup for use in other commands.

```
USAGE
  $ fathym eac applications set [APPLOOKUP] [--ci] [--json]

FLAGS
  --ci  Run command in yield mode for automation, to prevent prompts.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for setting an active application lookup for use in other commands.

EXAMPLES
  $ fathym eac applications set
```

## `fathym eac clear`

Used to clear the current draft to EaC that is queued for commit.

```
USAGE
  $ fathym eac clear [--ci] [--json]

FLAGS
  --ci  Run command in yield mode for automation, to prevent prompts.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used to clear the current draft to EaC that is queued for commit.

EXAMPLES
  $ fathym eac clear
```

## `fathym eac commit NAME [DESCRIPTION]`

Used for commiting changes to the EaC.

```
USAGE
  $ fathym eac commit [NAME] [DESCRIPTION] [--ci] [--json]

FLAGS
  --ci  Run command in yield mode for automation, to prevent prompts.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for commiting changes to the EaC.

EXAMPLES
  $ fathym eac commit
```

## `fathym eac draft`

Used to retrieve the current draft to EaC that is queued for commit.

```
USAGE
  $ fathym eac draft [--ci] [--json]

FLAGS
  --ci  Run command in yield mode for automation, to prevent prompts.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used to retrieve the current draft to EaC that is queued for commit.

EXAMPLES
  $ fathym eac draft
```

## `fathym eac env clouds azure upsert`

Used for creating a new project.

```
USAGE
  $ fathym eac env clouds azure upsert [--ci] [--json] [-g] [-c <value>]

FLAGS
  -c, --cloudLookup=<value>  The cloud lookup to use for upsert or declared lookup on create.
  -g, --[no-]generate        Determines if the CLI should help generate the cloud connection.
  --ci                       Run command in yield mode for automation, to prevent prompts.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for creating a new project.

EXAMPLES
  $ fathym eac env clouds azure upsert
```

## `fathym eac env clouds list`

Used for listing available clouds.

```
USAGE
  $ fathym eac env clouds list [--ci] [--json]

FLAGS
  --ci  Run command in yield mode for automation, to prevent prompts.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for listing available clouds.

EXAMPLES
  $ fathym eac env clouds list
```

## `fathym eac env pipelines create`

Used for creating a new build pipeline.

```
USAGE
  $ fathym eac env pipelines create [--ci] [--json]

FLAGS
  --ci  Run command in yield mode for automation, to prevent prompts.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for creating a new build pipeline.

EXAMPLES
  $ fathym eac env pipelines create
```

## `fathym eac env sources create`

Used for creating a new source control.

```
USAGE
  $ fathym eac env sources create [--ci] [--json]

FLAGS
  --ci  Run command in yield mode for automation, to prevent prompts.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for creating a new source control.

EXAMPLES
  $ fathym eac env sources create
```

## `fathym eac env sources pipeline attach`

Used for attaching a build pipeline to a source control.

```
USAGE
  $ fathym eac env sources pipeline attach [--ci] [--json]

FLAGS
  --ci  Run command in yield mode for automation, to prevent prompts.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for attaching a build pipeline to a source control.

EXAMPLES
  $ fathym eac env sources pipeline attach
```

## `fathym eac export`

Used for exporting the EaC.

```
USAGE
  $ fathym eac export [--ci] [--json] [-f <value>]

FLAGS
  -f, --file=<value>  File path where the export should be written
  --ci                Run command in yield mode for automation, to prevent prompts.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for exporting the EaC.

EXAMPLES
  $ fathym eac export
```

## `fathym eac modifiers create`

Used for creating a new DFS modifier.

```
USAGE
  $ fathym eac modifiers create [--ci] [--json]

FLAGS
  --ci  Run command in yield mode for automation, to prevent prompts.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for creating a new DFS modifier.

EXAMPLES
  $ fathym eac modifiers create
```

## `fathym eac projects applications add`

Used for adding an application to a project.

```
USAGE
  $ fathym eac projects applications add [--ci] [--json]

FLAGS
  --ci  Run command in yield mode for automation, to prevent prompts.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for adding an application to a project.

EXAMPLES
  $ fathym eac projects applications add
```

## `fathym eac projects applications preview`

Used for getting a preview link to a project application.

```
USAGE
  $ fathym eac projects applications preview [--ci] [--json]

FLAGS
  --ci  Run command in yield mode for automation, to prevent prompts.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for getting a preview link to a project application.

EXAMPLES
  $ fathym eac projects applications preview
```

## `fathym eac projects create`

Used for creating a new project.

```
USAGE
  $ fathym eac projects create [--ci] [--json]

FLAGS
  --ci  Run command in yield mode for automation, to prevent prompts.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for creating a new project.

EXAMPLES
  $ fathym eac projects create
```

## `fathym eac projects list`

Used for listing available projects.

```
USAGE
  $ fathym eac projects list [--ci] [--json]

FLAGS
  --ci  Run command in yield mode for automation, to prevent prompts.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for listing available projects.

EXAMPLES
  $ fathym eac projects list
```

## `fathym eac projects modifiers add`

Used for adding a DFS modifier to a project.

```
USAGE
  $ fathym eac projects modifiers add [--ci] [--json]

FLAGS
  --ci  Run command in yield mode for automation, to prevent prompts.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for adding a DFS modifier to a project.

EXAMPLES
  $ fathym eac projects modifiers add
```

## `fathym eac projects set APPLOOKUP`

Used for setting an active project lookup for use in other commands.

```
USAGE
  $ fathym eac projects set [APPLOOKUP] [--ci] [--json]

FLAGS
  --ci  Run command in yield mode for automation, to prevent prompts.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for setting an active project lookup for use in other commands.

EXAMPLES
  $ fathym eac projects set
```

## `fathym enterprises get`

Get's the current user's active enterprise for the CLI. Determines

```
USAGE
  $ fathym enterprises get [--ci] [--json]

FLAGS
  --ci  Run command in yield mode for automation, to prevent prompts.

GLOBAL FLAGS
  --json  Format output as json.

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
  $ fathym enterprises list [--ci] [--json]

FLAGS
  --ci  Run command in yield mode for automation, to prevent prompts.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used to list the current users available enterprises.

EXAMPLES
  $ fathym enterprises list
```

## `fathym enterprises set [ENTLOOKUP]`

Set's the current user's active enterprise for the CLI. Determines

```
USAGE
  $ fathym enterprises set [ENTLOOKUP] [--ci] [--json]

FLAGS
  --ci  Run command in yield mode for automation, to prevent prompts.

GLOBAL FLAGS
  --json  Format output as json.

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
  $ fathym git [MESSAGE] [--ci] [--json] [-r]

FLAGS
  -r, --rebase  When specified does a rebase instead of a merge.
  --ci          Run command in yield mode for automation, to prevent prompts.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for committing changes to the current working branch and syncing with integration.

EXAMPLES
  $ fathym git "Commit messag here"
```

_See code: [dist/commands/git/index.ts](https://github.com/fathym/eac/blob/v0.0.64/dist/commands/git/index.ts)_

## `fathym git auth`

Used for authenticating the user with Git.

```
USAGE
  $ fathym git auth [--ci] [--json] [-f]

FLAGS
  -f, --force  Force authentication process to present git rights, even if the user is already authenticated.
  --ci         Run command in yield mode for automation, to prevent prompts.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for authenticating the user with Git.

EXAMPLES
  $ fathym git auth
```

## `fathym git clone [ORGANIZATION] REPOSITORY`

Used for cloning the source control for Git.

```
USAGE
  $ fathym git clone [ORGANIZATION] [REPOSITORY] [--ci] [--json] [-d <value>] [-b <value>]

FLAGS
  -b, --branch=<value>  Specifies the branch or tag to clone
  -d, --depth=<value>   Specifies the depth of the clone
  --ci                  Run command in yield mode for automation, to prevent prompts.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for cloning the source control for Git.

EXAMPLES
  $ fathym git clone
```

## `fathym git feature NAME`

Used for creating a feature branch from 'integration' in git.

```
USAGE
  $ fathym git feature [NAME] [--ci] [--json]

ARGUMENTS
  NAME  Name for the new feature branch

FLAGS
  --ci  Run command in yield mode for automation, to prevent prompts.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for creating a feature branch from 'integration' in git.

EXAMPLES
  $ fathym git feature
```

## `fathym git hotfix NAME`

Used for creating a hotfix branch from 'main' in git.

```
USAGE
  $ fathym git hotfix [NAME] [--ci] [--json]

ARGUMENTS
  NAME  Name for the new hotfix branch

FLAGS
  --ci  Run command in yield mode for automation, to prevent prompts.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for creating a hotfix branch from 'main' in git.

EXAMPLES
  $ fathym git hotfix
```

## `fathym git import [ORGANIZATION] REPOSITORY REMOTE`

Used for importing a remote source control into a configured EaC Source control.

```
USAGE
  $ fathym git import [ORGANIZATION] [REPOSITORY] [REMOTE] [--ci] [--json] [-d <value>] [-b <value>]

FLAGS
  -b, --branch=<value>  Specifies the branch or tag to clone
  -d, --depth=<value>   Specifies the depth of the clone
  --ci                  Run command in yield mode for automation, to prevent prompts.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for importing a remote source control into a configured EaC Source control.

EXAMPLES
  $ fathym git import import organization repository "https://github.com/fathym-it/smart-building-demo
```

## `fathym git init`

Used for configuring a repository with best practices.

```
USAGE
  $ fathym git init [--ci] [--json]

FLAGS
  --ci  Run command in yield mode for automation, to prevent prompts.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for configuring a repository with best practices.

EXAMPLES
  $ fathym git init
```

## `fathym git repos [ORGANIZATION] [REPOSITORY] [BRANCH]`

Used for retrieving information about repositories including organizations, their repos and related branch information.

```
USAGE
  $ fathym git repos [ORGANIZATION] [REPOSITORY] [BRANCH] [--ci] [--json]

FLAGS
  --ci  Run command in yield mode for automation, to prevent prompts.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for retrieving information about repositories including organizations, their repos and related branch
  information.

EXAMPLES
  $ fathym git repos {organization} {repository} {branc}
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

## `fathym lcu LCU`

Used to install, or walk a user through installing an LCU.

```
USAGE
  $ fathym lcu [LCU] [--ci] [--json] [-o <value>] [--parameters <value>] [-p <value>]

FLAGS
  -o, --organization=<value>  The organization to deploy LCU code repositories to.
  -p, --project=<value>       The project to deploy the LCU into.
  --ci                        Run command in yield mode for automation, to prevent prompts.
  --parameters=<value>        Specify values to use in the parameters list: ({ paramName: paramValue })

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used to install, or walk a user through installing an LCU.

EXAMPLES
  $ fathym lcu
```

_See code: [dist/commands/lcu/index.ts](https://github.com/fathym/eac/blob/v0.0.64/dist/commands/lcu/index.ts)_

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

## `fathym upgrade`

Used to upgrade the Fathym CLI in global scope.

```
USAGE
  $ fathym upgrade [--ci] [--json]

FLAGS
  --ci  Run command in yield mode for automation, to prevent prompts.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used to upgrade the Fathym CLI in global scope.

EXAMPLES
  $ fathym upgrade
```

_See code: [dist/commands/upgrade.ts](https://github.com/fathym/eac/blob/v0.0.64/dist/commands/upgrade.ts)_
<!-- commandsstop -->
