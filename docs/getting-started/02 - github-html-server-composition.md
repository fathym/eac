# Expanding your blog with Fathym

Using the zip deployment artifact can be a quick and easy way to get started with Fathym, but it may not be the most efficient or effective way to organize and manage your code over time. To make your code more manageable and scalable, it is often useful to set up a more permanent structure for your code using a version control system like Git, which can be hosted on a platform like GitHub. This allows you to track changes to your code over time, collaborate with others on your project, and easily roll back changes if necessary.

## CI/CD with GitHub and Fathym

Continuous integration (CI) and continuous deployment (CD) are key practices in the field of DevOps that help teams efficiently develop and deploy software. CI involves regularly integrating code changes into a shared repository, while CD involves automatically building, testing, and deploying code changes to production environments. These practices help teams identify and fix errors early in the development process, and allow them to deliver new features and updates more quickly and with fewer errors.

GitHub is a web-based platform used for version control, collaboration, and code hosting. Its features, such as issue tracking and project management, can be leveraged to support the CI/CD process. GitHub also provides GitHub Actions, which can be used to automate the CI/CD process. By using GitHub and Fathym together, you can set up automated workflows to build, test, and deploy your code whenever certain events occur, helping you streamline your development and deployment process and deliver new features and updates to users more efficiently.

Fathym helps to configure the repository for automated builds and deployments for testing on main/master, integration, feature, and hotfix branches. In addition to setting up the code and build phases, Fathym provides the necessary automation for release and deployment to streamline the code-to-deploy workflow. This allows teams to efficiently develop and deploy software, resulting in faster delivery of new features and updates to users.

## Get your code to GitHub

For the reason mentioned above, we are going to move our code off of the file system. The first thing you'll need to do is authorize with GitHub. Head back into VS Code and into a terminal where we will auth the user of the CLI with GitHub (in the user's global GitHub auth for the active EaC).

```cli
fathym git auth
```

This will open a new window with GitHub authorization where you can determine which organizations Fathym has access to (you may have to sign up if you have not before). Grant access to the organizations you'd like us to help you manage and automate.

> **NOTE** - You can run this command anytime you want to adjust the authorizations in GitHub for new or existing organizations.

Now we can initialize a new repository in your EaC.

```cli
fathym eac sources create my-new-repository
```

> **NOTE** - If you want to target a specific organization add the `{organization}` to the command: `fathym eac sources create {organization} ...`. This works for all `fathym eac sources` commands.

Detail out which options were used and what they do.

This will initialize a new repository with Fathym's best practices (what we use for our own internal repositories). Explore the other options available by adding `--help` to the command. The default create will include a simple `README.md` file and MIT `LICENSE` file.

Under the hood, this will also create a source control entry in the EaC to use in CI/CD automation.

## Configuring your build pipeline

As mentioned previously, there are many different ways to get your deployment artifacts into Fathym. You'll move from the zip deploy to something automated in GitHub. To do that, you'll configure a build pipeline for the new source control.

A build pipeline is a configuration of the build process. It is made up of a template and the parameters necessary to fullfill the chosen template. A source control can only have a single build pipeline while a build pipeline can have multiple source controls. This ensures understanding on how a source control is built, and allows you to make edits to a build pipeline that update multiple source controls at the same time (like a standard React build). This helps keep your GitHub Actions in sync as your architecture evolves.

```cli
fathym eac pipelines create "My Basic Package Artifact" [options]
```

Detail out which options were used and what they do.

After creating the build pipeline you can now attach it to the source control.

```cli
fathym eac sources pipeline attach {username/organization} my-new-repository {pipeline-lookup}
```

Now, we need to commit all of our EaC changes for the source and build pipelines.

```cli
fathym eac commit "Configured source and builds for {username/organization} my-new-repository"
```

Once the commit completes the source will be created with a new GitHub Action. It should start and run automatically.

> **NOTE** - If the GitHub Action does not start automatically, you may need to enable actions for your repository. Once done, a build will start on your next committed change (which we will do shortly).

This is a big step for yourself and/or team, as you've set up a complete continuous integration workflow to automate your project builds. You've also laid the ground work for continuous deployment.

## Cracking open the source control

The next step is going to be cloning your repository. Navigate into the folder where you want to clone the repository.

> **NOTE** - As good practice, we like to create a root folder for our `sources`, under that a `public` and `private` folder, followed by folders in each of those representing the username/organization. So if you have a public repository named my-new-repository, you would could head into a folder `{path-on-system}\sources\public\{username/organization}`. When cloned, the repository folder will exist in the {username/organization} folder.

Now clone the repository.

```cli
fathym git clone  {username/organization} my-new-repository
```

You'll notice after cloning that the `integration` branch is the initially selected branch. This is part of the repository setup we did for you, where integration is the default.

Your `main` branch is locked down, and can only be merged to with a pull request. This ensures that your `main` branch stays pure and its changes can be related to what is in production.

In addition, the `integration` branch has been locked down so that you cannot directly commit changes to it. This pushes development into one of two different branch types: features and hotfixes.

Feature branches (prefixed with `feature/`) are the main type of branch you will work with and stem from `integration`. Feature branches are used for local development and in low/no code tooling.

Hotfix branches (prefixed with `hotfix/`) are used to patch your `main` branch with bugs and other fixes that cannot wait for the next full release of integration.

By using a mature branching strategy, you not only get full control of and insight into the changes you are making, but also gain the ability to test by branch. This is important as branches will often align with things like tasks, stories and bugs, making each branch a focused thread of work from code to test to deployment.

