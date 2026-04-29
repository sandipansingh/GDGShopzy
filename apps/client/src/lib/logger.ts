type LogLevel = "debug" | "info" | "warn" | "error";

const isDevelopment = import.meta.env.DEV;

const log = (level: LogLevel, ...args: unknown[]) => {
  if ((level === "debug" || level === "info") && !isDevelopment) {
    return;
  }

  globalThis.console[level](...args);
};

export const logger = {
  debug: (...args: unknown[]) => log("debug", ...args),
  info: (...args: unknown[]) => log("info", ...args),
  warn: (...args: unknown[]) => log("warn", ...args),
  error: (...args: unknown[]) => log("error", ...args),
};

export default logger;
