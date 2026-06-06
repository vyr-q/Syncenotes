export type OsintTool = {
  name: string;
  url: string;
  description?: string;
};

export type OsintCategory = {
  id: string;
  name: string;
  description: string;
  tools: OsintTool[];
};

export const osintCategories: OsintCategory[] = [
  {
    id: "people",
    name: "People & Social Media",
    description: "Search profiles, usernames, and social footprints.",
    tools: [
      { name: "Intel X", url: "https://intelx.io" },
      { name: "Have I Been Pwned", url: "https://haveibeenpwned.com" },
      { name: "Social Mention", url: "https://socialmention.com" },
    ],
  },
  {
    id: "domains",
    name: "Domains & IP",
    description: "WHOIS, DNS, IP lookups and passive DNS.",
    tools: [
      { name: "DomainTools WHOIS", url: "https://whois.domaintools.com/" },
      { name: "Shodan", url: "https://www.shodan.io" },
      { name: "VirusTotal", url: "https://www.virustotal.com" },
    ],
  },
  {
    id: "images",
    name: "Images & Reverse Search",
    description: "Reverse image lookup and EXIF analysis.",
    tools: [
      { name: "Google Images", url: "https://images.google.com" },
      { name: "TinEye", url: "https://tineye.com" },
      { name: "EXIF.tools", url: "https://exif.tools" },
    ],
  },
  {
    id: "archives",
    name: "Archives & Historical",
    description: "Wayback, caches and historical snapshots.",
    tools: [
      { name: "Wayback Machine", url: "https://web.archive.org" },
      { name: "archive.today", url: "https://archive.is" },
    ],
  },
  {
    id: "documents",
    name: "Documents & Metadata",
    description: "Extract metadata from files and documents.",
    tools: [
      { name: "Metapicz", url: "https://metapicz.com" },
      { name: "Online hash tools", url: "https://www.onlinehashcrack.com" },
    ],
  },
  {
    id: "maps",
    name: "Maps & Geolocation",
    description: "Tools for geolocation and mapping.",
    tools: [
      { name: "OpenStreetMap", url: "https://www.openstreetmap.org" },
      { name: "Google Maps", url: "https://maps.google.com" },
    ],
  },
  {
    id: "tools",
    name: "Utilities",
    description: "Helpers: converters, scanners, and more.",
    tools: [
      { name: "KeyCDN Tools", url: "https://tools.keycdn.com/" },
      { name: "CtrlQ", url: "https://ctrlq.org/" },
    ],
  },
];
