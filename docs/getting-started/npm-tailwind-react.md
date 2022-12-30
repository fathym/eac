# Bringing the blog to life

## Let's bring in TailwindCSS

Tailwind CSS is a utility-first CSS framwork

Now we can update our html with something more visually rich

```html

```

It's also pretty cool because you can use html in your markdown, allowing you to bring rich styling and capabilities into your static sites.

## Deployment artifacts with NPM packages

When using the GitHub build artifact as your deployment artifact, there is one limiting factor, and that is the retention time on those artifacts. While not common to jump back several versions that might be outdated, it is possible that the current version, if unchanged for longer than the retention time, will itself not be deployable. One of the key benefits of hosting with fathym is being able to host any version of your artifact, on any route, based on your needs (production, staging, test, etc.).

Using NPM packages, we can maintain a complete deployment history. Using NPM tags, we can create a simple way for qa, dev, and product owners to work together to validate stories are complete through all requirements. In addition, these can be used to support automation with tools like Chromatic and Applitools.

There are a first few steps that Fathym just can't automate, and we'll walk you through those now:

1. (Create a new organization)[https://github.com/organizations/plan] (a free plan will do for this, keep in mind that is public) in GitHub. We think its important to look for organization names that are also available at npmjs.org. We use this at Fathym to keep our repos and npm packages aligned for simplicity
2. (Creat a new organization)[https://www.npmjs.com/org/create] (a free plan will do for this, keep in mind that is public) in NPM.

Now we are going to need to create a new build pipeline to generate the NPM package.

```cli
npx fathym eac pipelines create "My Basic NPM Package Artifact" [options]
npx fathym eac sources {username/organization} my-new-repository attach pipeline {pipeline-lookup}
npx fathym eac commit -m "Configured source and builds for {username/organization} my-new-repository"
```

This will override the previous build pipeline and GitHub action.

## Adding google analytics tracking and other thrid party libraries
