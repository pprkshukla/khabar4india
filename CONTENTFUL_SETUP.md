# Contentful Setup Guide – Khabar for India

This guide walks you through creating the content models and content types in Contentful so your Next.js site can display Hindu religion, history, and culture content.

> **Create models via script:** You can create all content types automatically. See **[docs/CONTENT_MODELS.md#create-via-script-recommended](docs/CONTENT_MODELS.md)** — add `CONTENTFUL_MANAGEMENT_TOKEN` to `.env.local` and run `npm run contentful:create-model`.  
> **Detailed content models:** For the full **list, structure, and step-by-step configuration** of each content type, see **[docs/CONTENT_MODELS.md](docs/CONTENT_MODELS.md)**.

---

## Step 1: Create a Contentful account and space

1. Go to [contentful.com](https://www.contentful.com) and sign up or log in.
2. Create a **new space** (e.g. “Khabar for India”).
3. Get your **Space ID** and **Delivery API token**: go to **Settings → API keys**, open an API key (or create one), then copy **Space ID** and **Content delivery API – access token**.
4. In your project root, copy `.env.example` to `.env.local` and set:
   ```env
   CONTENTFUL_SPACE_ID=your_space_id
   CONTENTFUL_ACCESS_TOKEN=your_delivery_api_token
   ```

**Step-by-step token guide:** If the Contentful interface is confusing, see **[docs/CONTENTFUL_TOKENS_SETUP.md](docs/CONTENTFUL_TOKENS_SETUP.md)** for a full walkthrough (where to click, what to copy, and how to get the optional Content Management token for the script).

---

## Step 2: Create content models (Content types)

In Contentful: **Content model → Add content type**.

Create the following content types and fields exactly as below (field IDs matter for the code).

---

### Content type 1: **Category**

Used for article topics (e.g. Scriptures, Philosophy, Festivals).

| Field name   | Field ID     | Type        | Notes                    |
|-------------|--------------|-------------|---------------------------|
| Name        | `name`       | Short text  | Required                  |
| Slug        | `slug`       | Short text  | Required, unique; e.g. `scriptures` |

**Save** the content type.

---

### Content type 2: **Author**

Used for article authors (optional).

| Field name | Field ID | Type       | Notes                    |
|------------|----------|------------|--------------------------|
| Name       | `name`   | Short text | Required                 |
| Role       | `role`   | Short text | Optional; e.g. "Editor"  |
| Bio        | `bio`    | Long text  | Optional; short bio      |
| Avatar     | `avatar` | Media (1)  | Optional; profile image  |

**Save** the content type.

---

### Content type 3: **Article**

Used for blog/articles.

| Field name     | Field ID        | Type        | Notes                          |
|----------------|------------------|-------------|---------------------------------|
| Title          | `title`          | Short text  | Required; main headline         |
| Slug           | `slug`           | Short text  | Required, unique; URL path      |
| Category       | `category`       | Reference   | Reference to **Category** (1)   |
| Summary        | `summary`        | Rich text   | Optional; lead + card preview (plain text) |
| Feature Image  | `featureImage`   | Media (1)   | Optional; hero + cards          |
| Body           | `body`           | Rich text   | Required; full content, links, embedded images |
| Related News   | `relatedNews`    | References  | Optional; many **Article**      |
| Author         | `author`         | Reference   | Reference to **Author** (1); optional |
| Publish Date   | `publishedDate`  | Date        | Required; date-only in UI if available |
| Meta Title     | `metaTitle`      | Short text  | Optional; SEO title             |
| Meta Description | `metaDescription` | Long text | Optional; SEO description       |

See **[docs/ARTICLE_FIELD_MIGRATION.md](docs/ARTICLE_FIELD_MIGRATION.md)** if you need to add these fields to an existing Article type. The app still accepts legacy `excerpt` and `featuredImage` as fallbacks.

**Save** the content type.

---

### Content type 4: **Page**

Used for static pages (About Us, Contact Us, etc.).

| Field name       | Field ID         | Type       | Notes                          |
|------------------|------------------|------------|---------------------------------|
| Title            | `title`          | Short text | Required                        |
| Slug             | `slug`           | Short text | Required, unique; e.g. `about-us`, `contact-us` |
| Body             | `body`           | Rich text  | Required; page content          |
| Meta Title       | `metaTitle`      | Short text | Optional; SEO title             |
| Meta Description | `metaDescription` | Long text | Optional; SEO description       |

**Save** the content type.

---

## Step 3: Add content

### Authors (optional)

1. **Content → Add entry → Author**
2. Create entries, e.g.:
   - Name: `Your Name`, Role: `Editor`, Bio: Short bio, Avatar: optional image
3. **Publish** each. You can then assign an author to any Article.

### Categories

1. **Content → Add entry → Category**
2. Create entries such as:
   - Name: `Scriptures`, Slug: `scriptures`
   - Name: `Philosophy`, Slug: `philosophy`
   - Name: `Festivals`, Slug: `festivals`
   - Name: `Temples`, Slug: `temples`
   - Name: `Traditions`, Slug: `traditions`
3. **Publish** each.

### Articles

1. **Content → Add entry → Article**
2. Fill: Title, Slug (e.g. `intro-to-vedas`), Body (rich text), Category, Publish Date. Optionally: Summary (rich text), Feature Image, Related News, **Author**, **Meta Title**, **Meta Description**.
3. **Publish**.

### Pages

1. **About Us**  
   - **Content → Add entry → Page**  
   - Title: `About Us`, Slug: `about-us`  
   - Body: your about content (rich text)  
   - Optionally: **Meta Title**, **Meta Description** for SEO  
   - **Publish**

2. **Contact Us**  
   - **Content → Add entry → Page**  
   - Title: `Contact Us`, Slug: `contact-us`  
   - Body: contact info, address, email, etc.  
   - Optionally: **Meta Title**, **Meta Description**  
   - **Publish**

---

## Step 4: Field IDs checklist

The app expects these exact field IDs:

- **Category:** `name`, `slug`
- **Author:** `name`, `role`, `bio`, `avatar`
- **Article:** `title`, `slug`, `category`, `summary`, `featureImage`, `body`, `relatedNews`, `author`, `publishedDate`, `metaTitle`, `metaDescription` (legacy: `excerpt`, `featuredImage`)
- **Page:** `title`, `slug`, `body`, `metaTitle`, `metaDescription`

If you change them in Contentful, update the code in `src/lib/contentful.js` and components (e.g. `ArticleCard.js`, `RichText.js`, page files) to use the new IDs.

---

## Step 5: Run the site

```bash
npm run dev
```

- **Home:** Featured and latest articles from Contentful; if none exist, a placeholder message is shown.
- **Blog:** `/blog` – list of articles; filter by category with `?category=<slug>`.
- **Article:** `/blog/[slug]` – single article by slug.
- **About:** `/about` – content from the Page entry with slug `about-us`.
- **Contact:** `/contact` – content from the Page entry with slug `contact-us`.

---

## Optional: Preview draft content

To show draft/unpublished entries:

1. In Contentful, create a **Preview API** token (Settings → API keys → Content preview API).
2. Add to `.env.local`:
   ```env
   CONTENTFUL_PREVIEW_TOKEN=your_preview_token
   ```
3. In `src/lib/contentful.js` you can add a second client that uses `CONTENTFUL_PREVIEW_TOKEN` and `host: 'preview.contentful.com'` for draft content (e.g. in a preview route or feature flag).

---

## Summary

| Content type | Purpose        | Example slugs / usage     |
|-------------|----------------|---------------------------|
| Category    | Article topics | `scriptures`, `festivals`  |
| Author      | Article author | optional reference on Article |
| Article     | Blog posts     | any slug, e.g. `intro-vedas`; supports Author + SEO fields |
| Page        | Static pages   | `about-us`, `contact-us`; supports SEO fields |

After creating these types and entries, the site will load all content from Contentful.
