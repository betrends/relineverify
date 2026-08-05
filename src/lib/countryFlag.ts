// Converts an ISO 3166-1 alpha-2 code (e.g. "ru", "US") into its flag emoji
// using regional indicator symbols — works for any country, no lookup table.
export function countryCodeToFlag(code: string) {
  if (!code || code.length !== 2) return "🌐";
  const codePoints = [...code.toUpperCase()].map((c) => 127397 + c.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
