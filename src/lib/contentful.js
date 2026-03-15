const contentful = require("contentful");

const space = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

const client =
  space && accessToken
    ? contentful.createClient({ space, accessToken })
    : null;

export async function getEntries(contentType, options = {}) {
  if (!client) return [];
  try {
    const res = await client.getEntries({
      content_type: contentType,
      ...options,
    });
    return res.items;
  } catch (err) {
    console.error(`Contentful getEntries error (${contentType}):`, err.message);
    return [];
  }
}

export async function getEntryById(id) {
  if (!client) return null;
  try {
    const res = await client.getEntry(id);
    return res;
  } catch (err) {
    console.error("Contentful getEntry error:", err.message);
    return null;
  }
}

export async function getArticleBySlug(slug) {
  const items = await getEntries("article", {
    "fields.slug": slug,
    limit: 1,
  });
  return items[0] || null;
}

export async function getPageBySlug(slug) {
  const items = await getEntries("page", {
    "fields.slug": slug,
    limit: 1,
  });
  return items[0] || null;
}

export async function getArticles(options = {}) {
  return getEntries("article", {
    order: "-fields.publishedDate",
    limit: options.limit || 100,
    skip: options.skip || 0,
    ...options,
  });
}

export async function getCategories() {
  return getEntries("category", { order: "fields.name" });
}

export async function getArticlesByCategory(categoryId, limit = 20) {
  return getEntries("article", {
    "fields.category.sys.id": categoryId,
    order: "-fields.publishedDate",
    limit,
  });
}

export async function getHomePageData() {
  const [featuredArticles, latestArticles, categories] = await Promise.all([
    getArticles({ limit: 6 }),
    getArticles({ limit: 10 }),
    getCategories(),
  ]);
  return { featuredArticles, latestArticles, categories };
}

export { client };
