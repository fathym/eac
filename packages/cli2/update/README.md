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
$ npm install -g update
$ update COMMAND
running command...
$ update (--version)
update/0.0.0 win32-x64 node-v18.12.1
$ update --help [COMMAND]
USAGE
  $ update COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`update hello PERSON`](#update-hello-person)
* [`update hello world`](#update-hello-world)
* [`update help [COMMANDS]`](#update-help-commands)
* [`update plugins`](#update-plugins)
* [`update plugins:install PLUGIN...`](#update-pluginsinstall-plugin)
* [`update plugins:inspect PLUGIN...`](#update-pluginsinspect-plugin)
* [`update plugins:install PLUGIN...`](#update-pluginsinstall-plugin-1)
* [`update plugins:link PLUGIN`](#update-pluginslink-plugin)
* [`update plugins:uninstall PLUGIN...`](#update-pluginsuninstall-plugin)
* [`update plugins:uninstall PLUGIN...`](#update-pluginsuninstall-plugin-1)
* [`update plugins:uninstall PLUGIN...`](#update-pluginsuninstall-plugin-2)
* [`update plugins update`](#update-plugins-update)

## `update hello PERSON`

Say hello

```
USAGE
  $ update hello [PERSON] -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/mcgear/hello-world/blob/v0.0.0/dist/commands/hello/index.ts)_

## `update hello world`

Say hello world

```
USAGE
  $ update hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ update hello world
  hello world! (./src/commands/hello/world.ts)
```

## `update help [COMMANDS]`

Display help for update.

```
USAGE
  $ update help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for update.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.2/src/commands/help.ts)_

## `update plugins`

List installed plugins.

```
USAGE
  $ update plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ update plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.3.0/src/commands/plugins/index.ts)_

## `update plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ update plugins:install PLUGIN...

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
  $ update plugins add

EXAMPLES
  $ update plugins:install myplugin 

  $ update plugins:install https://github.com/someuser/someplugin

  $ update plugins:install someuser/someplugin
```

## `update plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ update plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ update plugins:inspect myplugin
```

## `update plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ update plugins:install PLUGIN...

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
  $ update plugins add

EXAMPLES
  $ update plugins:install myplugin 

  $ update plugins:install https://github.com/someuser/someplugin

  $ update plugins:install someuser/someplugin
```

## `update plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ update plugins:link PLUGIN

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
  $ update plugins:link myplugin
```

## `update plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ update plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ update plugins unlink
  $ update plugins remove
```

## `update plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ update plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ update plugins unlink
  $ update plugins remove
```

## `update plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ update plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ update plugins unlink
  $ update plugins remove
```

## `update plugins update`

Update installed plugins.

```
USAGE
  $ update plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
