import { useEffect, useState } from "react";
import { logMfeProps } from "../shared";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import type { MfeDefaultProps } from "./types/mfe-props";

const tools = ["vite", "react", "single-spa"];

const Logo = ({ href, src, name }: { href: string; src: string; name: string }) => {
    return (
        <a href={href} target="_blank" rel="noreferrer">
            <img src={src} className="logo" alt={name + " logo"} />
        </a>
    );
};

const Footer = ({ count, onClick }: { count: number; onClick: () => void }) => {
    return (
        <footer className="card">
            <button onClick={onClick}>count is {count}</button>
        </footer>
    );
};

export default function Root(props: MfeDefaultProps) {
    const { name, rootConfig } = props;
    const [count, setCount] = useState(0);
    const inc = () => {
        setCount((count) => count + 1);
    };

    useEffect(() => {
        logMfeProps(name, props);
    }, [name, props]);

    return (
        <>
            <div>
                <Logo href="https://vitejs.dev/" src={viteLogo} name="Vite" />
                <Logo href="https://18.react.dev/" src={reactLogo} name="React" />
                <Logo
                    href="https://single-spa.js.org/"
                    src="https://single-spa.js.org/img/single-spa-mark-magenta.svg"
                    name="Single-spa"
                />
            </div>
            <h2 style={{ margin: 0, padding: 0 }}>{name}</h2>
            <p style={{ margin: 0, padding: 0, textDecoration: "underline" }}>
                {tools.map((tool) => tool.charAt(0).toUpperCase() + tool.slice(1)).join(" + ")}
            </p>
            {rootConfig && (
                <p style={{ margin: "4px 0", fontSize: "0.75rem", opacity: 0.7 }}>
                    Root: {rootConfig.tech} ({rootConfig.mode})
                </p>
            )}
            <Footer count={count} onClick={inc} />
        </>
    );
}