> **NOTE** - None of the branching strategy is required to work with Fathym, this is a jumping off point for new users and teams, or a new way for experienced developers to look anew. If you have a branching strategy you already use, continue with it. You'll see as we move forward how this structure supports other aspects of the DevOps workflow.

## Let's continue with the blog

Now you have a continuous integration flow in place and a better understanding of how your branching strategy is configured, so let's start using it all.

First, create a new branch in your repository.

```cli
fathym git feature add-index-html-template
```

You'll notice you are now on the feature/add-index-html-templates branch and we can start coding. Add a new index.html file.

```cli
npx touch index.html
```

Then open that file and set some boilerplate HTML.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>My Fathym App</title>
  </head>
  <body>
    <div id="fathym-inject">
      <h1>Content Not Found</h1>

      <p>The content you are trying to access is not available.</p>
    </div>
  </body>
</html>
```

Take note of the div with id `fathym-inject`, you'll need this id later when configuring Fathym Runtime composition.

Update the `README.md` file with whatever markdown you want to use.

Now you are ready to check in and push your code.

```cli
fathym git commit "Added index.html template"
```

We leverage the above command from Fathym so that no individual developer is responsible for remembering the equivelant git commands to run:

```cli
git add .
git commit "Added index.html template"
git checkout integration
git pull
git checkout -
git rebase integration
git push origin
git fetch --prune
```

> **NOTE** - You can also use the `fathym git` command without a message to execute a sync, skipping the add and commit commands above.

Upon pushing your changes to the repository, you'll be able to see the build in progress. You can view this in the Actions tab of the repository on GitHub. Alternatively, you can use your Fathym [enterprise feed](https://www.fathym.com/dashboard/activity) to see all build activity (and more) at a glance.

## Deploy the GitHub artifact

The build should complete very quickly because you aren't really building anything. You'll notice, if you look at your action file, that it is simply exporting everything at the root of your repository as a GitHub build artifact.

In order to deploy that artifact, you'll need to create a new application again, this time for our GitHub sample.

> **NOTE** - If you haven't created a project yet, head to the [previous walkthrough](./overview.md). If you don't have your project lookup and need to find it, you can use `fathym eac projects list`.

```cli
fathym eac applications create "My Second Application"
fathym eac applications lcu {app-lookup} --type github
fathym eac applications processor {app-lookup}
fathym eac projects applications add {project-lookup} {app-lookup}
fathym eac commit "Configured second application in project"
fathym eac projects applications preview {project-lookup} {app-lookup}
```

Notice the source control being attached to the application, this sets the application up to recieve automatic deployments and will alter the action for this purpose.

That's it. Use the printed preview URL once available and you should see the contents of your index.html file. You might be wondering where the markdown is, but don't worry, we're about to configure the system to render the markdown.

## Exploring the Distributed File System (DFS) and Modifiers

We won't go into too much detail on the DFS yet, but it's important to note that when your deployment artifacts are uploaded to Fathym they are stored in the DFS. The Fathym Runtime then works with the DFS to determine which files to serve for a given request.

Once a file is chosen for a request it will pass through any configured modifiers. These modifiers will act on the file to change it (minify, compress), augment it (google analytics tracking, cookie consent integration), or compose it (wordpress, markdown, BaseHref).

> **NOTE** - You can head in to the [DFS and Modifiers](./dfs/overview.md) to learn more.

## Configuring the markdown composition

In order to enable markdown composition with your index.html file, you'll need to setup a couple of different modifiers. One will convert any markdown to HTML using the Markdown to Html Modifier. The other one, the HTML Inject Modifier, will format it into the defined template.

First you'll configure the modifier for markdown to html.

```cli
fathym eac modifiers create "Markdown to HTML" --pathFilter "*.(md|mdx)" --priority 500 --type MarkdownToHTML --details "{}"
```

The priority will become important once we configure the second modifier to ensure they execute in the correct order. Higher priority modifiers execute first, then lower priority. Modifiers with the same priority execute in parallel.

Next you will configure the modifier that will inject the formatted markdown into the HTML template.

```cli
fathym eac modifiers create "Markdown Injector" --pathFilter "*index.html" --priority 400 --type HtmlInjector --details "{}"
```

With both modifiers created, you'll need to add the modifier for use. There are two ways to do this. First, you can add a modifier at the application level so that it only executes when the given application executes. Otherwise, you can add a modifier at the project level so that it executes for all applications in the project.

We'll add the markdown to HTML modifier to the project, and then add the HTML injector to our specific application.

```cli
fathym eac projects modifiers add {project-lookup} {modifier-lookup}

fathym eac applications modifiers add {app-lookup} {modifier-lookup}
```

This will create the final aspect of our initial modifier flow, and once committed, you'll be able to preview it in your browser

```cli
fathym eac commit "Configured second application in project"
fathym eac projects applications preview {project-lookup} {app-lookup}
```

## What's Next?

There is a lot that you have set up over the course of these walkthroughs. You've created a complete CI/CD workflow to take you through code-to-deploy. Next, you'll expand what you've been doing with this blog to bring in some interactivity and bring in TailwindCSS. We'll also introduce one more type of deployment artifact, the one our team prefers: NPM.

## Bonus - Global Edge CDN

When deploying with Fathym, your solutions are delivered via Azure Global Edge CDN – bringing your information closer to all your users.
