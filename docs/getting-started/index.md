# Getting Started

...

## What's that? How did we build these docs?

Great question, let's start there, but we'll simplify it a bit, as these docs are actually part of a larger [project](https://github.com/fathym/eac/docs).

It may seem these days, that to build visually rich frontends, you need a feature rich javascript framework like React, Svelte, or Angular. While these do boost productivity for certain types of applications (SPAs, highly interactive), it may seem like overkill to use a large framework like next.js for every statically generated site.

For some doc and blog sites, markdown is all that is really needed. With markdown in hand, it can be converted to html, styled with a lightweight system like [TailwindCSS](https://tailwindcss.com/docs/typography-plugin) and via a small amount of management, a blog is born with a github file based CMS.

## Let's Build a Blog

Open your favorite IDE, we use [VS Code](https://code.visualstudio.com/download) for most of our open source projects, and navigate to a folder of your choice.  

You may be used to opening up a command prompt, globally installing a custom CLI, and executing their create or init command, but we're going to go a more basic route to start.

Just to show, nothing up our sleeves.

We still need to open a command prompt in the location we chose and run

```cli
npx make-dir-cli test
cd test
```

> **NOTE** - We used `npx make-dir-cli` and will use  `npx touch` in a moment.  We do this to support cross platform instructions (since we assume node.js will
be installed). You will need node.js installed to complete these docs. Users that know their system commands can use those.

Next we run 
```cli
npm init -y
```

This will create a package.json file, nothing for us to do there yet. Create a new `README.md` file

```cli
npx touch README.md
```

Let's open that up and add some basic markdown (feel free to explore and write your own)

```markdown
# Welcome to our Blog

This is our new blog built on a static runtime.
```

There are a few core features of Fathym you've worked with here; created your first LCU, pulled together your first deploy artifact, and have seen how Fathym can host it for us to share.

Ok, so we do have something up our sleeves.  To make all of this possible in the current example, we use the free, hosted version of Fathym's Runtime.  There is a lot to this, but nothing for us to bore you with here.


