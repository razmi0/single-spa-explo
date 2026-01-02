interface EnvPillProps {
    env?: string;
}

export function EnvPill({ env }: EnvPillProps) {
    const environment = env || import.meta.env.MODE || "dev";
    const isDev = environment === "dev" || environment === "development";
    const displayText = isDev ? "dev" : "prod";

    return (
        <span className={`env-pill env-pill--${isDev ? "dev" : "prod"}`}>
            {displayText}
        </span>
    );
}

