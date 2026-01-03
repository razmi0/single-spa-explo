import { useState } from "react";
import infoIcon from "../assets/info-icon.svg";

export interface MfeInfo {
    orgName: string;
    projectName: string;
    tools?: string[];
    env: string;
    root: string;
}

interface InfoPanelProps {
    info: MfeInfo;
}

export function InfoPanel({ info }: InfoPanelProps) {
    const [isVisible, setIsVisible] = useState(false);

    const toolsDisplay = info.tools
        ? info.tools.map((t) => t.charAt(0).toUpperCase() + t.slice(1)).join(" + ")
        : "Vite + React + Single-SPA";

    return (
        <div
            className="info-panel-container"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}>
            <button className="info-trigger" aria-label="View MFE information">
                <img src={infoIcon} alt="Info" className="info-icon" />
            </button>

            {isVisible && (
                <div className="info-panel">
                    <div className="info-panel-header">Microfrontend Info</div>
                    <dl className="info-panel-content">
                        <div className="info-row">
                            <dt>name</dt>
                            <dd>
                                @{info.orgName}/{info.projectName}
                            </dd>
                        </div>
                        <div className="info-row">
                            <dt>Stack</dt>
                            <dd>{toolsDisplay}</dd>
                        </div>
                        <div className="info-row">
                            <dt>Root</dt>
                            <dd>{info.root}</dd>
                        </div>
                    </dl>
                </div>
            )}
        </div>
    );
}
