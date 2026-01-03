import type {
    DefaultRoots,
    LoadedApp,
    MfeDefaultProps,
    MfeRegistry,
    RootConfigInfo,
    RootUrls,
} from "./types/mfe-props";

export const logMfeProps = (name: string, props: MfeDefaultProps) => {
    // Log props in development for debugging
    const { rootConfig } = props;
    if (rootConfig?.mode.startsWith("dev")) {
        console.log(`[${name}] Props received:`, props);
    }
};

export type { DefaultRoots, LoadedApp, MfeDefaultProps, MfeRegistry, RootConfigInfo, RootUrls };
