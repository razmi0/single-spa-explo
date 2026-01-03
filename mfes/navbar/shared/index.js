// src/main.ts
var logMfeProps = (name, props) => {
  const { rootConfig } = props;
  if (rootConfig?.mode.startsWith("dev")) {
    console.log(`[${name}] Props received:`, props);
  }
};
export {
  logMfeProps
};
