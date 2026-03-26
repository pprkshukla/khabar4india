/** URL segment for each top-level section that has submenu pages */
export const NAV_SECTIONS = [
  "bhaktamal",
  "saints",
  "articles",
  "gallery",
  "dham",
  "gauank-special",
  "jaago-bharat",
];

export const isNavSection = (s) => NAV_SECTIONS.includes(s);

/**
 * Main header navigation: top label, optional parent href, optional children { label, slug }.
 * Full URL for a child: `/${sectionKey}/${slug}` where sectionKey matches route segment.
 */
export const MAIN_NAV = [
  { label: "Home", href: "/" },
  {
    label: "Bhaktamal",
    section: "bhaktamal",
    href: "/bhaktamal",
    children: [
      {
        label: "१. श्रीवैष्णव सम्प्रदाय",
        slug: "shri-vaishnav-sampraday",
      },
      { label: "२. ब्रह्म सम्प्रदाय", slug: "brahma-sampraday" },
      { label: "३. रुद्र सम्प्रदाय", slug: "rudra-sampraday" },
      {
        label: "४. निम्बार्क/कुमार/सनादि सम्प्रदाय",
        slug: "nimbark-kumar-sanadi-sampraday",
      },
    ],
  },
  {
    label: "Saints",
    section: "saints",
    href: "/saints",
    children: [
      { label: "शैव्य", slug: "shaivy" },
      { label: "शाक्त", slug: "shakt" },
      { label: "वैष्णव", slug: "vaishnav" },
      { label: "हरिदास", slug: "haridas" },
    ],
  },
  {
    label: "Articles",
    section: "articles",
    href: "/articles",
    children: [
      { label: "धार्मिक", slug: "dharmik" },
      { label: "एतिहासिक", slug: "aitihasik" },
      {
        label: "प्रमुख राजनीतिक विश्लेषण",
        slug: "pramukh-rajnitik-vishleshan",
      },
    ],
  },
  {
    label: "Gallery",
    section: "gallery",
    href: "/gallery",
    children: [
      { label: "लाइव", slug: "live" },
      { label: "धार्मिक", slug: "dharmik" },
      { label: "एतिहासिक", slug: "aitihasik" },
    ],
  },
  {
    label: "Dham",
    section: "dham",
    href: "/dham",
    children: [
      { label: "द्वादश वन", slug: "dwadash-van" },
      { label: "द्वादश उप वन", slug: "dwadash-up-van" },
      { label: "चार हिंडोल", slug: "char-hindol" },
      { label: "चार वट लीला", slug: "char-vat-lila" },
      { label: "सिद्ध बाबा स्थान", slug: "siddh-baba-sthan" },
      { label: "प्रमुख यमुना घाट", slug: "pramukh-yamuna-ghat" },
      { label: "प्रधान लीला स्थली", slug: "pradhan-lila-sthali" },
    ],
  },
  {
    label: "Gauank Special",
    section: "gauank-special",
    href: "/gauank-special",
    children: [
      { label: "गोरक्षाक", slug: "gorakshak" },
      { label: "संघर्ष", slug: "sangharsh" },
      { label: "शहिद योद्धा", slug: "shahid-yoddha" },
    ],
  },
  {
    label: "Jaago Bharat",
    section: "jaago-bharat",
    href: "/jaago-bharat",
    children: [
      {
        label: "प्रेम ठाकुर दास महाराज",
        slug: "prem-thakur-das-maharaj",
      },
      { label: "आशुतोष दास", slug: "ashutosh-das" },
      { label: "प्रेमानंद दास", slug: "premanand-das" },
    ],
  },
  { label: "History", href: "/history" },
  { label: "About Us", href: "/about" },
];

export function getSectionChildren(section) {
  const item = MAIN_NAV.find((n) => n.section === section);
  return item?.children || [];
}

export function getTopicLabel(section, slug) {
  const children = getSectionChildren(section);
  const found = children.find((c) => c.slug === slug);
  return found?.label || slug;
}

export function getAllSectionSlugParams() {
  return MAIN_NAV.flatMap((item) => {
    if (!item.section || !item.children) return [];
    return item.children.map((c) => ({
      section: item.section,
      slug: c.slug,
    }));
  });
}
