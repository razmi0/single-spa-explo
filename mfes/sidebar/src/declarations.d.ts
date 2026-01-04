declare module "*.svg" {
    const content: string;
    export default content;
}

declare module "*.png" {
    const content: string;
    export default content;
}

declare module "*.jpg" {
    const content: string;
    export default content;
}

declare module "*.jpeg" {
    const content: string;
    export default content;
}

declare module "*.gif" {
    const content: string;
    export default content;
}

declare module "*.webp" {
    const content: string;
    export default content;
}

declare module "*.css" {
    const content: Record<string, string>;
    export default content;
}

declare module "single-spa-css" {
    const content: {
        bootstrap: () => Promise<void>;
        mount: () => Promise<void>;
        unmount: () => Promise<void>;
    };
    export default content;
}

// const cssLifecycles = singleSpaCss({
//     // required: a list of CSS URLs to load
//     // can be omitted if webpackExtractedCss is set to true, do not specify Webpack extracted css files here
//     cssUrls: ["https://example.com/main.css"],

//     // optional: defaults to false. This controls whether extracted CSS files from Webpack
//     // will automatically be loaded. This requires using the ExposeRuntimeCssAssetsPlugin,
//     // which is documented below.
//     webpackExtractedCss: false,

//     // optional: defaults to true. Indicates whether the <link> element for the CSS will be
//     // unmounted when the single-spa microfrontend is unmounted.
//     shouldUnmount: true,

//     // optional: defaults to 5000. The number of milliseconds to wait on the <link> to load
//     // before failing the mount lifecycle.
//     timeout: 5000,

//     // optional: defaults to a standard <link rel="stylesheet" href="/main.css"> element
//     // Customize the creation of the link element that is used by single-spa-css by providing a
//     // function. For example, for setting the cross-origin or other HTML attributes on the <link>
//     createLink(url) {
//         const linkEl = document.createElement("link");
//         linkEl.rel = "stylesheet";
//         linkEl.href = url;
//         return linkEl;
//     },
// });
