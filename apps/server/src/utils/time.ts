/**
 * Converts a JWT-style duration string to milliseconds.
 * Supported units: s (seconds), m (minutes), h (hours), d (days), w (weeks).
 * Throws on unrecognised format so misconfigured env vars fail fast at startup.
 */
export function parseTimeStringToMs(value: string): number {
  const match = /^(\d+)([smhdw])$/.exec(value);
  if (!match) {
    throw new Error(
      `Invalid time format: "${value}". Expected <number><unit> e.g. 15m, 7d, 2w.`,
    );
  }

  const amount = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case "s":
      return amount * 1_000;
    case "m":
      return amount * 60 * 1_000;
    case "h":
      return amount * 60 * 60 * 1_000;
    case "d":
      return amount * 24 * 60 * 60 * 1_000;
    case "w":
      return amount * 7 * 24 * 60 * 60 * 1_000;
    default:
      // Unreachable due to regex, but satisfies exhaustiveness
      throw new Error(`Unhandled time unit: "${unit}"`);
  }
}
