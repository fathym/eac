# Going Cloud with Fathym and Azure

To this point, we've been using the shared environment that Fathym offers to deliver our applications. We are going to continue using that for our frontend hosting, but we want to start adding some cloud features to our application.

Working with cloud technologies can be a mind numbing task. You may have a fleet of cloud engineers to deploy or perhaps a hero that understands the cloud; if that's the case, you can still benefit from what Fathym will do for you in the cloud. If that isn't the case, and you're just starting out with the cloud, we've got you covered as well.

## Connecting to Azure

The first step in 'going cloud' is getting connected with Azure. This typically requires an account with Azure, billing profiles, and a created subscription. If you don't have any of that, no worries, we'll get you going now. Start by running the following command.

```cli
fathym eac env clouds azure define -g
```

The cli will make sure the Azure cli is installed, and prompt you to log in with Azure. Once that is done, you'll be able select from your list of available subscriptions.

If you have a subscription set up you can select that, or otherwise create a new subscription. The subscription you create will be in the Fathym tenant and billing profile, and Fathym will bill you for its usage. You will have access to this subscription as an Azure `Contributor` role.

This command does a little more than just create a cloud draft. The `-g` also creates a service principal in your subscription that Fathym uses to manage Azure for your organization.

With this process completed, let's commit our changes and make our cloud connection available.

```cli
fathym eac commit "Azure Cloud Connection"
```

## Alfresco Community Quick Launch

We've seen throughout this guide how to use LCU packages to update and work with our EaC. In many cases, we were only making minor changes to our enterprise setup. LCU packages can by much larger than these small building blocks, and can serve to provision entire product offerings spanning server and client technologies.

Let's do this now, using an LCU package that can easily launch Alfresco Community edition. Run this command to start the LCU package wizard. Agree to the usage of the Azure Marketplace VM image, then let's choose to create a new project, then select the cloud created in the previous step, followed by setting the resource name to something like lcu-alf-test-1. Don't use that exact name as the resource name must be globally unique across all users.

```cli
fathym lcu @fathym-hyland/lcu-alfresco-community-on-azure
```

This will start the first phase of the LCU package. Once that is done you will be prompted to create an SSH Key. This will allow the 2nd and 3rd phases to complete. Once done, take note of and copy the admin password. We'll need that to log in to the Alfresco admin and custom angular site.

## Looking at what's been deployed

Open up your dashboard and navigate to the project that was created for Alfresco Community.

```cli
fathym enterprises dashboard
```

You'll see that 4 routes have been deployed. Its also important to note that the custom application is developed in Angular, illustrating how any modern framework for JS will work with Fathym's hosting, and that it is easy to compose different frameworks into unified experiences.
