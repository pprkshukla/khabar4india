# Content Models – List, Structure & Configuration

This document lists all content models (content types) for **Khabar for India** and how to configure them in your Contentful space.

---

## Create via script (recommended)

You can create **all four content types at once** with a script—no need to add them manually in the UI.

### 1. Get a Content Management API token

1. In Contentful: **Settings** (gear icon) → **API keys**.
2. Open the **Content management tokens** tab.
3. Click **Generate personal access token** (or use an existing one).
4. Copy the token (you won’t see it again).

### 2. Add it to `.env.local`

Add (or create) in your project root:

```env
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_delivery_api_token
CONTENTFUL_MANAGEMENT_TOKEN=your_management_token_from_step_1
```

Use the same **Space ID** as for the delivery API.

### 3. Run the script

From the project root:

```bash
npm run contentful:create-model
```

Or:

```bash
node scripts/create-content-model.js
```

The script creates **Category**, **Author**, **Article**, and **Page** with the correct fields and validations. If a content type already exists, it skips it. After it finishes, add your content (categories, authors, pages, articles) in the Contentful app.

**Updating Article later (existing space):** If Article was created with an older schema, run:

```bash
npm run contentful:update-article
```

This adds missing fields (`summary`, `featureImage`, `relatedNews`) via the Management API and publishes the type. See **[ARTICLE_FIELD_MIGRATION.md](ARTICLE_FIELD_MIGRATION.md)**.

**Optional:** To use a non-default environment, set `CONTENTFUL_ENV` (e.g. `CONTENTFUL_ENV=staging`). Default is `master`.

---

## Create manually (alternative)

If you prefer to configure content types in the Contentful UI, follow the sections below. The script produces the same result as the manual steps.

---

## 1. Overview: Content types and relationships

| # | Content type (name in UI) | API ID (use in code) | Purpose |
|---|---------------------------|------------------------|--------|
| 1 | **Category** | `category` | Topics for articles (e.g. Scriptures, Festivals) |
| 2 | **Author** | `author` | Article authors (name, role, bio, avatar) |
| 3 | **Article** | `article` | Blog posts; references Category and Author |
| 4 | **Page** | `page` | Static pages (About, Contact); identified by slug |

**Relationship diagram:**

```
Category (1) ←────── Article (many) ──────→ (0..1) Author
                                              │
Page (standalone; slug = about-us, contact-us, etc.)
```

- **Article** → one **Category** (required), one **Author** (optional).
- **Page** has no references; the site finds “About” and “Contact” by slug.

---

## 2. Recommended order of creation

Create content types in this order so references exist when you need them:

1. **Category** (no references)
2. **Author** (no references)
3. **Article** (references Category and Author)
4. **Page** (no references)

---

## 3. Content type 1: Category

**Purpose:** Topic/category for articles (e.g. Scriptures, Philosophy, Festivals).

### 3.1 Create the content type

1. In Contentful: **Content model** (left sidebar) → **Add content type**.
2. **Name:** `Category`.
3. **API identifier:** leave default `category` (or set to `category`).
4. **Description (optional):** “Topics for articles (e.g. Scriptures, Festivals).”
5. Click **Create**.

### 3.2 Add fields

Click **Add field** for each row below. Use the **Field ID** exactly as shown (Contentful may derive it from the display name; edit if needed).

| Display name | Field ID | Type | Required | Validation / notes |
|--------------|----------|------|----------|---------------------|
| Name | `name` | **Short text** | ✓ Yes | - |
| Slug | `slug` | **Short text** | ✓ Yes | Unique (in Validations enable “Unique field”). Use lowercase, e.g. `scriptures`, `festivals`. |

**Field order:** Name, Slug (or any order; IDs matter, not order).

Save the content type.

---

## 4. Content type 2: Author

**Purpose:** Author of articles (optional per article).

### 4.1 Create the content type

1. **Content model** → **Add content type**.
2. **Name:** `Author`.
3. **API identifier:** `author`.
4. **Description (optional):** “Author of articles.”
5. **Create**.

### 4.2 Add fields

| Display name | Field ID | Type | Required | Validation / notes |
|--------------|----------|------|----------|---------------------|
| Name | `name` | **Short text** | ✓ Yes | - |
| Role | `role` | **Short text** | No | e.g. “Editor”, “Contributor”. |
| Bio | `bio` | **Long text** | No | Short biography. |
| Avatar | `avatar` | **Media** (One file) | No | Profile image. In “Appearance” you can set to “Image” if available. |

Save the content type.

---

## 5. Content type 3: Article

**Purpose:** Blog/article entries; appear on Home and Blog, and on article page by slug.

### 5.1 Create the content type

1. **Content model** → **Add content type**.
2. **Name:** `Article`.
3. **API identifier:** `article`.
4. **Description (optional):** “Blog and article posts.”
5. **Create**.

### 5.2 Add fields

Add in this order (or any order; Field IDs must match).

