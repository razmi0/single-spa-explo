import { EnvPill } from "./components/EnvPill";
import { InfoPanel, type MfeInfo } from "./components/InfoPanel";
import { NavLinks, type NavLink } from "./components/NavLinks";
import "./styles/navbar.css";
import type { MfeDefaultProps } from "./types/mfe-props";

export default function Root(props: MfeDefaultProps) {
    const { name, rootConfig, getLoadedApps, mfeRegistry, defaultRoots } = props;

    // MFE information for info panel - enhanced with root config data
    const mfeInfo: MfeInfo = {
        orgName: "Razmio",
        projectName: "navbar",
        tools: ["vite", "react", "single-spa"],
        env: import.meta.env.MODE as "dev" | "prod",
        root: `${rootConfig.tech} (${rootConfig.mode})`,
    };

    const links: NavLink[] = Object.entries(defaultRoots).map(([key, value]) => ({
        label: key,
        href: value[import.meta.env.MODE as "dev" | "prod"],
    }));

    // Log props in development for debugging
    if (rootConfig?.mode === "development") {
        console.log(`[${name}] Props received:`, {
            rootConfig,
            loadedApps: getLoadedApps?.(),
            mfeRegistry,
        });
    }

    return (
        <header className="navbar">
            <div className="navbar-inner">
                <div className="navbar-left">
                    <InfoPanel info={mfeInfo} />
                    <EnvPill />
                    {rootConfig && (
                        <span className="navbar-tech-badge" title={`Root: ${rootConfig.tech}`}>
                            {rootConfig.tech}
                        </span>
                    )}
                </div>
                <div className="navbar-right">
                    <NavLinks links={links} />
                    {mfeRegistry && (
                        <span className="navbar-mfe-count" title="Loaded MFEs">
                            {mfeRegistry.length} MFEs
                        </span>
                    )}
                </div>
            </div>
        </header>
    );
}
