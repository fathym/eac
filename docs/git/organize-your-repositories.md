# Organize Your Repositories

Explanation of creating a set of locations for your repositories:

sources > github > {organization} > {repository}
sources > gitlab > {organization} > {repository}
sources > {company} > {organization} > {repository}

> **NOTE** - As good practice, we like to create a root folder for our `sources`, under that a `public` and `private` folder, followed by folders in each of those representing the username/organization. So if you have a public repository named my-new-repository, you would could head into a folder `{path-on-system}\sources\public\{username/organization}`. When cloned, the repository folder will exist in the {username/organization} folder.

You'll notice after cloning that the `integration` branch is the initially selected branch. This is part of the repository setup we did for you, where integration is the default.

Your `main` branch is locked down, and can only be merged to with a pull request. This ensures that your `main` branch stays pure and its changes can be related to what is in production.

In addition, the `integration` branch has been locked down so that you cannot directly commit changes to it. This pushes development into one of two different branch types: features and hotfixes.

Feature branches (prefixed with `feature/`) are the main type of branch you will work with and stem from `integration`. Feature branches are used for local development and in low/no code tooling.

Hotfix branches (prefixed with `hotfix/`) are used to patch your `main` branch with bugs and other fixes that cannot wait for the next full release of integration.

By using a mature branching strategy, you not only get full control of and insight into the changes you are making, but also gain the ability to test by branch. This is important as branches will often align with things like tasks, stories and bugs, making each branch a focused thread of work from code to test to deployment.

> **NOTE** - None of the branching strategy is required to work with Fathym, this is a jumping off point for new users and teams, or a new way for experienced developers to look anew. If you have a branching strategy you already use, continue with it. You'll see as we move forward how this structure supports other aspects of the DevOps workflow.
