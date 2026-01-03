import { useEffect, useMemo, useState } from "react";
import { navigateToUrl } from "single-spa";
import { logMfeProps } from "../shared";
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
            // { id: "all", label: "All MFEs", path: "/all", displayPath: "/all" },
            {
                id: "dashboard",
                label: "Dashboard",
                path: "https://single-spa-explo.vercel.app/",
                displayPath: "external",
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

const styles = {
    sidebar: {
        display: "flex",
        flexDirection: "column" as const,
        height: "100%",
        padding: 0,
        textAlign: "left" as const,
    },
    nav: {
        flex: 1,
        padding: "0.5rem 0",
        overflowY: "auto" as const,
    },
    section: {
        marginBottom: "0.25rem",
    },
    sectionTitle: {
        fontSize: "0.6875rem",
        fontWeight: 600,
        textTransform: "uppercase" as const,
        letterSpacing: "0.08em",
        color: "rgba(255, 255, 255, 0.4)",
        padding: "1rem 1rem 0.5rem",
        margin: 0,
    },
    navItem: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.5rem 1rem",
        margin: 0,
        cursor: "pointer",
        transition: "all 0.15s ease",
        textDecoration: "none",
        color: "rgba(255, 255, 255, 0.7)",
        fontSize: "0.75rem",
        fontWeight: 500,
        border: "none",
        background: "transparent",
        width: "100%",
        textAlign: "left" as const,
        borderLeft: "2px solid transparent",
    },
    navItemHover: {
        background: "rgba(255, 255, 255, 0.04)",
        color: "rgba(255, 255, 255, 0.95)",
    },
    navItemActive: {
        background: "rgba(255, 255, 255, 0.04)",
        color: "rgba(255, 255, 255, 0.95)",
        borderLeftColor: "rgba(255, 255, 255, 0.5)",
    },
    navItemLabel: {
        opacity: 1,
    },
    navItemPath: {
        opacity: 0.5,
        fontWeight: 400,
        fontFamily: "monospace",
        fontSize: "0.6875rem",
    },
    footer: {
        padding: "0.75rem 1rem",
        borderTop: "1px solid rgba(255, 255, 255, 0.06)",
    },
    footerInfo: {
        fontSize: "0.625rem",
        color: "rgba(255, 255, 255, 0.35)",
        margin: 0,
        textAlign: "center" as const,
    },
};

export default function Root(props: MfeDefaultProps) {
    const { name, rootConfig, getLoadedApps, mfeRegistry, defaultRoots } = props;
    const [activeItem, setActiveItem] = useState(() => {
        const path = window.location.pathname;
        if (path.startsWith("/all")) return "all";
        if (path.startsWith("/vite")) return "vite";
        if (path.startsWith("/webpack")) return "webpack";
        if (path.startsWith("/rspack")) return "rspack";
        return "home";
    });
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    useEffect(() => {
        logMfeProps(name, props);
    }, [name, props]);

    const navSectionsWithRootsLinks = useMemo(() => {
        const env = rootConfig?.mode.startsWith("dev") ? "dev" : "prod";
        const otherRoots = Object.entries(defaultRoots).map(([key, value]) => ({
            id: value[env],
            label: key,
            path: value[env],
            displayPath: "external",
            external: true,
        }));
        return [
            ...navSections,
            {
                title: "Other roots",
                items: otherRoots,
            },
        ];
    }, []);

    const handleNavClick = (item: NavItem) => {
        if (item.external) {
            window.open(item.path, "_self", "noopener,noreferrer");
        } else {
            setActiveItem(item.id);
            navigateToUrl(item.path);
        }
    };

    const getItemStyle = (itemId: string) => {
        const isActive = activeItem === itemId;
        const isHovered = hoveredItem === itemId;

        return {
            ...styles.navItem,
            ...(isHovered && !isActive ? styles.navItemHover : {}),
            ...(isActive ? styles.navItemActive : {}),
        };
    };

    return (
        <div style={styles.sidebar}>
            <nav style={styles.nav}>
                {navSectionsWithRootsLinks.map((section, sectionIdx) => (
                    <div key={sectionIdx} style={styles.section}>
                        {section.title && <h2 style={styles.sectionTitle}>{section.title}</h2>}
                        {section.items.map((item) => (
                            <button
                                key={item.id}
                                style={getItemStyle(item.id)}
                                onClick={() => handleNavClick(item)}
                                onMouseEnter={() => setHoveredItem(item.id)}
                                onMouseLeave={() => setHoveredItem(null)}>
                                <span style={styles.navItemLabel}>{item.label}</span>
                                <span style={styles.navItemPath}>{item.displayPath}</span>
                            </button>
                        ))}
                    </div>
                ))}
            </nav>

            <div style={styles.footer}>
                <p style={styles.footerInfo}>
                    {rootConfig?.tech && `Built with ${rootConfig.tech}`}
                    {rootConfig?.mode === "development" && " • Dev Mode"}
                </p>
            </div>
        </div>
    );
}
