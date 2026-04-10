/**
 * Updates Author content type in Contentful:
 * - Ensures final state has only one `bio` field with type RichText
 * - Removes temporary/legacy `bioRichText` field if present
 *
 * Strategy (safe for published content):
 * 1) If `bio` is Text, add temp field `bioTempText` and copy current bio there.
 * 2) Delete old `bio`.
 * 3) Recreate `bio` as RichText (same id).
 * 4) Migrate text back into new RichText `bio`.
 * 5) Delete `bioTempText` and `bioRichText` (if present).
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

const client = contentful.createClient({ accessToken: MANAGEMENT_TOKEN });

async function main() {
  const space = await client.getSpace(SPACE_ID);
  const environment = await space.getEnvironment(ENVIRONMENT_ID);

  let contentType;
  try {
    contentType = await environment.getContentType("author");
  } catch (e) {
    console.error(
      'Could not load content type "author". Create it first (npm run contentful:create-model) or check your space.'
    );
    console.error(e.message || e);
    process.exit(1);
  }

  const TEMP_FIELD_ID = "bioTempText";
  const PAGE_SIZE = 100;
  const getLocaleCodes = (entry) => {
    const fields = entry?.fields || {};
    const byField = ["name", "bio", "bioRichText", TEMP_FIELD_ID]
      .map((id) => Object.keys(fields[id] || {}))
      .flat();
    return [...new Set(byField.length ? byField : ["en-US"])];
  };
  const asRichDoc = (value) => ({
    nodeType: "document",
    data: {},
    content: [
      {
        nodeType: "paragraph",
        data: {},
        content: [{ nodeType: "text", value: String(value || ""), marks: [], data: {} }],
      },
    ],
  });

  let bioField = contentType.fields.find((f) => f.id === "bio");
  const hasField = (id) => contentType.fields.some((f) => f.id === id);

  if (!bioField) {
    console.log('Field "bio" missing. Creating it as RichText.');
    contentType.fields = [
      ...contentType.fields,
      {
        id: "bio",
        name: "Bio",
        type: "RichText",
        required: false,
        localized: false,
        validations: [],
      },
    ];
    contentType = await contentType.update();
    contentType = await contentType.publish();
  }

  bioField = contentType.fields.find((f) => f.id === "bio");

  if (bioField.type === "Text") {
    // 1) Ensure temp text field
    if (!hasField(TEMP_FIELD_ID)) {
      console.log('Adding temp field "bioTempText"...');
      contentType.fields = [
        ...contentType.fields,
        {
          id: TEMP_FIELD_ID,
          name: "Bio Temp Text",
          type: "Text",
          required: false,
          localized: false,
          validations: [],
        },
      ];
      contentType = await contentType.update();
      contentType = await contentType.publish();
    }

    // 2) Copy bio -> bioTempText on entries
    console.log('Copying entry values from "bio" to "bioTempText"...');
    let skip = 0;
    let copied = 0;
    while (true) {
      const entriesRes = await environment.getEntries({
        content_type: "author",
        limit: PAGE_SIZE,
        skip,
      });
      const items = entriesRes.items || [];
      if (!items.length) break;
      for (const entry of items) {
        const locales = getLocaleCodes(entry);
        let changed = false;
        entry.fields = entry.fields || {};
        entry.fields[TEMP_FIELD_ID] = entry.fields[TEMP_FIELD_ID] || {};
        for (const locale of locales) {
          const legacy = entry.fields?.bio?.[locale];
          if (legacy && !entry.fields[TEMP_FIELD_ID][locale]) {
            entry.fields[TEMP_FIELD_ID][locale] = String(legacy);
            changed = true;
          }
        }
        if (changed) {
          const updatedEntry = await entry.update();
          await updatedEntry.publish();
          copied += 1;
        }
      }
      skip += items.length;
      if (skip >= (entriesRes.total || 0)) break;
    }
    console.log(`Copied bio text on ${copied} author entr${copied === 1 ? "y" : "ies"}.`);

    // 3) Delete old bio
    contentType = await environment.getContentType("author");
    console.log('Deleting old "bio" (Text) field...');
    contentType = await contentType.omitAndDeleteField("bio");
    contentType = await contentType.publish();

    // 4) Recreate bio as RichText with same id
    contentType = await environment.getContentType("author");
    console.log('Recreating "bio" as RichText...');
    contentType.fields = [
      ...contentType.fields,
      {
        id: "bio",
        name: "Bio",
        type: "RichText",
        required: false,
        localized: false,
        validations: [],
      },
    ];
    contentType = await contentType.update();
    contentType = await contentType.publish();

    // 5) Move temp text -> new rich bio
    console.log('Migrating "bioTempText" back into RichText "bio"...');
    skip = 0;
    let migrated = 0;
    while (true) {
      const entriesRes = await environment.getEntries({
        content_type: "author",
        limit: PAGE_SIZE,
        skip,
      });
      const items = entriesRes.items || [];
      if (!items.length) break;
      for (const entry of items) {
        const locales = getLocaleCodes(entry);
        let changed = false;
        entry.fields = entry.fields || {};
        entry.fields.bio = entry.fields.bio || {};
        for (const locale of locales) {
          const temp = entry.fields?.[TEMP_FIELD_ID]?.[locale];
          if (temp && !entry.fields.bio[locale]) {
            entry.fields.bio[locale] = asRichDoc(temp);
            changed = true;
          }
        }
        if (changed) {
          const updatedEntry = await entry.update();
          await updatedEntry.publish();
          migrated += 1;
        }
      }
      skip += items.length;
      if (skip >= (entriesRes.total || 0)) break;
    }
    console.log(`Migrated RichText bio on ${migrated} author entr${migrated === 1 ? "y" : "ies"}.`);
  }

  // Cleanup old helper fields
  contentType = await environment.getContentType("author");
  if (contentType.fields.some((f) => f.id === "bioRichText")) {
    console.log('Removing legacy field "bioRichText"...');
    contentType = await contentType.omitAndDeleteField("bioRichText");
    contentType = await contentType.publish();
    contentType = await environment.getContentType("author");
  }
  if (contentType.fields.some((f) => f.id === TEMP_FIELD_ID)) {
    console.log('Removing temp field "bioTempText"...');
    contentType = await contentType.omitAndDeleteField(TEMP_FIELD_ID);
    contentType = await contentType.publish();
  }

  console.log('Done. Author has only "bio" field as RichText.');
}

main().catch((err) => {
  console.error("Error:", err.message || err);
  if (err.response?.data) {
    console.error(JSON.stringify(err.response.data, null, 2));
  }
  process.exit(1);
});
