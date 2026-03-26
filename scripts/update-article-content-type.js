/**
 * Updates the existing **Article** content type in Contentful (Management API).
 * - Adds missing fields: summary, featureImage, relatedNews
 * - Removes legacy **featuredImage** when **featureImage** also exists (duplicate hero image)
 *
 * Requires: CONTENTFUL_SPACE_ID + CONTENTFUL_MANAGEMENT_TOKEN in .env.local
 *
 * Run: npm run contentful:update-article
 */

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env.local") });
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

const contentful = require("contentful-management");

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID?.trim();
const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN?.trim();
const ENVIRONMENT_ID = (process.env.CONTENTFUL_ENV || "master").trim();

if (!SPACE_ID || !MANAGEMENT_TOKEN) {
  console.error(
    "Set CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN in .env.local"
  );
  process.exit(1);
}

/** Fields to add if their `id` is not already on Article */
const FIELDS_TO_ENSURE = [
  {
    id: "summary",
    name: "Summary",
    type: "RichText",
    required: false,
    localized: false,
  },
  {
    id: "featureImage",
    name: "Feature Image",
    type: "Link",
    linkType: "Asset",
    required: false,
    localized: false,
  },
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
];

const client = contentful.createClient({ accessToken: MANAGEMENT_TOKEN });

async function main() {
  const space = await client.getSpace(SPACE_ID);
  const environment = await space.getEnvironment(ENVIRONMENT_ID);

  let contentType;
  try {
    contentType = await environment.getContentType("article");
  } catch (e) {
    console.error(
      'Could not load content type "article". Create it first (npm run contentful:create-model) or check your space.'
    );
    console.error(e.message);
    process.exit(1);
  }

  const hasField = (id) => contentType.fields.some((f) => f.id === id);
  let removedLegacyFeaturedImage = false;

  // Remove duplicate: legacy featuredImage when featureImage exists
  if (hasField("featuredImage") && hasField("featureImage")) {
    console.log(
      'Removing legacy field "featuredImage" (keeping "featureImage").'
    );
    console.log(
      "If any article only had an image in Featured Image, copy it to Feature Image in Contentful first."
    );
    contentType = await contentType.omitAndDeleteField("featuredImage");
    removedLegacyFeaturedImage = true;
    try {
      if (typeof contentType.publish === "function") {
        contentType = await contentType.publish();
      }
    } catch (pubErr) {
      console.warn("Publish after field removal:", pubErr.message || pubErr);
    }
    contentType = await environment.getContentType("article");
  }

  const existingIds = new Set(contentType.fields.map((f) => f.id));
  const toAdd = FIELDS_TO_ENSURE.filter((f) => !existingIds.has(f.id));

  let needsUpdate = toAdd.length > 0;

  if (toAdd.length > 0) {
    console.log("Adding fields:", toAdd.map((f) => f.id).join(", "));
    contentType.fields = [...contentType.fields, ...toAdd];
  }

  const renamedFields = contentType.fields.map((f) => {
    if (f.id === "publishedDate" && f.name !== "Publish Date") {
      needsUpdate = true;
      return { ...f, name: "Publish Date" };
    }
    return f;
  });
  contentType.fields = renamedFields;

  if (needsUpdate) {
    const updated = await contentType.update();
    await updated.publish();
    console.log("Article content type updated and published.");
  } else if (removedLegacyFeaturedImage) {
    console.log('Legacy "featuredImage" field removed; "featureImage" kept.');
  } else {
    console.log("No changes needed.");
  }

  // Second pass: if this run added featureImage, both image fields may exist until we remove legacy
  contentType = await environment.getContentType("article");
  const bothImages =
    contentType.fields.some((f) => f.id === "featuredImage") &&
    contentType.fields.some((f) => f.id === "featureImage");
  if (bothImages) {
    console.log(
      'Removing legacy "featuredImage" (keeping "featureImage") — second pass.'
    );
    contentType = await contentType.omitAndDeleteField("featuredImage");
    try {
      if (typeof contentType.publish === "function") {
        await contentType.publish();
      }
    } catch (pubErr) {
      console.warn("Publish:", pubErr.message || pubErr);
    }
    console.log('Duplicate image field removed.');
  }

  console.log(
    "Tip: For publish date, use date-only appearance in Contentful if you want no time in the editor."
  );
}

main().catch((err) => {
  console.error("Error:", err.message || err);
  if (err.response?.data) {
    console.error(JSON.stringify(err.response.data, null, 2));
  }
  process.exit(1);
});
