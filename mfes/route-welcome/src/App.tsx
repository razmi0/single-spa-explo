import { useState } from "react";
import reactLogo from "./assets/react.svg";
import styles from "./index.module.css";
import viteLogo from "/vite.svg";

// this is made available via the root config import map
// import { DummyComponent, title } from "@demo/partials";

function App() {
    const [count, setCount] = useState(0);

    return (
        <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center", padding: "2rem" }}>
            <div>
                <a href="https://vitejs.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>VITE + REACT + SINGLE-SPA + HMR</h1>
            <div className={styles.card}>
                <button onClick={() => setCount((count) => count + 1)} style={{ fontSize: 16, padding: 10 }}>
                    count is sdfdf {count}
                </button>
            </div>
        </div>
    );
}

export default App;
