import { useEffect, useMemo, useState } from "react";
import { navigateToUrl } from "single-spa";
import { logMfeProps } from "../shared";
import "./styles/sidebar.css";
import type { MfeDefaultProps } from "./types/mfe-props";

interface NavItem {
    id: string;
    label: string;
    path: string;
    displayPath?: string;
    external?: boolean;
}

interface NavSection {
    title?: string;
    items: NavItem[];
}

const navSections: NavSection[] = [
    {
        items: [
            { id: "home", label: "Home", path: "/", displayPath: "/" },
            {
                id: "dashboard",
                label: "Dashboard",
                path: "https://single-spa-explo.vercel.app/",
                displayPath: "↗",
                external: true,
            },
        ],
    },
    {
        title: "Microfrontends",
        items: [
            { id: "vite", label: "Vite", path: "/vite", displayPath: "/vite" },
            { id: "webpack", label: "Webpack", path: "/webpack", displayPath: "/webpack" },
            { id: "rspack", label: "Rspack", path: "/rspack", displayPath: "/rspack" },
        ],
    },
];

export default function Root(props: MfeDefaultProps) {
    const { name, rootConfig, defaultRoots } = props;
    const [activeItem, setActiveItem] = useState(() => {
        const path = window.location.pathname;
        if (path === "/") return "home";
        return path.split("/").filter(Boolean)[0] || "home";
    });

    useEffect(() => {
        logMfeProps(name, props);
    }, [name, props]);

    const navSectionsWithRootsLinks = useMemo(() => {
        const env = rootConfig?.mode.startsWith("dev") ? "dev" : "prod";
        const otherRoots = Object.entries(defaultRoots).map(([key, value]) => ({
            id: key,
            label: key.charAt(0).toUpperCase() + key.slice(1),
            path: value[env],
            displayPath: "↗",
            external: true,
        }));
        return [
            ...navSections,
            {
                title: "Other roots",
                items: otherRoots,
            },
        ];
    }, [defaultRoots, rootConfig?.mode]);

    const handleNavClick = (item: NavItem) => {
        if (item.external) {
            window.open(item.path, "_self", "noopener,noreferrer");
        } else {
            setActiveItem(item.id);
            navigateToUrl(item.path);
        }
    };

    return (
        <div className="sidebar">
            <nav className="sidebar__nav">
                {navSectionsWithRootsLinks.map((section, sectionIdx) => (
                    <div key={sectionIdx} className="sidebar__section">
                        {section.title && <span className="sidebar__section-title">{section.title}</span>}
                        {section.items.map((item) => (
                            <button
                                key={item.id}
                                className={`sidebar__nav-item${
                                    activeItem === item.id ? " sidebar__nav-item--active" : ""
                                }`}
                                onClick={() => handleNavClick(item)}>
                                <span className="sidebar__nav-item-label">{item.label}</span>
                                <span
                                    className={`sidebar__nav-item-path${
                                        item.external ? " sidebar__nav-item-path--external" : ""
                                    }`}>
                                    {item.displayPath}
                                </span>
                            </button>
                        ))}
                    </div>
                ))}
            </nav>

            <div className="sidebar__footer">
                <p className="sidebar__footer-info">
                    {rootConfig?.tech && `Built with ${rootConfig.tech}`}
                    {rootConfig?.mode === "development" && " • Dev Mode"}
                </p>
            </div>
        </div>
    );
}
