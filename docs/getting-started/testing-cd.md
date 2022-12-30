# Expanding your blog with Fathym

Using the zip deployment artifact can be a quick and easy way to get started with Fathym, but it may not be the most efficient or effective way to organize and manage your code over time. To make your code more manageable and scalable, it is often useful to set up a more permanent structure for your code using a version control system like Git, which can be hosted on a platform like GitHub. This allows you to track changes to your code over time, collaborate with others on your project, and easily roll back changes if necessary.

## CI/CD with GitHub and Fathym

Continuous integration (CI) and continuous deployment (CD) are key practices in the field of DevOps that help teams efficiently develop and deploy software. CI involves regularly integrating code changes into a shared repository, while CD involves automatically building, testing, and deploying code changes to production environments. These practices help teams identify and fix errors early in the development process, and allow them to deliver new features and updates more quickly and with fewer errors.

GitHub is a web-based platform used for version control, collaboration, and code hosting. Its features, such as issue tracking and project management, can be leveraged to support the CI/CD process. GitHub also provides GitHub Actions, which can be used to automate the CI/CD process. By using GitHub and Fathym together, you can set up automated workflows to build, test, and deploy your code whenever certain events occur, helping you streamline your development and deployment process and deliver new features and updates to users more efficiently.

Fathym helps to configure the repository for automated builds and deployments for testing on main/master, integration, feature, and hotfix branches. In addition to setting up the code and build phases, Fathym provides the necessary automation for release and deployment to streamline the code-to-deploy workflow. This allows teams to efficiently develop and deploy software, resulting in faster delivery of new features and updates to users.

## Get your code to GitHub

There For the reason mentioned above, we are going to move our code off of the file system. The first thing you'll need to do is authorize with GitHub. Head back into VS Code and into a terminal where we will auth the user of the CLI with GitHub (in the users global GitHub auth for the active EaC).

```cli
npx fathym github auth
```

This will open a new window with GitHub authorization where you can determine which organizations Fathym has access to (you may have to sign up if you have not before). Grant access to the organizations you'd like us to help you manage and automate.

> **NOTE** - You can run this command anytime you want to adjust the authorizations in GitHub for new or existing organizations.

Now we can initialize a new repository in your default user organization in GitHub.

```cli
npx fathym eac env sources {username/organization} create my-new-repository [options]
```

> **NOTE** - You can omit the `{username/organization}` whenever using your username and just call `npx fathym github {username/organization} create ...` instead.

Detail out which options were used and what they do.

This will initialize a new repository with Fathym's best practices (what we use for our own internal repositories), feel free to explore the other options available by adding `--help` to the command. The default will include a simple readme file and an MIT license.

Under the hood, this will also create a source control entry in the EaC to use in CI/CD automation.

## Configuring your Build Pipeline

As mentioned previously, there are many different ways to get your deployment artifacts into Fathym. You'll move from the zip deploy to something automated in GitHub. To do that, you'll configure a Build Pipeline for the new source control.

A Build Pipeline is a configuration of the build process. It is made up of a template and the parameters necessary to fullfill the chosen template. A source control can only have a single Build Pipeline while a Build Pipeline can have multiple source controls. This ensures understanding on how a source control is built, and allows you to make edits to a Build Pipeline that updates multiple source controls at the same time (like a standard React build), keeping your GitHub Actions in sync as your architecture evolves.

```cli
npx fathym eac env pipelines create "My Basic Package Artifact" [options]
```

Detail out which options were used and what they do.

After creating the Build Pipeline you can now attach it to the source control.

```cli
npx fathym eac env sources {username/organization} my-new-repository attach pipeline {pipeline-lookup} --auto-deploy
```

Once you attach the Build Pipeline to the source control, a new GitHub Action will be created based on the configuration of the Build Pipeline. This should kick of a build automatically based on the new build pipeline action.

> **NOTE** - If the GitHub Action does not start automatically, you may need to enable actions for your repository. Once doing that, a build will start on your next committed change.

This is a big step for yourself and/or team, as you've setup a complete continuous integration workflow to validate your project builds.

2. YOu have setup a continuous deployment workflow for yourself so that on changes, your repo updates automatically.

## Cracking open the source control

Clone the repository

You'll notice after cloning that the `integration` branch is the initially selected branch. This is a part of the repository setup we did for you. Your `main` branch is locked down, and can only be merged to with a Pull Request. This ensures that your `main` branch stays pure and its changes are fully understood.

In addition the `integration` branch has been locked down so that you can not directly commit changes to it. This pushes development into one of two different branch types; features and hotfixes.

Feature branches (prefixed with `feature/`) are the main type of branch you will work with and stem from `integration`. Feature branches are use for local development and in low/no code tooling.

Hotfix branches (prefixed with `hotfix/`) are used to patch your `main` branch with bugs and other fixes that cannot wait for the next full release of integration.

By using a mature branching strategy, you not only get full control and insight into the changes you are making, but also gain the ability to test by branch. This is important as branches will often align with things like tasks, stories and bugs, making each branch a logical thread of ideation from code to test to deployment.

## Let's continue with the blog

Alright, so we have our continuous integration flow in place, and a better understanding of how our branching strategy works (don't worry if you don't get it yet, hopefully it will all come together shortly)
