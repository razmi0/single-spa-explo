import { useEffect, useState } from "react";
import type { MfeDefaultProps } from "./types/mfe-props";

const tools = ["rspack", "react", "single-spa"];

export default function Root(props: MfeDefaultProps) {
    const { name, rootConfig, getLoadedApps, mfeRegistry } = props;
    const [count, setCount] = useState(0);

    const inc = () => setCount((c) => c + 1);

    useEffect(() => {
        if (rootConfig?.mode === "development") {
            console.log(`[${name}] Props received:`, {
                rootConfig,
                loadedApps: getLoadedApps?.(),
                mfeRegistry,
            });
        }
    }, [name, rootConfig, getLoadedApps, mfeRegistry]);

    return (
        <>
            <div>
                <a href="https://rspack.rs/" target="_blank" rel="noreferrer">
                    <img src="https://assets.rspack.rs/rspack/favicon-128x128.png" className="logo" alt="Rspack logo" />
                </a>
                <a href="https://react.dev/" target="_blank" rel="noreferrer">
                    <img src="https://react.dev/favicon.ico" className="logo" alt="React logo" />
                </a>
                <a href="https://single-spa.js.org/" target="_blank" rel="noreferrer">
                    <img
                        src="https://single-spa.js.org/img/single-spa-mark-magenta.svg"
                        className="logo"
                        alt="Single-spa logo"
                    />
                </a>
            </div>
            <h2 style={{ margin: 0 }}>{name}</h2>
            <p style={{ margin: 0, textDecoration: "underline" }}>
                {tools.map((t) => t.charAt(0).toUpperCase() + t.slice(1)).join(" + ")}
            </p>
            {rootConfig && (
                <p style={{ margin: "4px 0", fontSize: "0.75rem", opacity: 0.7 }}>
                    Root: {rootConfig.tech} ({rootConfig.mode})
                </p>
            )}
            <footer className="card">
                <button onClick={inc}>count is {count}</button>
            </footer>
        </>
    );
}
