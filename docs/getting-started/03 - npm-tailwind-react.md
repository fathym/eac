# Bringing the blog to life

So far we've just been getting things setup and learning a bit of the lay of the land at Fathym. Now let's quickly look at bringing in a few more things to showcase how fathym works to help you deliver your user experiences with speed and efficiency.

## Let's bring in TailwindCSS and React

Tailwind CSS is a utility-first CSS framework that allows developers to build custom user interfaces more quickly and easily using pre-designed styles and layout options. Their combination can help developers build responsive, lightweight, and fast web applications that are efficient, scalable, and maintainable, which can help to reduce development time and improve the overall performance of the applications.

Coupled with Fathym's out of the box cloud native starting point and automated devops processes, you have a workflow for efficiently delivering your solutions.

We can start by creating a react application in our current repository. You can create your react application however you want, we use this command for our internal applications.

```cli
fathym dev lcu create react --tailwind
```

This will generate a new react application using CRA (create-react-app), add in tailwind configuations, setup the `index.html` file to showcase tailwind, and start the application. If you don'tuse our cli, you will need to setup and configure everything yourself, including deploy scrpits used next.

## Deployment artifacts with NPM packages

When using the GitHub build artifact as your deployment artifact, there is one limiting factor, and that is the retention time on those artifacts. While not common to jump back several versions that might be outdated, it is possible that the current version, if unchanged for longer than the retention time, will itself not be deployable. One of the key benefits of hosting with Fathym is being able to host any version of your artifact, on any route, based on your needs (production, staging, test, etc.).

Using NPM packages, we can maintain a complete deployment history. Using NPM tags, we can create a simple way for qa, dev, and product owners to work together to validate stories are complete, with all requirements met. In addition, these can be used to support automation with tools like Chromatic and Applitools.

In order to get this going we'll need to get your NPM JS account setup and configured. We'll walk you through that now:

- (Creat a new organization)[https://www.npmjs.com/org/create] (a free plan will do for this, keep in mind that is public) in NPM.
  - You can create any organization name, and it will serve as the root of your package names. @{npmjs-organization}/{package-name}
  - We recommend to try and get organization names in GitHub and NPM JS in sync for management purposes.

We'll use the same repository we were working with in the last tutorial, add to it and tweak it.

Now we are going to need to create a new build pipeline to generate the NPM package.

```cli
fathym eac pipelines create "My Basic NPM Package Artifact" [options]
fathym eac sources pipeline attach {username/organization} my-new-repository {pipeline-lookup}
```

Next we will change the LCU for our application to target NPM artifacts instead of GitHub, and inform it which source to use, along with the version (or tag) to deploy.

```cli
fathym eac applications lcu {app-lookup} --type npm
```

Tag based deployments are key to our internal processes around QA and product validation. It allows us to automate deployments of features and bugs, keeping our QA environments ready to be tested at any moment.

Now we can commit all of our changes to the EaC at once.

```cli
fathym eac commit "Configured source and builds for {username/organization} my-new-repository"
fathym eac projects applications preview {project-lookup} {app-lookup}
```

This will override the previous build pipeline and GitHub action. Kicking off an automatic build that once complete will deploy the latest version of our application out for preview.

> **NOTE** - It's also pretty cool because you can use html in your markdown, allowing you to bring rich, tailwind styling and capabilities into your docs, blogs, and other static sites.

## Adding google analytics tracking and other thrid party libraries

## Bonus - working with the CLI

As you may have noticed, there is a lot of nesting and relationships to work with. It is possible, in many cases with the CLI, to set an "active" value. Take for example the following commands.

```cli
fathym eac projects create "My First Project"

fathym eac applications create "My Second Application"
fathym eac applications lcu {app-lookup} [options] --type github
fathym eac applications processor {app-lookup} [options]

fathym eac projects applications add {project-lookup} {app-lookup}

fathym eac commit "Configured second application in project"
fathym eac projects applications preview {project-lookup} {app-lookup}
```

And say you have multiple applications to add to the same project, or multiple other actions to take on applications within the project. Let's set the active project and applications in a couple of different ways.

```cli
fathym eac projects create "My First Project"
fathym eac projects set {project-lookup}

fathym eac applications create "My Second Application"
fathym eac applications set {app-lookup}
fathym eac applications lcu --type github
fathym eac applications processor

fathym eac projects applications add

fathym eac commit "Configured second application in project"
fathym eac projects applications preview
```

Let's talk through a bit of this. The project is created normally, same with the application. Then each uses the next line to `set` the active project and application respectively. After that, the only difference in the `lcu` and `processor` is we no longer need to to pass the {app-lookup} in to each call. We also don't need to pass the {project-lookup} or {app-lookup} to the `projects` based commands. You can of course pass the values in, and they will override any active values.

There is one more shorthand to use, and that is to inline the `set` operation when creating the project or application.

```cli
fathym eac projects create "My First Project" --set

fathym eac applications create "My Second Application" --set
```

To unset the values you can use the following commands.

```cli
fathym eac projects unset
fathym eac applications unset
```

There are other objects within the EaC that support this, use the `--help` on commands to see if they support setting active values.
