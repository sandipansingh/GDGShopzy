export function parseTimeStringToMs(value: string): number {
  const unit = value.slice(-1);
  const amount = parseInt(value.slice(0, -1), 10);

  switch (unit) {
    case "s":
      return amount * 1000;
    case "m":
      return amount * 60 * 1000;
    case "h":
      return amount * 60 * 60 * 1000;
    case "d":
      return amount * 24 * 60 * 60 * 1000;
    default:
      throw new Error(
        `Invalid time format: ${value}. Expected format: <number><unit> (e.g., 7d, 15m)`,
      );
  }
}
