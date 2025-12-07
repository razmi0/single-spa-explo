import React from "react";
import ReactDOMClient from "react-dom/client";
import singleSpaReact from "single-spa-react";
import { cssLifecycleFactory } from "vite-plugin-single-spa/ex";
import { ErrorComponent, composeLifecycles } from "./utils";

const lc = singleSpaReact({
    React,
    ReactDOMClient,
    errorBoundary(err: unknown, _info: unknown, _props: unknown) {
        return <ErrorComponent props={{ err, _info, _props }} />;
    },
    // rootComponent: App,
    // use loadRootComponent attribute, instead of rootComponent, to ensure preamble code is injected into the root component before mounting.
    // see vite.config.ts for details on the preamble.
    loadRootComponent: async () => {
        const { default: App } = await import("./App");
        return App;
    },
    domElementGetter,
});

function domElementGetter() {
    const APPLICATION_NAME = "@demo/route-welcome";
    const APPLICATION_RENDERED_SUFFIX = "rendered";
    const APPLICATION_RENDERED_NAME = `${APPLICATION_NAME}_${APPLICATION_RENDERED_SUFFIX}`;

    let el = document.getElementById(APPLICATION_RENDERED_NAME);
    if (!el) {
        el = document.createElement("div");
        el.id = APPLICATION_RENDERED_NAME;
        const application = document.querySelector<HTMLDivElement>(`[id*="${APPLICATION_NAME}"]`);
        const host = application ?? document.body;
        host.appendChild(el);
    }

    return el;
}

export const { bootstrap, mount, unmount } = composeLifecycles(lc, cssLifecycleFactory("spa"));
