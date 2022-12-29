# Getting Started

There are a number of ways to get started with your application, from launching full blown IoT infrastrucutre, to launching LCU recipes to get you moving quickly.

Here we are going to start from zero and go to hero. providing you with an understanding of what we are and what we aren't while showcasing the features that will help take your development skills to the next level, without learning all the in and outs of every discipline of the DevOps flow.

We'll provide you the tools to understand where your existing skills fit into our methodology and how the Fathym framework and platform will help hold you up where your still learning.

## What's that? How did we build these docs?

Great question, let's start there, but we'll simplify it a bit, as these docs are actually part of a larger [project](https://github.com/fathym/eac/docs).

It may seem these days, that to build visually rich frontends, you need a feature rich javascript framework like React, Svelte, or Angular. While these do boost productivity for certain types of applications (SPAs, highly interactive), it may seem like overkill to use a large framework like next.js for every statically generated site.

For some doc and blog sites, markdown is all that is really needed. With markdown in hand, it can be converted to html, styled with a lightweight system like [TailwindCSS](https://tailwindcss.com/docs/typography-plugin) and via a small amount of management, a blog is born with a github file based CMS.

## Let's Build a Blog

Open your favorite IDE, we use [VS Code](https://code.visualstudio.com/download) for most of our open source projects.

At this point, you may be used to opening up a command prompt, globally installing a custom CLI, and executing a framework's create or init command, but we're going to go a more basic route to start.

Just to show, nothing up our sleeves.

We aren't magicians though, so still need to open a command prompt to a folder of your choosing and run

```cli
npx make-dir-cli test
cd test
```

> **NOTE** - We used `npx make-dir-cli` and will use `npx touch` in a moment. We do this to support cross platform instructions (since we assume node.js is installed). You will need node.js installed to complete other aspects of these docs. Users that know their system commands can use those.

To start we need to create a new `README.md` file

```cli
npx touch README.md
```

Let's open that up and add some basic markdown (feel free to explore and write your own)

```markdown
# Welcome to our Blog

This is our new blog built on a static runtime.
```

Now we need to create a deployable artifact that we'll send up to Fathym for hosting. For our purposes, let's start with a zip artifact

```cli
npx zip-cli -i ./ -o ./deploy.zip
```

This will generate a `deploy.zip` in the working folder that you'll use for deployment to Fathym.

> **NOTE** - If you need to re-create the deploy.zip file, make sure to delete it first, so that it isn't also included in the new zip.

## Let's start working with Fathym

With the code in place, albeit lightweight, we can look at installing some Fathym tooling to bring our code online. If you haven't already, head over and [Sign Up](https://www.fathym.com/dashboard) for an account.

Now we can auth our Fathym connection for the cli

```cli
npx fathym auth
```

This will open your browser and take you to sign in with Fathym for the CLI. This will allow you to connect to your Fathym enterprises and related EaC data.

```cli
npx fathym enterprises list
```

You'll get a list of all your available enterprises. Locate the lookup for the one you want to manage and copy it.

```cli
npx fathym enterprises set {instert-lookup-here}
```

Now we've set the enterprise that we are going to work with and manage. If you are just starting with Fathym, then this will be the lookup to your personal enterprise.

> **NOTE** - The previous `fathym` commands will only need to be executed when you've lost your authentication or want to change the enterprise you are managing. Otherwise, you will not need to run them.

With the CLI connected, we first need to create a project to house our new application. To do this, we will use fathym's `eac` commands.

```cli
npx fathym eac projects create "My First Project"
```

Now we will need an application that we can add to our project.

```cli
npx fathym eac applications create "My First Application"
```

```cli
npx fathym eac applications lcu {app-lookup} [options]
```

```cli
npx fathym eac applications processor {app-lookup} [options]
```

```cli
npx fathym eac projects {proj-lookup} applications add {app-lookup}
```

There are a couple of different things happening here that start to further reveal the EaC and what it does.

> **NOTE** - There are a number of different ways to configure the application and how ithandles a request
> . It also provides a container to manage security and server side file modifications.

# ...

There are a few core features of Fathym you've worked with here; created your first LCU, pulled together your first deploy artifact, and have seen how Fathym can host it for you to share.

Ok, so we do have something up our sleeves. To make all of this possible in the current example, we use the free, hosted version of Fathym's Runtime. There is a lot the runtime can do, nothing for us to bore you with here.
