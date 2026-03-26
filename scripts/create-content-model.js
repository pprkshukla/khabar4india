/**
 * Creates all Khabar for India content types in Contentful via the Management API.
 *
 * Prerequisites:
 * - CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN in .env.local (or env)
 * - Get the token from: Contentful → Settings → API keys → Content management tokens → Generate
 *
 * Run: npm run contentful:create-model
 * Or:  node scripts/create-content-model.js
 */

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env.local") });
// Also load .env if present (e.g. in CI)
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

const contentful = require("contentful-management");

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID?.trim();
const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN?.trim();
const ENVIRONMENT_ID = (process.env.CONTENTFUL_ENV || "master").trim();

if (!SPACE_ID || !MANAGEMENT_TOKEN) {
  console.error(
    "Missing env vars. Set CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN in .env.local (project root)."
  );
  console.error(
    "Get the management token from: Contentful → Settings → API keys → Content management tokens."
  );
  process.exit(1);
}

const client = contentful.createClient({ accessToken: MANAGEMENT_TOKEN });

async function createContentTypes(environment) {
  // 1. Category
  try {
    const ct = await environment.createContentTypeWithId("category", {
      name: "Category",
      description: "Topics for articles (e.g. Scriptures, Festivals)",
      displayField: "name",
      fields: [
        { id: "name", name: "Name", type: "Symbol", required: true, localized: false },
        {
          id: "slug",
          name: "Slug",
          type: "Symbol",
          required: true,
          localized: false,
          validations: [{ unique: true }],
        },
      ],
    });
    await ct.publish();
    console.log("Created and published content type: Category");
  } catch (e) {
    if (isAlreadyExists(e)) {
      console.log("Category already exists, skipping.");
    } else throw e;
  }

  // 2. Author
  try {
    const ct = await environment.createContentTypeWithId("author", {
      name: "Author",
      description: "Author of articles",
      displayField: "name",
      fields: [
        { id: "name", name: "Name", type: "Symbol", required: true, localized: false },
        { id: "role", name: "Role", type: "Symbol", required: false, localized: false },
        { id: "bio", name: "Bio", type: "Text", required: false, localized: false },
        {
          id: "avatar",
          name: "Avatar",
          type: "Link",
          linkType: "Asset",
          required: false,
          localized: false,
        },
      ],
    });
    await ct.publish();
    console.log("Created and published content type: Author");
  } catch (e) {
    if (isAlreadyExists(e)) {
      console.log("Author already exists, skipping.");
    } else throw e;
  }

  // 3. Article (references Category and Author)
  try {
    const ct = await environment.createContentTypeWithId("article", {
      name: "Article",
      description: "Blog and article posts",
      displayField: "title",
      fields: [
        { id: "title", name: "Title", type: "Symbol", required: true, localized: false },
        {
          id: "slug",
          name: "Slug",
          type: "Symbol",
          required: true,
          localized: false,
          validations: [{ unique: true }],
        },
        {
          id: "category",
          name: "Category",
          type: "Link",
          linkType: "Entry",
          required: true,
          localized: false,
          validations: [{ linkContentType: ["category"] }],
        },
        { id: "summary", name: "Summary", type: "RichText", required: false, localized: false },
        {
          id: "featureImage",
          name: "Feature Image",
          type: "Link",
          linkType: "Asset",
          required: false,
          localized: false,
        },
        { id: "body", name: "Body", type: "RichText", required: true, localized: false },
        {
          id: "relatedNews",
          name: "Related News",
          type: "Array",
          required: false,
          localized: false,
          items: {
            type: "Link",
            linkType: "Entry",
            validations: [{ linkContentType: ["article"] }],
          },
        },
        {
          id: "author",
          name: "Author",
          type: "Link",
          linkType: "Entry",
          required: false,
          localized: false,
          validations: [{ linkContentType: ["author"] }],
        },
        {
          id: "publishedDate",
          name: "Publish Date",
          type: "Date",
          required: true,
          localized: false,
        },
        { id: "metaTitle", name: "Meta Title", type: "Symbol", required: false, localized: false },
        {
          id: "metaDescription",
          name: "Meta Description",
          type: "Text",
          required: false,
          localized: false,
        },
      ],
    });
    await ct.publish();
    console.log("Created and published content type: Article");
  } catch (e) {
    if (isAlreadyExists(e)) {
      console.log("Article already exists, skipping.");
    } else throw e;
  }

  // 4. Page
  try {
    const ct = await environment.createContentTypeWithId("page", {
      name: "Page",
      description: "Static pages (About, Contact, etc.)",
      displayField: "title",
      fields: [
        { id: "title", name: "Title", type: "Symbol", required: true, localized: false },
        {
          id: "slug",
          name: "Slug",
          type: "Symbol",
          required: true,
          localized: false,
          validations: [{ unique: true }],
        },
        { id: "body", name: "Body", type: "RichText", required: true, localized: false },
        { id: "metaTitle", name: "Meta Title", type: "Symbol", required: false, localized: false },
        {
          id: "metaDescription",
          name: "Meta Description",
          type: "Text",
          required: false,
          localized: false,
        },
      ],
    });
    await ct.publish();
    console.log("Created and published content type: Page");
  } catch (e) {
    if (isAlreadyExists(e)) {
      console.log("Page already exists, skipping.");
    } else throw e;
  }
}

function isAlreadyExists(err) {
  const msg = err && (err.message || String(err));
  return (
    msg &&
    (msg.includes("already exists") ||
      msg.includes("Conflict") ||
      msg.includes("409") ||
      (err.name && err.name === "Conflict"))
  );
}

async function main() {
  try {
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(ENVIRONMENT_ID);
    await createContentTypes(environment);
    console.log("\nDone. You can now add entries in the Contentful app.");
  } catch (err) {
    console.error("Error:", err.message);
    if (err.message && err.message.includes("already exists")) {
      process.exit(0);
    }
    process.exit(1);
  }
}

main();
