export const title = "Vite Single-SPA React Microfrontend";

export const DummyComponent = () => {
    return (
        <div
            style={{
                color: "green",
                marginBottom: 20,
                border: "2px solid green",
                padding: 20,
            }}>
            This component is shared between applications and is imported via the root config import map.
        </div>
    );
};

export const ErrorComponent = <T,>(props: T) => {
    return (
        <div>
            <h1>Error</h1>
            <pre>{JSON.stringify(props, null, 2)}</pre>
        </div>
    );
};

type Lifecycle<T> = {
    bootstrap: () => Promise<T>;
    mount: () => Promise<T>;
    unmount: () => Promise<T>;
};
export const composeLifecycles = <T, P>(singleSpaLifeCycle: Lifecycle<T>, cssLifecycle: Lifecycle<P>) => {
    return {
        bootstrap: [cssLifecycle.bootstrap, singleSpaLifeCycle.bootstrap],
        mount: [cssLifecycle.mount, singleSpaLifeCycle.mount],
        unmount: [cssLifecycle.unmount, singleSpaLifeCycle.unmount],
    };
};
