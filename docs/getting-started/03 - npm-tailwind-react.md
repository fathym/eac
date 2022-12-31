# Bringing the blog to life

## Let's bring in TailwindCSS and React

Tailwind CSS is a utility-first CSS framework that allows developers to build custom user interfaces more quickly and easily using pre-designed styles and layout options. This helps to reduce the time and effort required to create visually appealing interfaces, and makes it easier to create consistent and professional-looking designs without having to write a lot of custom CSS.

React is a JavaScript library that allows developers to create reusable components and build complex user interfaces using a declarative approach. This makes it easier to develop and maintain large applications, as it allows developers to create reusable components that can be easily combined to build complex user interfaces.

The combination of Tailwind CSS and React can help developers build responsive, lightweight, and fast web applications that are efficient, scalable, and maintainable, which can help to reduce development time and improve the overall performance of the applications.

Now we can update our `index.html` with something more visually rich and look at bringing in some react interactivity.

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>My Fathym App</title>

        <script src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,line-clamp"></script>
        <script src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
        <script
            src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"
        >

            <script>
                tailwind.config = {
                    theme: {
                        extend: {},
                    },
                };
        </script>
    </head>
    <body
        class="font-sans font-normal leading-relaxed font-base dark:text-gray-100 text-gray-800 prose dark"
    >
        <div id="fathym-inject">
            <h1>Content Not Found</h1>

            <p>The content you are trying to access is not available.</p>
        </div>

        <div id="drawer"></div>

        <script>
            // Create the Drawer component
            const Drawer = () => {
                // Use the useState hook from the global React object to store the state of the drawer
                const [isOpen, setIsOpen] = React.useState(false);

                // Toggle the state of the drawer when the button is clicked
                const toggleDrawer = () => {
                    setIsOpen(!isOpen);
                };

                // Return the JSX for the component
                return (
                    <>
                        {/* Button to toggle the drawer */}
                        <button
                            class="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            onClick={toggleDrawer}
                        >
                            Toggle Drawer
                        </button>

                        {/* Drawer component */}
                        <aside
                            style={{
                                left:
                            }}
                            className={`fixed z-[1] top-0 bg-slate-700 text-gray-200 drop-shadow h-full w-[300px] ${isOpen ? "left-0" : "left-[-300px]"}`}
                        >
                            {/* Drawer content goes here */}
                            An awesome react drawer along side tailwind
                        </aside>
                    </>
                );
            };

            // Render the Drawer component to the DOM
            ReactDOM.render(<Drawer />, document.getElementById("drawer"));
        </script>
    </body>
</html>
```

Typically this isn't how you'd would bring in TailwindCSS and React, but in the case of tinkering, you can.

It's also pretty cool because you can use html in your markdown, allowing you to bring rich styling and capabilities into your docs, blogs, and other static sites.

## Deployment artifacts with NPM packages

When using the GitHub build artifact as your deployment artifact, there is one limiting factor, and that is the retention time on those artifacts. While not common to jump back several versions that might be outdated, it is possible that the current version, if unchanged for longer than the retention time, will itself not be deployable. One of the key benefits of hosting with fathym is being able to host any version of your artifact, on any route, based on your needs (production, staging, test, etc.).

Using NPM packages, we can maintain a complete deployment history. Using NPM tags, we can create a simple way for qa, dev, and product owners to work together to validate stories are complete through all requirements. In addition, these can be used to support automation with tools like Chromatic and Applitools.

There are a couple steps that Fathym just can't automate, and we'll walk you through those now:

1. (Create a new organization)[https://github.com/organizations/plan] (a free plan will do for this, keep in mind that is public) in GitHub. We think its important to look for organization names that are also available at npmjs.org. We use this at Fathym to keep our repos and npm packages aligned for simplicity
2. (Creat a new organization)[https://www.npmjs.com/org/create] (a free plan will do for this, keep in mind that is public) in NPM.

Now we are going to need to create a new build pipeline to generate the NPM package.

```cli
npx fathym eac pipelines create "My Basic NPM Package Artifact" [options]
npx fathym eac sources {username/organization} my-new-repository attach pipeline {pipeline-lookup}
```

Next we will change the LCU for our application to target NPM artifacts instead of GitHub, and inform it which source to use, along with the version (or tag) to deploy.

```cli
npx fathym eac applications {app-lookup} lcu --type npm
```

Tag based deployments are key to our internal processes around QA and product validation. It allows us to automate deployments of features and bugs, keeping our QA environments ready to be tested at any moment.

Now we can commit all of our changes to the EaC at once.

```cli
npx fathym eac commit -m "Configured source and builds for {username/organization} my-new-repository"
npx fathym eac projects {project-lookup} applications {app-lookup} preview
```

This will override the previous build pipeline and GitHub action. Kicking off an automatic build that once complete will deploy the latest version of our application out for preview.

## Adding google analytics tracking and other thrid party libraries

## Bonus - working with the CLI

As you may have noticed, there is a lot of nesting and relationships to work with. It is possible, in many cases with the CLI, to set an "active" value. Take for example the following commands.

```cli
npx fathym eac projects create "My First Project"

npx fathym eac applications create "My Second Application"
npx fathym eac applications {app-lookup} lcu [options] --type github
npx fathym eac applications {app-lookup} processor [options]

npx fathym eac projects {project-lookup} applications {app-lookup} add
npx fathym eac commit -m "Configured second application in project"
npx fathym eac projects {project-lookup} applications {app-lookup} preview
```

And say you have multiple applications to add to the same project, or multiple other actions to take on applications within the project. Let's set the active project and applications in a couple of different ways.

```cli
npx fathym eac projects create "My First Project"
npx fathym eac projects {project-lookup} set

npx fathym eac applications create "My Second Application"
npx fathym eac applications {app-lookup} set
npx fathym eac applications lcu --type github
npx fathym eac applications processor


npx fathym eac projects applications add
npx fathym eac commit -m "Configured second application in project"
npx fathym eac projects applications preview
```

Let's talk through a bit of this. The project is created normally, same with the application. Then each uses the next line to `set` the active project and application respectively. After that, the only difference in the `lcu` and `processor` is we no longer need to to pass the {app-lookup} in to each call. We also don't need to pass the {project-lookup} or {app-lookup} to the `projects` based commands. You can of course pass the values in, and they will override any active values.

There is one more shorthand to use, and that is to inline the `set` operation when creating the project or application.

```cli
npx fathym eac projects create "My First Project" --set

npx fathym eac applications create "My Second Application" --set
```

To unset the values you can use the following commands.

```cli
npx fathym eac projects unset
npx fathym eac applications unset
```

There are other objects within the EaC that support this, use the `--help` on commands to see if they support setting active values.
