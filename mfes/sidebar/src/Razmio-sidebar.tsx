import React from "react";
import ReactDOMClient from "react-dom/client";
import singleSpaReact from "single-spa-react";
import Root from "./root.component";

const lifecycles = singleSpaReact({
    React,
    ReactDOMClient,
    rootComponent: Root,
    errorBoundary(err: unknown, info: unknown, props: unknown) {
        return (
            <div>
                <h1>Error</h1>
                <pre>{JSON.stringify({ err, info, props }, null, 2)}</pre>
            </div>
        );
    },
});

export const { bootstrap, mount, unmount } = lifecycles;
