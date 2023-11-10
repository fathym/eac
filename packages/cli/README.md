# oclif-hello-world

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [oclif-hello-world](#oclif-hello-world)
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
@fathym/cli/0.0.225 win32-x64 node-v18.16.0
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
* [`fathym dev api-root [ENV]`](#fathym-dev-api-root-env)
* [`fathym dev azure cli-install`](#fathym-dev-azure-cli-install)
* [`fathym dev azure sshkey create [RESOURCEGROUP]`](#fathym-dev-azure-sshkey-create-resourcegroup)
* [`fathym dev billing manage`](#fathym-dev-billing-manage)
* [`fathym dev config open [CONFIG]`](#fathym-dev-config-open-config)
* [`fathym dev deno scaffold [NAME]`](#fathym-dev-deno-scaffold-name)
* [`fathym dev download URL OUTPUTFILE`](#fathym-dev-download-url-outputfile)
* [`fathym dev lcu react create [NAME]`](#fathym-dev-lcu-react-create-name)
* [`fathym dev lcu scaffold [NAME]`](#fathym-dev-lcu-scaffold-name)
* [`fathym dev package transform`](#fathym-dev-package-transform)
* [`fathym dfs upload [FILE] [FILEPATH]`](#fathym-dfs-upload-file-filepath)
* [`fathym eac active get`](#fathym-eac-active-get)
* [`fathym eac active set [ENTLOOKUP]`](#fathym-eac-active-set-entlookup)
* [`fathym eac applications define [APPLOOKUP]`](#fathym-eac-applications-define-applookup)
* [`fathym eac applications delete [APPLOOKUP]`](#fathym-eac-applications-delete-applookup)
* [`fathym eac applications lcu TYPE [APPLOOKUP]`](#fathym-eac-applications-lcu-type-applookup)
* [`fathym eac applications list`](#fathym-eac-applications-list)
* [`fathym eac applications lookup [APPLOOKUP]`](#fathym-eac-applications-lookup-applookup)
* [`fathym eac applications modifiers add [APPLOOKUP]`](#fathym-eac-applications-modifiers-add-applookup)
* [`fathym eac applications processor TYPE [APPLOOKUP]`](#fathym-eac-applications-processor-type-applookup)
* [`fathym eac applications set [APPLOOKUP]`](#fathym-eac-applications-set-applookup)
* [`fathym eac applications unpack [APPLOOKUP]`](#fathym-eac-applications-unpack-applookup)
* [`fathym eac commit [MESSAGE]`](#fathym-eac-commit-message)
* [`fathym eac dashboard`](#fathym-eac-dashboard)
* [`fathym eac draft`](#fathym-eac-draft)
* [`fathym eac drop`](#fathym-eac-drop)
* [`fathym eac env clouds azure define [CLOUDLOOKUP]`](#fathym-eac-env-clouds-azure-define-cloudlookup)
* [`fathym eac env clouds azure generate [CLOUDLOOKUP]`](#fathym-eac-env-clouds-azure-generate-cloudlookup)
* [`fathym eac env clouds delete [CLOUDLOOKUP]`](#fathym-eac-env-clouds-delete-cloudlookup)
* [`fathym eac env clouds groups delete [CLOUDRESGROUPLOOKUP]`](#fathym-eac-env-clouds-groups-delete-cloudresgrouplookup)
* [`fathym eac env clouds groups list`](#fathym-eac-env-clouds-groups-list)
* [`fathym eac env clouds groups resources list`](#fathym-eac-env-clouds-groups-resources-list)
* [`fathym eac env clouds list`](#fathym-eac-env-clouds-list)
* [`fathym eac env pipelines define [TYPE] [PIPELINELOOKUP]`](#fathym-eac-env-pipelines-define-type-pipelinelookup)
* [`fathym eac env pipelines delete [PIPELINELOOKUP]`](#fathym-eac-env-pipelines-delete-pipelinelookup)
* [`fathym eac env pipelines list`](#fathym-eac-env-pipelines-list)
* [`fathym eac env sources define [SOURCELOOKUP]`](#fathym-eac-env-sources-define-sourcelookup)
* [`fathym eac env sources delete [SOURCELOOKUP]`](#fathym-eac-env-sources-delete-sourcelookup)
* [`fathym eac env sources list`](#fathym-eac-env-sources-list)
* [`fathym eac env sources pipeline attach [SOURCELOOKUP] [PIPELINELOOKUP]`](#fathym-eac-env-sources-pipeline-attach-sourcelookup-pipelinelookup)
* [`fathym eac export`](#fathym-eac-export)
* [`fathym eac list`](#fathym-eac-list)
* [`fathym eac modifiers define [MODIFIERLOOKUP]`](#fathym-eac-modifiers-define-modifierlookup)
* [`fathym eac modifiers delete [MODIFIERLOOKUP]`](#fathym-eac-modifiers-delete-modifierlookup)
* [`fathym eac projects applications add [PROJECTLOOKUP] [APPLOOKUP]`](#fathym-eac-projects-applications-add-projectlookup-applookup)
* [`fathym eac projects applications preview [PROJECTLOOKUP] [APPLOOKUP]`](#fathym-eac-projects-applications-preview-projectlookup-applookup)
* [`fathym eac projects define [PROJECTLOOKUP]`](#fathym-eac-projects-define-projectlookup)
* [`fathym eac projects delete [PROJECTLOOKUP]`](#fathym-eac-projects-delete-projectlookup)
* [`fathym eac projects list`](#fathym-eac-projects-list)
* [`fathym eac projects modifiers add [PROJECTLOOKUP]`](#fathym-eac-projects-modifiers-add-projectlookup)
* [`fathym eac projects preview [PROJECTLOOKUP]`](#fathym-eac-projects-preview-projectlookup)
* [`fathym eac projects set`](#fathym-eac-projects-set)
* [`fathym enterprises dashboard`](#fathym-enterprises-dashboard)
* [`fathym enterprises get`](#fathym-enterprises-get)
* [`fathym enterprises list`](#fathym-enterprises-list)
* [`fathym enterprises set [ENTLOOKUP]`](#fathym-enterprises-set-entlookup)
* [`fathym git [MESSAGE]`](#fathym-git-message)
* [`fathym git auth`](#fathym-git-auth)
* [`fathym git clone [ORGANIZATION] [REPOSITORY]`](#fathym-git-clone-organization-repository)
* [`fathym git configure [ORGANIZATION] [REPOSITORY]`](#fathym-git-configure-organization-repository)
* [`fathym git feature [NAME]`](#fathym-git-feature-name)
* [`fathym git feature integrate [ORGANIZATION] [REPOSITORY] [BRANCH]`](#fathym-git-feature-integrate-organization-repository-branch)
* [`fathym git feature merge [NAME]`](#fathym-git-feature-merge-name)
* [`fathym git home [ORGANIZATION] [REPOSITORY]`](#fathym-git-home-organization-repository)
* [`fathym git hotfix [NAME]`](#fathym-git-hotfix-name)
* [`fathym git hotfix patch [ORGANIZATION] [REPOSITORY] [BRANCH]`](#fathym-git-hotfix-patch-organization-repository-branch)
* [`fathym git import [ORGANIZATION] [REPOSITORY] [REMOTE]`](#fathym-git-import-organization-repository-remote)
* [`fathym git repos [ORGANIZATION] [REPOSITORY] [BRANCH]`](#fathym-git-repos-organization-repository-branch)
* [`fathym help [COMMANDS]`](#fathym-help-commands)
* [`fathym lcu [LCU]`](#fathym-lcu-lcu)
* [`fathym licenses get [LICENSETYPE]`](#fathym-licenses-get-licensetype)
* [`fathym licenses list`](#fathym-licenses-list)
* [`fathym open [PATH]`](#fathym-open-path)
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
  $ fathym auth [--json]

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used to start the authentication process with Fathym, so your CLI can work with the EaC and other features.

EXAMPLES
  $ fathym auth
```

_See code: [dist/commands/auth/index.ts](https://github.com/fathym/eac/blob/v0.0.225/dist/commands/auth/index.ts)_

## `fathym auth config`

Used to retrieve the current auth config for the user.

```
USAGE
  $ fathym auth config [--json]

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
  $ fathym auth out [--json]

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used to sign out, so your CLI will NOT work with the EaC and other features.

EXAMPLES
  $ fathym auth out
```

## `fathym dev api-root [ENV]`

Used to set the api root.

```
USAGE
  $ fathym dev api-root [ENV] [--json]

ARGUMENTS
  ENV  (prod|local) The environment APIs to use.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used to set the api root.

EXAMPLES
  $ fathym dev api-root
```

## `fathym dev azure cli-install`

Used for opening the link the the Azure CLI installer.

```
USAGE
  $ fathym dev azure cli-install [--json]

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for opening the link the the Azure CLI installer.

EXAMPLES
  $ fathym dev azure cli-install
```

## `fathym dev azure sshkey create [RESOURCEGROUP]`

Used for opening the link the the Azure CLI installer.

```
USAGE
  $ fathym dev azure sshkey create [RESOURCEGROUP] [--json] [-n <value>]

ARGUMENTS
  RESOURCEGROUP  The resource group to create the SSH key for

FLAGS
  -n, --keyName=<value>  Set the name of the SSH key to create.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for opening the link the the Azure CLI installer.

EXAMPLES
  $ fathym dev azure sshkey create
```

## `fathym dev billing manage`

Used to open the billing dashboard.

```
USAGE
  $ fathym dev billing manage [--json]

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used to open the billing dashboard.

EXAMPLES
  $ fathym dev billing manage
```

## `fathym dev config open [CONFIG]`

Used to open the config directory.

```
USAGE
  $ fathym dev config open [CONFIG] [--json]

ARGUMENTS
  CONFIG  The config location to open.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used to open the config directory.

EXAMPLES
  $ fathym dev config open
```

## `fathym dev deno scaffold [NAME]`

Used to scaffold a new Deno project.

```
USAGE
  $ fathym dev deno scaffold [NAME] [--json] [-d <value>]

ARGUMENTS
  NAME  The name of the deno project to scaffold.

FLAGS
  -d, --directory=<value>  The directory to initialize and scaffold.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used to scaffold a new Deno project.

EXAMPLES
  $ fathym dev deno scaffold dev deno scaffold --help
```

## `fathym dev download URL OUTPUTFILE`

Used for downloading a file.

```
USAGE
  $ fathym dev download URL OUTPUTFILE [--json]

ARGUMENTS
  URL         The URL of the artifact to download.
  OUTPUTFILE  The output file location of the download.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for downloading a file.

EXAMPLES
  $ fathym dev download {url} {outputFile}
```

## `fathym dev lcu react create [NAME]`

Used to create a new react application.

```
USAGE
  $ fathym dev lcu react create [NAME] [--json] [-m] [-t]

ARGUMENTS
  NAME  [default: .] The name of the application to create.

FLAGS
  -m, --mui       Used to determine if mui should be installed.
  -t, --tailwind  Used to determine if tailwind should be installed.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used to create a new react application.

EXAMPLES
  $ fathym dev lcu react create
```

## `fathym dev lcu scaffold [NAME]`

Used to scaffold a new LCU.

```
USAGE
  $ fathym dev lcu scaffold [NAME] [--json] [-d <value>]

ARGUMENTS
  NAME  The name of the LCU to scaffold.

FLAGS
  -d, --directory=<value>  The directory to initialize and scaffold.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used to scaffold a new LCU.

EXAMPLES
  $ fathym dev lcu scaffold dev lcu scaffold --help
```

## `fathym dev package transform`

Used to transform the package json file.

```
USAGE
  $ fathym dev package transform [--json] [-d <value>] [-t <value>] [-o <value>]

FLAGS
  -d, --destination=<value>         Used to determine where to move the transformed package.
  -o, --transformOverrides=<value>  [default: a-specific-name|] The values to use in place of the included properties, |
                                    separated.
  -t, --transform=<value>           [default: name|version] The package json property keys to bring along, | separated.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used to transform the package json file.

EXAMPLES
  $ fathym dev package transform
```

## `fathym dfs upload [FILE] [FILEPATH]`

Used for downloading a file.

```
USAGE
  $ fathym dfs upload [FILE] [FILEPATH] [--json] [-a <value>] [-f] [-p]

ARGUMENTS
  FILE      Path to upload file
  FILEPATH  The path within the DFS to upload the file to.

FLAGS
  -a, --appLookup=<value>  The applookup to upload to.
  -f, --findApp            Whether or not to prompt for an application when no app lookup provided.
  -p, --projectFilter      Whether to filter filter applications by project lookup.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for downloading a file.

EXAMPLES
  $ fathym dfs upload {url} {outputFile}
```

## `fathym eac active get`

Get's the current user's active enterprise for the CLI. Determines

```
USAGE
  $ fathym eac active get [--json]

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Get's the current user's active enterprise for the CLI. Determines
  which enterprise commands are executed against.

EXAMPLES
  $ fathym eac active get
```

## `fathym eac active set [ENTLOOKUP]`

Set's the current user's active enterprise for the CLI. Determines

```
USAGE
  $ fathym eac active set [ENTLOOKUP] [--json]

ARGUMENTS
  ENTLOOKUP  The enterprise lookup to set as active.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Set's the current user's active enterprise for the CLI. Determines
  which enterprise commands are executed against.

EXAMPLES
  $ fathym eac active set
```

## `fathym eac applications define [APPLOOKUP]`

Used for creating or updating an application.

```
USAGE
  $ fathym eac applications define [APPLOOKUP] [--json] [-d <value>] [-n <value>]

ARGUMENTS
  APPLOOKUP  The application lookup to use for define.

FLAGS
  -d, --description=<value>  The description of the project.
  -n, --name=<value>         The name of the project.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for creating or updating an application.

EXAMPLES
  $ fathym eac applications define
```

## `fathym eac applications delete [APPLOOKUP]`

Used for deleting a application.

```
USAGE
  $ fathym eac applications delete [APPLOOKUP] [--json]

ARGUMENTS
  APPLOOKUP  The application lookup to delete.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for deleting a application.

EXAMPLES
  $ fathym eac applications delete
```

## `fathym eac applications lcu TYPE [APPLOOKUP]`

Used for managing application LCU settings.

```
USAGE
  $ fathym eac applications lcu TYPE [APPLOOKUP] [--json] [-z <value>]

ARGUMENTS
  TYPE       (API|ApplicationPointer|GitHub|GitHubOAuth|SPA|NPM|WordPress|Zip) The type of the LCU settings to
             configure.
  APPLOOKUP  The application lookup to manage LCU settings for.

FLAGS
  -z, --zipFile=<value>  The path to the zip file containing your site.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for managing application LCU settings.

EXAMPLES
  $ fathym eac applications lcu
```

## `fathym eac applications list`

Used for listing available applications.

```
USAGE
  $ fathym eac applications list [--json]

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for listing available applications.

EXAMPLES
  $ fathym eac applications list
```

## `fathym eac applications lookup [APPLOOKUP]`

Used for managing application lookup settings.

```
USAGE
  $ fathym eac applications lookup [APPLOOKUP] [--json] [-p <value>]

ARGUMENTS
  APPLOOKUP  The application lookup to manage.

FLAGS
  -p, --path=<value>  The path the application will be hosted on

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for managing application lookup settings.

EXAMPLES
  $ fathym eac applications lookup
```

## `fathym eac applications modifiers add [APPLOOKUP]`

Used for adding a DFS modifier to a application.

```
USAGE
  $ fathym eac applications modifiers add [APPLOOKUP] [--json]

ARGUMENTS
  APPLOOKUP  The application lookup

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for adding a DFS modifier to a application.

EXAMPLES
  $ fathym eac applications modifiers add
```

## `fathym eac applications processor TYPE [APPLOOKUP]`

Used for managing application processor settings.

```
USAGE
  $ fathym eac applications processor TYPE [APPLOOKUP] [--json] [-d <value>] [-b <value>]

ARGUMENTS
  TYPE       (DFS|OAuth|Proxy|Redirect) The type of the processor settings to configure.
  APPLOOKUP  The application lookup to manage processor settings for.

FLAGS
  -b, --baseHref=<value>     The base href.
  -d, --defaultFile=<value>  The path of the default file.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for managing application processor settings.

EXAMPLES
  $ fathym eac applications processor
```

## `fathym eac applications set [APPLOOKUP]`

Used for setting an active application lookup for use in other commands.

```
USAGE
  $ fathym eac applications set [APPLOOKUP] [--json]

ARGUMENTS
  APPLOOKUP  The application lookup to configure.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for setting an active application lookup for use in other commands.

EXAMPLES
  $ fathym eac applications set
```

## `fathym eac applications unpack [APPLOOKUP]`

Used for queuing an application unpack for existing configuration in the EaC.

```
USAGE
  $ fathym eac applications unpack [APPLOOKUP] [--json]

ARGUMENTS
  APPLOOKUP  The application lookup.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for queuing an application unpack for existing configuration in the EaC.

EXAMPLES
  $ fathym eac applications unpack
```

## `fathym eac commit [MESSAGE]`

Used for commiting changes to the EaC.

```
USAGE
  $ fathym eac commit [MESSAGE] [--json]

ARGUMENTS
  MESSAGE  The commit message.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for commiting changes to the EaC.

EXAMPLES
  $ fathym eac commit
```

## `fathym eac dashboard`

Used to open the EaC dashboard.

```
USAGE
  $ fathym eac dashboard [--json]

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used to open the EaC dashboard.

EXAMPLES
  $ fathym eac dashboard
```

## `fathym eac draft`

Used to retrieve the current draft to EaC that is queued for commit.

```
USAGE
  $ fathym eac draft [--json] [-f <value>]

FLAGS
  -f, --file=<value>  File path where the export should be written

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used to retrieve the current draft to EaC that is queued for commit.

EXAMPLES
  $ fathym eac draft
```

## `fathym eac drop`

Used to drop the current draft to EaC that is queued for commit.

```
USAGE
  $ fathym eac drop [--json]

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used to drop the current draft to EaC that is queued for commit.

EXAMPLES
  $ fathym eac drop
```

## `fathym eac env clouds azure define [CLOUDLOOKUP]`

Used for defining a new cloud connection.

```
USAGE
  $ fathym eac env clouds azure define [CLOUDLOOKUP] [--json] [-g]

ARGUMENTS
  CLOUDLOOKUP  The cloud lookup to use for define.

FLAGS
  -g, --[no-]generate  Determines if the CLI should help generate the cloud connection.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for defining a new cloud connection.

EXAMPLES
  $ fathym eac env clouds azure define
```

## `fathym eac env clouds azure generate [CLOUDLOOKUP]`

Used for defining a new cloud connection.

```
USAGE
  $ fathym eac env clouds azure generate [CLOUDLOOKUP] [--json] [-g]

ARGUMENTS
  CLOUDLOOKUP  The cloud lookup to use for define.

FLAGS
  -g, --[no-]generate  Determines if the CLI should help generate the cloud connection.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for defining a new cloud connection.

EXAMPLES
  $ fathym eac env clouds azure generate
```

## `fathym eac env clouds delete [CLOUDLOOKUP]`

Used for deleting a cloud.

```
USAGE
  $ fathym eac env clouds delete [CLOUDLOOKUP] [--json]

ARGUMENTS
  CLOUDLOOKUP  The cloud lookup to delete.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for deleting a cloud.

EXAMPLES
  $ fathym eac env clouds delete
```

## `fathym eac env clouds groups delete [CLOUDRESGROUPLOOKUP]`

Used for deleting a cloud resource group.

```
USAGE
  $ fathym eac env clouds groups delete [CLOUDRESGROUPLOOKUP] [--json]

ARGUMENTS
  CLOUDRESGROUPLOOKUP  The cloud resource group lookup to delete.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for deleting a cloud resource group.

EXAMPLES
  $ fathym eac env clouds groups delete
```

## `fathym eac env clouds groups list`

Used for listing available clouds.

```
USAGE
  $ fathym eac env clouds groups list [--json] [-c <value>]

FLAGS
  -c, --cloudLookup=<value>  Specify the cloud to list resource groups for.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for listing available clouds.

EXAMPLES
  $ fathym eac env clouds groups list
```

## `fathym eac env clouds groups resources list`

Used for listing available clouds.

```
USAGE
  $ fathym eac env clouds groups resources list [--json] [-c <value>] [-g <value>]

FLAGS
  -c, --cloudLookup=<value>          Specify the cloud to list resource groups for.
  -g, --cloudResGroupLookup=<value>  Specify the cloud resource group to list resources for.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for listing available clouds.

EXAMPLES
  $ fathym eac env clouds groups resources list
```

## `fathym eac env clouds list`

Used for listing available clouds.

```
USAGE
  $ fathym eac env clouds list [--json]

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for listing available clouds.

EXAMPLES
  $ fathym eac env clouds list
```

## `fathym eac env pipelines define [TYPE] [PIPELINELOOKUP]`

Used for creating a new pipeline control.

```
USAGE
  $ fathym eac env pipelines define [TYPE] [PIPELINELOOKUP] [--json] [--name <value>] [--path <value>] [--buildCommand
    <value>] [--installCommand <value>] [--templates <value>]

ARGUMENTS
  TYPE            (GitHub|NPM) The pipeline lookup for the definition.
  PIPELINELOOKUP  The pipeline lookup for the definition.

FLAGS
  --buildCommand=<value>    The build command of the generated action file.
  --installCommand=<value>  The install command of the generated action file.
  --name=<value>            The name of the build pipeline.
  --path=<value>            The path of the generated action file.
  --templates=<value>       The template(s) ('|' delimited for multiple) to use for generated action file.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for creating a new pipeline control.

EXAMPLES
  $ fathym eac env pipelines define
```

## `fathym eac env pipelines delete [PIPELINELOOKUP]`

Used for deleting a pipeline.

```
USAGE
  $ fathym eac env pipelines delete [PIPELINELOOKUP] [--json]

ARGUMENTS
  PIPELINELOOKUP  The pipeline lookup to delete.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for deleting a pipeline.

EXAMPLES
  $ fathym eac env pipelines delete
```

## `fathym eac env pipelines list`

Used for listing available pipelines.

```
USAGE
  $ fathym eac env pipelines list [--json]

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for listing available pipelines.

EXAMPLES
  $ fathym eac env pipelines list
```

## `fathym eac env sources define [SOURCELOOKUP]`

Used for defining a new source control.

```
USAGE
  $ fathym eac env sources define [SOURCELOOKUP] [--json] [--organization <value>] [--repository <value>] [--mainBranch
    <value>]

ARGUMENTS
  SOURCELOOKUP  The source lookup for the definition.

FLAGS
  --mainBranch=<value>    The branch to use as main.
  --organization=<value>  The organization to define from.
  --repository=<value>    The repository to define from.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for defining a new source control.

EXAMPLES
  $ fathym eac env sources define
```

## `fathym eac env sources delete [SOURCELOOKUP]`

Used for deleting a source.

```
USAGE
  $ fathym eac env sources delete [SOURCELOOKUP] [--json]

ARGUMENTS
  SOURCELOOKUP  The source lookup to delete.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for deleting a source.

EXAMPLES
  $ fathym eac env sources delete
```

## `fathym eac env sources list`

Used for listing available sources.

```
USAGE
  $ fathym eac env sources list [--json]

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for listing available sources.

EXAMPLES
  $ fathym eac env sources list
```

## `fathym eac env sources pipeline attach [SOURCELOOKUP] [PIPELINELOOKUP]`

Used for attaching a build pipeline to a source control.

```
USAGE
  $ fathym eac env sources pipeline attach [SOURCELOOKUP] [PIPELINELOOKUP] [--json]

ARGUMENTS
  SOURCELOOKUP    The source lookup
  PIPELINELOOKUP  The pipeline lookup

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
  $ fathym eac export [--json] [-f <value>]

FLAGS
  -f, --file=<value>  File path where the export should be written

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for exporting the EaC.

EXAMPLES
  $ fathym eac export
```

## `fathym eac list`

Used to list the current users available enterprises.

```
USAGE
  $ fathym eac list [--json]

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used to list the current users available enterprises.

EXAMPLES
  $ fathym eac list
```

## `fathym eac modifiers define [MODIFIERLOOKUP]`

Used for defining a DFS modifier.

```
USAGE
  $ fathym eac modifiers define [MODIFIERLOOKUP] [--json] [-n <value>] [-f <value>] [-p <value>] [-d] [-p <value>]

ARGUMENTS
  MODIFIERLOOKUP  The modifier lookup to use for define.

FLAGS
  -d, --disabled            Wether the modifier is disabled or not.
  -f, --pathFilter=<value>  The path filter regex of the modifier.
  -n, --name=<value>        The name of the modifier.
  -p, --details=<value>     The string version of the details JSON.
  -p, --priority=<value>    The priority of the modifier.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for defining a DFS modifier.

EXAMPLES
  $ fathym eac modifiers define
```

## `fathym eac modifiers delete [MODIFIERLOOKUP]`

Used for deleting a DFS Modifier.

```
USAGE
  $ fathym eac modifiers delete [MODIFIERLOOKUP] [--json]

ARGUMENTS
  MODIFIERLOOKUP  The modifier lookup to delete.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for deleting a DFS Modifier.

EXAMPLES
  $ fathym eac modifiers delete
```

## `fathym eac projects applications add [PROJECTLOOKUP] [APPLOOKUP]`

Used for adding an application to a project.

```
USAGE
  $ fathym eac projects applications add [PROJECTLOOKUP] [APPLOOKUP] [--json]

ARGUMENTS
  PROJECTLOOKUP  The project lookup to add the application to.
  APPLOOKUP      The application lookup to add to the project.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for adding an application to a project.

EXAMPLES
  $ fathym eac projects applications add
```

## `fathym eac projects applications preview [PROJECTLOOKUP] [APPLOOKUP]`

Used for preivewing a application.

```
USAGE
  $ fathym eac projects applications preview [PROJECTLOOKUP] [APPLOOKUP] [--json] [-p <value>]

ARGUMENTS
  PROJECTLOOKUP  The project lookup to preview.
  APPLOOKUP      The application lookup to preview.

FLAGS
  -p, --path=<value>  The path to preview.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for preivewing a application.

EXAMPLES
  $ fathym eac projects applications preview
```

## `fathym eac projects define [PROJECTLOOKUP]`

Used for creating or updating a project.

```
USAGE
  $ fathym eac projects define [PROJECTLOOKUP] [--json] [-d <value>] [-n <value>]

ARGUMENTS
  PROJECTLOOKUP  The project lookup to use for define.

FLAGS
  -d, --description=<value>  The description of the project.
  -n, --name=<value>         The name of the project.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for creating or updating a project.

EXAMPLES
  $ fathym eac projects define
```

## `fathym eac projects delete [PROJECTLOOKUP]`

Used for deleting a project.

```
USAGE
  $ fathym eac projects delete [PROJECTLOOKUP] [--json] [-a]

ARGUMENTS
  PROJECTLOOKUP  The project lookup to delete.

FLAGS
  -a, --saveApps  If on, the associated applications will NOT be deleted.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for deleting a project.

EXAMPLES
  $ fathym eac projects delete
```

## `fathym eac projects list`

Used for listing available projects.

```
USAGE
  $ fathym eac projects list [--json]

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for listing available projects.

EXAMPLES
  $ fathym eac projects list
```

## `fathym eac projects modifiers add [PROJECTLOOKUP]`

Used for adding a DFS modifier to a project.

```
USAGE
  $ fathym eac projects modifiers add [PROJECTLOOKUP] [--json]

ARGUMENTS
  PROJECTLOOKUP  The project lookup

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for adding a DFS modifier to a project.

EXAMPLES
  $ fathym eac projects modifiers add
```

## `fathym eac projects preview [PROJECTLOOKUP]`

Used for preivewing a project.

```
USAGE
  $ fathym eac projects preview [PROJECTLOOKUP] [--json] [-p <value>]

ARGUMENTS
  PROJECTLOOKUP  The project lookup to preview.

FLAGS
  -p, --path=<value>  The path to preview.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for preivewing a project.

EXAMPLES
  $ fathym eac projects preview
```

## `fathym eac projects set`

Used for setting an active project lookup for use in other commands.

```
USAGE
  $ fathym eac projects set [--json]

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for setting an active project lookup for use in other commands.

EXAMPLES
  $ fathym eac projects set
```

## `fathym enterprises dashboard`

Used to open the enterprise dashboard.

```
USAGE
  $ fathym enterprises dashboard [--json]

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used to open the enterprise dashboard.

EXAMPLES
  $ fathym enterprises dashboard
```

## `fathym enterprises get`

Get's the current user's active enterprise for the CLI. Determines

```
USAGE
  $ fathym enterprises get [--json]

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
  $ fathym enterprises list [--json]

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
  $ fathym enterprises set [ENTLOOKUP] [--json]

ARGUMENTS
  ENTLOOKUP  The enterprise lookup to set as active.

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
  $ fathym git [MESSAGE] [--json] [-r]

ARGUMENTS
  MESSAGE  The commit message.

FLAGS
  -r, --rebase  When specified does a rebase instead of a merge.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for committing changes to the current working branch and syncing with integration.

EXAMPLES
  $ fathym git "Commit messag here"
```

_See code: [dist/commands/git/index.ts](https://github.com/fathym/eac/blob/v0.0.225/dist/commands/git/index.ts)_

## `fathym git auth`

Used for authenticating the user with Git.

```
USAGE
  $ fathym git auth [--json] [-e] [-s]

FLAGS
  -e, --edit  Open page to manage git authorization.
  -s, --self  Whether to capture auth for self or parent enterprise.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for authenticating the user with Git.

EXAMPLES
  $ fathym git auth
```

## `fathym git clone [ORGANIZATION] [REPOSITORY]`

Used for cloning the source control for Git.

```
USAGE
  $ fathym git clone [ORGANIZATION] [REPOSITORY] [--json] [-d <value>] [-b <value>]

ARGUMENTS
  ORGANIZATION  The organization to clone from.
  REPOSITORY    The repository to clone from.

FLAGS
  -b, --branch=<value>  Specifies the branch or tag to clone
  -d, --depth=<value>   Specifies the depth of the clone

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for cloning the source control for Git.

EXAMPLES
  $ fathym git clone
```

## `fathym git configure [ORGANIZATION] [REPOSITORY]`

Used for configuring a repository with best practices.

```
USAGE
  $ fathym git configure [ORGANIZATION] [REPOSITORY] [--json] [-l <value>] [-s]

ARGUMENTS
  ORGANIZATION  The organization to configure.
  REPOSITORY    The repository to init.

FLAGS
  -l, --license=<value>  The license to initialize the repo with.
  -s, --skipLocal        Whether or not to skip using the local git information.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for configuring a repository with best practices.

EXAMPLES
  $ fathym git configure
```

## `fathym git feature [NAME]`

Used for creating a feature branch from 'integration' in git.

```
USAGE
  $ fathym git feature [NAME] [--json]

ARGUMENTS
  NAME  Name for the new feature branch.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for creating a feature branch from 'integration' in git.

EXAMPLES
  $ fathym git feature
```

## `fathym git feature integrate [ORGANIZATION] [REPOSITORY] [BRANCH]`

Used for integrating a feature branch into 'integration' in git.

```
USAGE
  $ fathym git feature integrate [ORGANIZATION] [REPOSITORY] [BRANCH] [--json] [-l]

ARGUMENTS
  ORGANIZATION  The organization to integrate from.
  REPOSITORY    The repository to integrate from.
  BRANCH        The branch to integrate from.

FLAGS
  -l, --useLocal  Whether to use local git information for args.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for integrating a feature branch into 'integration' in git.

EXAMPLES
  $ fathym git feature integrate
```

## `fathym git feature merge [NAME]`

Used for merging 2 feature branches where 1 is merged into the other.

```
USAGE
  $ fathym git feature merge [NAME] [--json]

ARGUMENTS
  NAME  Name for the new feature branch.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for merging 2 feature branches where 1 is merged into the other.

EXAMPLES
  $ fathym git feature merge
```

## `fathym git home [ORGANIZATION] [REPOSITORY]`

Used to open the repo home.

```
USAGE
  $ fathym git home [ORGANIZATION] [REPOSITORY] [--json] [-s <value>] [-l]

ARGUMENTS
  ORGANIZATION  The organization to open.
  REPOSITORY    The repository to open.

FLAGS
  -l, --useLocal         Whether to use local git information for args.
  -s, --section=<value>  The section to open.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used to open the repo home.

EXAMPLES
  $ fathym git home
```

## `fathym git hotfix [NAME]`

Used for creating a hotfix branch from 'main' in git.

```
USAGE
  $ fathym git hotfix [NAME] [--json]

ARGUMENTS
  NAME  Name for the new hotfix branch.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for creating a hotfix branch from 'main' in git.

EXAMPLES
  $ fathym git hotfix
```

## `fathym git hotfix patch [ORGANIZATION] [REPOSITORY] [BRANCH]`

Used for patching a hotfix branch into 'main' in git.

```
USAGE
  $ fathym git hotfix patch [ORGANIZATION] [REPOSITORY] [BRANCH] [--json] [-l]

ARGUMENTS
  ORGANIZATION  The organization to patch from.
  REPOSITORY    The repository to patch from.
  BRANCH        The branch to patch from.

FLAGS
  -l, --useLocal  Whether to use local git information for args.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for patching a hotfix branch into 'main' in git.

EXAMPLES
  $ fathym git hotfix patch
```

## `fathym git import [ORGANIZATION] [REPOSITORY] [REMOTE]`

Used for importing a remote source control into a configured EaC Source control.

```
USAGE
  $ fathym git import [ORGANIZATION] [REPOSITORY] [REMOTE] [--json] [-d <value>] [-b <value>]

ARGUMENTS
  ORGANIZATION  The organization to clone from.
  REPOSITORY    The repository to clone from.
  REMOTE        The name of the remote to import.

FLAGS
  -b, --branch=<value>  Specifies the branch or tag to clone
  -d, --depth=<value>   Specifies the depth of the clone

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for importing a remote source control into a configured EaC Source control.

EXAMPLES
  $ fathym git import import organization repository "https://github.com/fathym-it/smart-building-demo
```

## `fathym git repos [ORGANIZATION] [REPOSITORY] [BRANCH]`

Used for retrieving information about repositories including organizations, their repos and related branch information.

```
USAGE
  $ fathym git repos [ORGANIZATION] [REPOSITORY] [BRANCH] [--json]

ARGUMENTS
  ORGANIZATION  The organization.
  REPOSITORY    The repository.
  BRANCH        The branch.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used for retrieving information about repositories including organizations, their repos and related branch
  information.

EXAMPLES
  $ fathym git repos {organization} {repository} {branc}
```

## `fathym help [COMMANDS]`

Display help for fathym.

```
USAGE
  $ fathym help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for fathym.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.9/src/commands/help.ts)_

## `fathym lcu [LCU]`

Used to install, or walk a user through installing an LCU.

```
USAGE
  $ fathym lcu [LCU] [--json] [-o <value>] [--parameters <value>] [-p <value>]

ARGUMENTS
  LCU  The LCU package to install.

FLAGS
  -o, --organization=<value>  The organization to deploy LCU code repositories to.
  -p, --project=<value>       The project to deploy the LCU into.
  --parameters=<value>        Specify values to use in the parameters list: ({ paramName: paramValue })

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used to install, or walk a user through installing an LCU.

EXAMPLES
  $ fathym lcu
```

_See code: [dist/commands/lcu/index.ts](https://github.com/fathym/eac/blob/v0.0.225/dist/commands/lcu/index.ts)_

## `fathym licenses get [LICENSETYPE]`

Get's the current user's active license by licenseType for the CLI. Determines

```
USAGE
  $ fathym licenses get [LICENSETYPE] [--json]

ARGUMENTS
  LICENSETYPE  The license type to get

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Get's the current user's active license by licenseType for the CLI. Determines
  if a user has access to provision cloud resources in Azure.

EXAMPLES
  $ fathym licenses get
```

## `fathym licenses list`

Used to list the current users active licenses.

```
USAGE
  $ fathym licenses list [--json]

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used to list the current users active licenses.

EXAMPLES
  $ fathym licenses list
```

## `fathym open [PATH]`

Used to open the current directory or a file within it.

```
USAGE
  $ fathym open [PATH] [--json] [-c]

ARGUMENTS
  PATH  [default: ./] The path to open.

FLAGS
  -c, --code  If activated, opens in VS Code. Default: true

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used to open the current directory or a file within it.

EXAMPLES
  $ fathym open
```

_See code: [dist/commands/open.ts](https://github.com/fathym/eac/blob/v0.0.225/dist/commands/open.ts)_

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

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.4.7/src/commands/plugins/index.ts)_

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

GLOBAL FLAGS
  --json  Format output as json.

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
  $ fathym upgrade [--json]

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Used to upgrade the Fathym CLI in global scope.

EXAMPLES
  $ fathym upgrade
```

_See code: [dist/commands/upgrade.ts](https://github.com/fathym/eac/blob/v0.0.225/dist/commands/upgrade.ts)_
<!-- commandsstop -->
