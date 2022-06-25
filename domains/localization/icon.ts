// ISO 3166-1 alpha-2
// ⚠️ No support for IE11
export const convertCountryCodeToFlag = (isoCode: string): string =>
  typeof String.fromCodePoint !== 'undefined'
    ? isoCode
      .toUpperCase()
      .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    : isoCode;