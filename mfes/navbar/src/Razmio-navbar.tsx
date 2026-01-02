import React from "react";
import ReactDOMClient from "react-dom/client";
import singleSpaReact from "single-spa-react";
import { cssLifecycleFactory } from "vite-plugin-single-spa/ex";

const singleSpaLifeCycle = singleSpaReact({
    React,
    ReactDOMClient,
    errorBoundary(err: unknown, info: unknown, props: unknown) {
        return (
            <div>
                <h1>Navbar Error</h1>
                <pre>{JSON.stringify({ err, info, props }, null, 2)}</pre>
            </div>
        );
    },
    loadRootComponent: async () => {
        const { default: Root } = await import("./root.component");
        return Root;
    },
});

const cssLifecycle = cssLifecycleFactory("Razmio-navbar");

export const { bootstrap, mount, unmount } = {
    bootstrap: [cssLifecycle.bootstrap, singleSpaLifeCycle.bootstrap],
    mount: [cssLifecycle.mount, singleSpaLifeCycle.mount],
    unmount: [cssLifecycle.unmount, singleSpaLifeCycle.unmount],
};

