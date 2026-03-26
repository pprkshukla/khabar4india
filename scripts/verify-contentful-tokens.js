/**
 * Verifies Contentful tokens and access. Run from project root:
 *   node scripts/verify-contentful-tokens.js
 *
 * Does NOT print your actual tokens, only whether they work.
 */

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env.local") });
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID?.trim();
const DELIVERY_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN?.trim();
const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN?.trim();
const ENV_ID = (process.env.CONTENTFUL_ENV || "master").trim();

function mask(s) {
  if (!s) return "(missing)";
  if (s.length <= 8) return "***";
  return s.slice(0, 4) + "..." + s.slice(-4);
}

async function main() {
  console.log("Env check:");
  console.log("  CONTENTFUL_SPACE_ID:", SPACE_ID ? `${SPACE_ID.length} chars (${mask(SPACE_ID)})` : "MISSING");
  console.log("  CONTENTFUL_ACCESS_TOKEN:", DELIVERY_TOKEN ? `${DELIVERY_TOKEN.length} chars (${mask(DELIVERY_TOKEN)})` : "MISSING");
  console.log("  CONTENTFUL_MANAGEMENT_TOKEN:", MANAGEMENT_TOKEN ? `${MANAGEMENT_TOKEN.length} chars (${mask(MANAGEMENT_TOKEN)})` : "MISSING");
  console.log("  CONTENTFUL_ENV:", ENV_ID);
  console.log("");

  if (!SPACE_ID) {
    console.error("Set CONTENTFUL_SPACE_ID in .env.local");
    process.exit(1);
  }

  // Test Delivery API (for the website)
  if (DELIVERY_TOKEN) {
    try {
      const contentful = require("contentful");
      const client = contentful.createClient({ space: SPACE_ID, accessToken: DELIVERY_TOKEN });
      const res = await client.getEntries({ limit: 1 });
      console.log("Delivery API (CONTENTFUL_ACCESS_TOKEN): OK – can read content.");
    } catch (e) {
      console.error("Delivery API (CONTENTFUL_ACCESS_TOKEN): FAILED –", e.message);
      if (e.message && e.message.includes("access")) {
        console.error("  → Use the 'Content delivery API – access token' from Settings → API keys (delivery key), not the management token.");
      }
    }
  } else {
    console.log("Delivery API: skipped (no CONTENTFUL_ACCESS_TOKEN)");
  }

  // Test Management API (for the script)
  if (MANAGEMENT_TOKEN) {
    try {
      const contentful = require("contentful-management");
      const client = contentful.createClient({ accessToken: MANAGEMENT_TOKEN });
      const space = await client.getSpace(SPACE_ID);
      const env = await space.getEnvironment(ENV_ID);
      const ct = await env.getContentTypes();
      console.log("Management API (CONTENTFUL_MANAGEMENT_TOKEN): OK – can access space and environment.");
    } catch (e) {
      console.error("Management API (CONTENTFUL_MANAGEMENT_TOKEN): FAILED –", e.message);
      if (e.message && e.message.includes("access") || e.message && e.message.includes("requested resource")) {
        console.error("  → Use a token from Settings → API keys → Content management tokens → Create personal access token.");
        console.error("  → If you have multiple orgs, open the token list and click 'Authorize' for this space's organization.");
      }
      if (e.message && e.message.includes("Environment")) {
        console.error("  → Try setting CONTENTFUL_ENV=master (or your environment id) in .env.local");
      }
    }
  } else {
    console.log("Management API: skipped (no CONTENTFUL_MANAGEMENT_TOKEN)");
  }

  console.log("");
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
