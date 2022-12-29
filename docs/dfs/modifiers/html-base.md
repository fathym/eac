# HTML Base Modifier

The <base> element is an HTML5 element that specifies the base URL for all relative URLs in a document. It is typically used in the <head> of an HTML document and only needs to be included once. The href attribute of the <base> element specifies the base URL for all relative URLs in the document.

The Fathym Runtime's HtmlBaseMod is a module that is responsible for managing the <base> element in an HTML document. It is designed to make it easy to build single page applications (SPAs) that are hosted on any path of a domain and function correctly. In order to use the HtmlBaseMod with a framework such as Create React App, you can set the homepage value in the package.json file to '.'. This will allow the build output to run on any path. The HtmlBaseMod is installed automatically and its value is set automatically based on the current application route.

```json
{
    "name": "my-app",
    "version": "1.0.0",
    "homepage": ".",
    "scripts": {
        "start": "react-scripts start",
        "build": "react-scripts build",
        "test": "react-scripts test",
        "eject": "react-scripts eject"
    }
}
```

I hope this helps to clarify how the <base> element and the HtmlBaseMod can be used together to manage the base URL in an HTML document, particularly when building SPAs with a framework such as Create React App. Please let me know if you have any more questions!