| Display name | Field ID | Type | Required | Validation / notes |
|--------------|----------|------|----------|---------------------|
| Title | `title` | **Short text** | ✓ Yes | Main headline. |
| Slug | `slug` | **Short text** | ✓ Yes | **Unique**. URL: `/blog/[slug]`. |
| Category | `category` | **Reference** (One entry) | ✓ Yes | Only **Category**. |
| Summary | `summary` | **Rich text** | No | Article lead/summary; shown on article page and as plain-text preview on cards. |
| Feature Image | `featureImage` | **Media** (One file) | No | Hero image on article and cards. |
| Body | `body` | **Rich text** | ✓ Yes | Full article; paragraphs, headings, **hyperlinks**, **embedded images** (assets). |
| Related News | `relatedNews` | **References** (Many entries) | No | Only **Article**; shown as “Related News” on the article page. |
| Author | `author` | **Reference** (One entry) | No | Only **Author**. |
| Publish Date | `publishedDate` | **Date** | ✓ Yes | Use **date only** in field appearance if Contentful offers it; used for ordering and display (no time shown on site). |
| Meta Title | `metaTitle` | **Short text** | No | SEO title; falls back to Title. |
| Meta Description | `metaDescription` | **Long text** | No | SEO description; falls back to plain text from Summary. |

**Reference fields:**

- **Category:** Reference → **One entry** → allowed type **Category**.  
- **Author:** Reference → **One entry** → allowed type **Author**.  
- **Related News:** Reference → **Many entries** → allowed type **Article** only.

**Legacy (optional):** The app still reads `excerpt` (long text) and `featuredImage` if `summary` / `featureImage` are empty—useful while migrating. See **[ARTICLE_FIELD_MIGRATION.md](ARTICLE_FIELD_MIGRATION.md)**.

Save the content type.

---

## 6. Content type 4: Page

**Purpose:** Static pages (About Us, Contact Us, or future pages). The site picks “About” and “Contact” by slug.

### 6.1 Create the content type

1. **Content model** → **Add content type**.
2. **Name:** `Page`.
3. **API identifier:** `page`.
4. **Description (optional):** “Static pages (About, Contact, etc.).”
5. **Create**.

### 6.2 Add fields

| Display name | Field ID | Type | Required | Validation / notes |
|--------------|----------|------|----------|---------------------|
| Title | `title` | **Short text** | ✓ Yes | e.g. “About Us”, “Contact Us”. |
| Slug | `slug` | **Short text** | ✓ Yes | **Unique**. Must use `about-us` and `contact-us` for those two pages. |
| Body | `body` | **Rich text** | ✓ Yes | Page content. |
| Meta Title | `metaTitle` | **Short text** | No | SEO title. |
| Meta Description | `metaDescription` | **Long text** | No | SEO description. |

Save the content type.

---

## 7. Quick reference: Field IDs the app expects

Use these **exact** Field IDs when configuring fields. The app reads content by these IDs.

**Category**

- `name`, `slug`

**Author**

- `name`, `role`, `bio`, `avatar`

**Article**

- `title`, `slug`, `category`, `summary`, `featureImage`, `body`, `relatedNews`, `author`, `publishedDate`, `metaTitle`, `metaDescription`
- Legacy: `excerpt`, `featuredImage` (optional fallback)

**Page**

- `title`, `slug`, `body`, `metaTitle`, `metaDescription`

If you change a Field ID in Contentful, you must update the same name in the codebase (e.g. `src/lib/contentful.js`, `ArticleCard.js`, page components).

---

## 8. Content type API identifiers (for reference)

When you **fetch** content in code, you use the **content type API identifier**:

- `category` → Category entries  
- `author` → Author entries  
- `article` → Article entries  
- `page` → Page entries  

You set the API identifier when creating the content type (first step for each type above). It is often the lowercased, singular form of the name (e.g. “Article” → `article`).

---

## 9. Creating content after models are ready

1. **Categories**  
   Create first (e.g. Scriptures, Philosophy, Festivals, Temples, Traditions). Publish each.

2. **Authors (optional)**  
   Create and publish. Then assign to articles.

3. **Pages**  
   - About: slug `about-us`, title “About Us”, body = your about content.  
   - Contact: slug `contact-us`, title “Contact Us”, body = contact info.  
   Publish both.

4. **Articles**  
   Fill required fields (Title, Slug, Body, Category, Publish Date). Add Summary (rich text), Feature Image, Related News, Author, Meta Title, Meta Description as needed. Publish.

The home page uses articles ordered by **Published Date** (newest first); the blog list and filters use the same. About and Contact pages are resolved by slug `about-us` and `contact-us`.

---

## 10. Summary table (copy‑paste friendly)

| Content type | Fields (Field ID → type) |
|--------------|---------------------------|
| **Category** | `name` (Short text, required), `slug` (Short text, required, unique) |
| **Author** | `name` (Short text, required), `role` (Short text), `bio` (Long text), `avatar` (Media, one file) |
| **Article** | `title`, `slug` (unique), `category` (→ Category), `summary` (Rich text), `featureImage` (Media), `body` (Rich text), `relatedNews` (many → Article), `author` (→ Author), `publishedDate` (Date), `metaTitle`, `metaDescription` |
| **Page** | `title` (Short text, required), `slug` (Short text, required, unique), `body` (Rich text, required), `metaTitle` (Short text), `metaDescription` (Long text) |

This list and structure, plus the configuration steps above, are everything you need to set up and maintain the content models in your Contentful space.
