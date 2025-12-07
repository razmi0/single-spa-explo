import React from "react";
import ReactDOMClient from "react-dom/client";
import singleSpaReact from "single-spa-react";
import { cssLifecycleFactory } from "vite-plugin-single-spa/ex";
import { ErrorComponent, composeLifecycles } from "./utils";

const singleSpaLifeCycle = singleSpaReact({
    React,
    ReactDOMClient,
    errorBoundary(err: unknown, _info: unknown, _props: unknown) {
        return <ErrorComponent props={{ err, _info, _props }} />;
    },
    rootComponent: () => null,
});

export const { bootstrap, mount, unmount } = composeLifecycles(singleSpaLifeCycle, cssLifecycleFactory("spa"));

export { DummyComponent, title } from "./utils";
