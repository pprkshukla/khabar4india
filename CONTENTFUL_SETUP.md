# Contentful Setup Guide – Khabar for India

This guide walks you through creating the content models and content types in Contentful so your Next.js site can display Hindu religion, history, and culture content.

---

## Step 1: Create a Contentful account and space

1. Go to [contentful.com](https://www.contentful.com) and sign up or log in.
2. Create a **new space** (e.g. “Khabar for India”).
3. Go to **Settings → API keys** and create an API key (or use the default).
4. Copy:
   - **Space ID**
   - **Content Delivery API – access token**
5. In your project root, copy `.env.example` to `.env.local` and set:
   ```env
   CONTENTFUL_SPACE_ID=your_space_id
   CONTENTFUL_ACCESS_TOKEN=your_delivery_api_token
   ```

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

### Content type 2: **Article**

Used for blog/articles.

| Field name     | Field ID        | Type        | Notes                          |
|----------------|------------------|-------------|---------------------------------|
| Title          | `title`          | Short text  | Required                        |
| Slug           | `slug`           | Short text  | Required, unique; URL path      |
| Excerpt        | `excerpt`        | Long text   | Optional; summary for cards     |
| Body           | `body`           | Rich text   | Required; main content         |
| Featured Image | `featuredImage`  | Media (1)   | Optional; one image              |
| Category       | `category`       | Reference   | Reference to **Category** (1)   |
| Published Date | `publishedDate`  | Date & time | Required; for ordering/display  |

**Save** the content type.

---

### Content type 3: **Page**

Used for static pages (About Us, Contact Us, etc.).

| Field name | Field ID | Type       | Notes                          |
|------------|----------|------------|---------------------------------|
| Title      | `title`  | Short text | Required                        |
| Slug       | `slug`   | Short text | Required, unique; e.g. `about-us`, `contact-us` |
| Body       | `body`   | Rich text  | Required; page content          |

**Save** the content type.

---

## Step 3: Add content

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
2. Fill: Title, Slug (e.g. `intro-to-vedas`), Excerpt, Body (rich text), Category, Published Date, and optionally Featured Image.
3. **Publish**.

### Pages

1. **About Us**  
   - **Content → Add entry → Page**  
   - Title: `About Us`  
   - Slug: `about-us`  
   - Body: your about content (rich text)  
   - **Publish**

2. **Contact Us**  
   - **Content → Add entry → Page**  
   - Title: `Contact Us`  
   - Slug: `contact-us`  
   - Body: contact info, address, email, etc.  
   - **Publish**

---

## Step 4: Field IDs checklist

The app expects these exact field IDs:

- **Category:** `name`, `slug`
- **Article:** `title`, `slug`, `excerpt`, `body`, `featuredImage`, `category`, `publishedDate`
- **Page:** `title`, `slug`, `body`

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
| Article     | Blog posts     | any slug, e.g. `intro-vedas` |
| Page        | Static pages   | `about-us`, `contact-us`   |

After creating these types and entries, the site will load all content from Contentful.
