export const site = {
  name: "Makeover Overseas",
  title: "Makeover Overseas | Medical & Beauty Equipment",
  /** The company motto. */
  tagline: "Quality Beyond Borders",
  /** The descriptor and markets set under the wordmark in the logo. */
  descriptor: "Export & Imports",
  markets: ["India", "UAE", "China"],
  description:
    "Makeover Overseas exports and imports medical aesthetic and dental equipment across India, the UAE and China: 40+ models across laser, HIFU, body sculpting, facial and dental ranges, trusted since 2009.",
  // TODO(owner): confirm the production domain and the inbox for Makeover Overseas;
  // both still point at the Seductive site this one was built from.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://seductive.ae",
  email: "admin@seductive.ae",
  /** Both lines take calls and WhatsApp; visitors pick one before we dial or open a chat. */
  lines: [
    { id: "uae", region: "UAE", display: "+971 52 524 8785", number: "971525248785" },
    { id: "india", region: "India", display: "+91 965 639 8483", number: "919656398483" },
  ],
  address:
    "Office No.57, 4th Floor, UNIGROVE Business Center, Al Gaizi Plaza, Al Garhoud, Dubai – UAE",
  addressLines: [
    "Office No.57, 4th Floor",
    "UNIGROVE Business Center",
    "Al Gaizi Plaza, Al Garhoud",
    "Dubai - UAE",
  ],
  maps: {
    place:
      "https://www.google.com/maps/place/UNIGROVE+Business+Center/@25.2539427,55.331997,15.47z/data=!4m6!3m5!1s0x3e5f5d0041fd950d:0xd0ad24bc30823d79!8m2!3d25.2527312!4d55.3388341!16s%2Fg%2F11vsc_9spx?entry=ttu",
    embed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.4707889343597!2d55.336644575758845!3d25.252731277654088!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5d0041fd950d%3A0xd0ad24bc30823d79!2sUNIGROVE%20Business%20Center!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin",
  },
  claims: {
    since: 2009,
    years: "16+",
    countries: "5+",
    models: "40+",
    series: 14,
  },
} as const;

export type ContactLine = (typeof site.lines)[number];

export const telHref = (line: ContactLine) => `tel:+${line.number}`;

/** Defaults to the India line, which was the site's original WhatsApp number. */
export function whatsappLink(message: string, line: ContactLine = site.lines[1]) {
  return `https://wa.me/${line.number}?text=${encodeURIComponent(message)}`;
}
