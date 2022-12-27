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
@fathym/cli/0.0.1 win32-x64 node-v16.17.1
$ fathym --help [COMMAND]
USAGE
  $ fathym COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`fathym hello PERSON`](#fathym-hello-person)
* [`fathym hello world`](#fathym-hello-world)
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

## `fathym hello PERSON`

Say hello

```
USAGE
  $ fathym hello [PERSON] -f <value>

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

_See code: [dist/commands/hello/index.ts](https://github.com/fathym/eac/blob/v0.0.1/dist/commands/hello/index.ts)_

## `fathym hello world`

Say hello world

```
USAGE
  $ fathym hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ fathym hello world
  hello world! (./src/commands/hello/world.ts)
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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.20/src/commands/help.ts)_

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.1.9/src/commands/plugins/index.ts)_

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
