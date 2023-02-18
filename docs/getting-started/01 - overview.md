# Getting Started with Fathym

Fathym is a framework and platform designed to streamline the development and deployment process for applications. It provides a variety of tools and features to manage the entire DevOps workflow, from development to deployment. With Fathym, you can quickly launch full-blown IoT infrastructure or use LCU recipes to get your application up and running in no time.

In this tutorial, we'll walk you through the process of setting up a static blog using Fathym. By the end of this tutorial, you'll have a solid understanding of how Fathym works and how it can help accelerate application delivery.

## Building with Markdown

Markdown is a simple formatting syntax for writing plain text that can be converted to HTML. It's often used for creating documentation and blog sites because it's easy to read and write, and it can be styled with a lightweight system like [TailwindCSS](https://tailwindcss.com/). With a little bit of management, you can use markdown and statically generate a blog with a GitHub file-based CMS.

These docs are part of a larger project and were built using markdown and delivered with the Fathym Runtime. Using a large JavaScript framework like React, Svelte, or Angular can be useful for building visually rich, interactive applications, but may not be necessary for every statically generated site.

## Let's Build a Blog

At this point, you may be used to opening up a command prompt, globally installing a custom CLI, and executing a framework's create or init command. However, we're going to go a more basic route to start.

First, open your favorite IDE. We recommend VS Code for most of our open-source projects.

Next, open a command prompt and navigate to a folder of your choosing (VS Code has a built in terminal that is really nice to use).

```cli
npx make-dir-cli test
```

```cli
cd test
```

> **NOTE** - We used `npx make-dir-cli` and will use `npx touch` in a moment. We do this to support cross platform instructions (since we assume node.js is installed). You will need node.js installed to complete other aspects of these docs. Users that know their system commands can use those.

To start, create a new README.md file with the following commands:

```cli
npx touch README.md
```

```cli
npx open-cli README.md
```

With the README.md file open, add some basic markdown:

```markdown
# Welcome to our Blog

This is our new blog built on a static runtime.
```

Now, we need to create a deployable artifact that we'll send to Fathym for hosting. For our purposes, let's start with a zip artifact:

```cli
npx zip-cli -i ./ -o ./deploy.zip
```

This will generate a deploy.zip file in the working folder that you'll use for deployment to Fathym.

> **NOTE** - If you need to re-create the deploy.zip file, make sure to delete it first, so that it isn't also included in the new zip.

## Setting up Fathym

To start working with Fathym, you'll need to sign up for an account on [Fathym's website](https://www.fathym.com/dashboard).

Then you can install the CLI globally.

```cli
npm install @fathym/cli@latest -g
```

To authenticate the Fathym connection for the CLI, run the following command:

```cli
fathym auth
```

This will open your browser and prompt you to sign in with Fathym for the CLI. This will allow you to connect to your Fathym enterprises and related EaC data.

To view a list of your available enterprises, run:

```cli
fathym enterprises list
```

> **NOTE** - If you don't see any enterprises in the list, you will need to make sure you first visit the dashboard. Run `fathym enterprises dashboard` and an initial enterprise will be created for you.

Next you need to set your active enterprise, run the following and complete the prompts:

```cli
fathym enterprises set
```

This will set the enterprise that you will work with and manage. If you are just starting with Fathym, this will most likely be your personal enterprise.

> **NOTE** - The previous fathym commands will only need to be run again if you lose your authentication or want to change the enterprise you are managing. Otherwise, they do not need to be repeated.

## Project Setup

With the CLI connected, we first need to create a project to house our new application. To do this, we will use Fathym's `eac` commands. Select `- Create New -` from the prompts. After the project and application have been drafted, you will select them from the prompts when required.

```cli
fathym eac projects define -n "My First Project"
```

Now, using a similar command, we will create an application that we can add to our project.

```cli
fathym eac applications define -n "My First Application"
```

We need to configure how our application will be chosen to handle a request. There are a number of options here, we'll keep it simple with a basic path lookup.

```cli
fathym eac applications lookup -p /
```

There are a number of different options for configuring how the application handles requests. To do so we configure the application's processor.

```cli
fathym eac applications processor DFS -d index.html -b /
```

The LCU for an application can be configured to manage security and server-side file modifications for the application. We'll configure a simple application for our zip files now.

```cli
fathym eac applications lcu Zip -z "https://{{Host}}/deploys/deploy.zip"
```

Not that we've used the `Host` token as a dynamic way of accessing where the `deploy.zip` is located for deployment. In order to make the zip file available we can use another dev command to push the zip file to our Fathym Distributed File System (DFS), at the Enterprise scope, making it available to all projects and applications that we create.

```cli
fathym dfs upload ./deploy.zip /deploys/deploy.zip
```

> **NOTE** - You can host the zip file anywhere its publically available, it does not have to be in our DFS. (private zip access is not currently available)

Then, we can add the application to the project using the prompts and selecting our `draft` project and application.

```cli
fathym eac projects applications add
```

At this point, we haven't actually made any updates to our EaC. The commands we have used have simply created a draft. The purpose of this is to allow you to craft all of your updates for a single concept, in a single request. Instead of individually updating, we can check our draft before committing.

```cli
fathym eac draft
```

Like code, we should keep our commits to a a small related set of updates. This ensures a clean history and understanding of changes applied to your enterprise. If your happy with the draft, we can commit all of our changes to the EaC at once.

```cli
fathym eac commit "Added my first project and it's first application"
```

This will commit all of the changes, creating the project, the application, and deploying the zip. To preview the application, you can run the following command:

```cli
fathym eac projects applications preview
```

If your using chrome, you'll see the raw markdown on the web page. If your using Firefox, or other browsers that don't support rendering markdown, you'll be prompted to download the file. This isn't ideal, and isn't where we want to leave it.

Let's look at two last features of the Fathym EaC for this guide, we'll see them both in action in this next command.

```cli
fathym lcu @fathym-it/lcu-eac-modifier-markdown-to-html
```

We are seeing two features here, the first is our LCU Packages, this are building blocks for composing your solutions. The second is a DFS Modifier, specifically for converting markdwon into HTML.

Before we can see our new installed modifier in action, we have to added it to a project (modifiers can also be added to individual applications).

```cli
fathym eac projects modifiers add
```

```cli
fathym eac commit "Added markdown modifier to project"
```

This will automatically open a browser to preview the application.

# Wrapping Up

That's it, we've launched our first application. We've seen a few core features of Fathym; we were introduced to the CLI and we can see how Fathym can host markdown from a deployment artifact.

This may seem like an overly simple flow, but note what most projects include at the root – a README file. At its very simplest, with Fathym you can host your README file to share with the world.

There are a couple of different things happening here that start to further reveal the EaC and what it does. The system is organized into multiple management groups. This particular set works with projects and how/where its applications are hosted/deployed.

> **NOTE** - There are a number of different ways to configure the application and how it handles a request. It also provides a container to manage security and server-side file modifications.

In the next example we will expand on this blog by adding in some HTML, leveraging additional Fathym Runtime features and changing up our deployment artifact.
