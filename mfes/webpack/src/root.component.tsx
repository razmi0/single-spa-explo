import { useState } from "react";
import webpackLogo from "../public/webpack.png";
import reactLogo from "./assets/react.svg";

const tools = ["webpack", "react", "single-spa"];

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

export default function Root({ name }: { name: string }) {
    const [count, setCount] = useState(0);
    const inc = () => setCount((count) => count + 1);
    return (
        <>
            <div>
                <Logo href="https://webpack.js.org/" src={webpackLogo} name="Webpack" />
                <Logo href="https://18.react.dev/" src={reactLogo} name="React" />
                <Logo
                    href="https://single-spa.js.org/"
                    src="https://single-spa.js.org/img/single-spa-mark-magenta.svg"
                    name="Single-spa"
                />
            </div>
            <h2 style={{ margin: 0, padding: "0px" }}>{name}</h2>
            <p style={{ margin: 0, padding: 0, textDecoration: "underline" }}>
                {tools.map((tool) => tool.charAt(0).toUpperCase() + tool.slice(1)).join(" + ")}
            </p>
            <Footer count={count} onClick={inc} />
        </>
    );
}
