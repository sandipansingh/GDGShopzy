import winston from "winston";
import { env } from "../config/env";

const isDevelopment = env.NODE_ENV === "development";
const isProduction = env.NODE_ENV === "production";

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const logColors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "blue",
};

winston.addColors(logColors);

const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : "";
    return `[${timestamp}] ${level}: ${message}${metaStr}`;
  }),
);

const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: consoleFormat,
    level: isDevelopment ? "debug" : "info",
  }),
];

if (isProduction) {
  transports.push(
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      format: fileFormat,
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
      format: fileFormat,
      maxsize: 5242880,
      maxFiles: 5,
    }),
  );
}

export const logger = winston.createLogger({
  levels: logLevels,
  level: isDevelopment ? "debug" : "info",
  transports,
  exitOnError: false,
  silent: env.NODE_ENV === "test",
});

export default logger;
