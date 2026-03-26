# Updating the Article content type (existing space)

If your **Article** type was created with the old fields (`excerpt`, `featuredImage`), align it with the app. The code supports **both** old and new field IDs during transition.

## Option A: Script (recommended)

From the project root (with `CONTENTFUL_SPACE_ID` and `CONTENTFUL_MANAGEMENT_TOKEN` in `.env.local`):

```bash
npm run contentful:update-article
```

This adds any **missing** fields: `summary` (Rich text), `featureImage` (Media), `relatedNews` (many references to Article). It publishes the content type when done.

If both **`featuredImage`** (legacy) and **`featureImage`** exist, the script removes **`featuredImage`** so only **Feature Image** (`featureImage`) remains. Copy images from the old field to **Feature Image** on each article before running, if needed.

It does **not** delete **`excerpt`**. It may rename the **Published Date** label to **Publish Date** for `publishedDate`.

---

## Option B: Manual in Contentful

If you prefer the UI, follow the steps below.

## Target Article fields (field IDs)

| Display name   | Field ID         | Type                         | Required |
|----------------|------------------|------------------------------|----------|
| Title          | `title`          | Short text                   | Yes      |
| Slug           | `slug`           | Short text (unique)          | Yes      |
| Category       | `category`       | Reference → Category (one)   | Yes      |
| Summary        | `summary`        | **Rich text**                | No       |
| Feature Image  | `featureImage`   | Media (one file)             | No       |
| Body           | `body`           | Rich text                    | Yes      |
| Related News   | `relatedNews`    | **References → Article (many)** | No    |
| Author         | `author`         | Reference → Author (one)     | No       |
| Publish Date   | `publishedDate`  | **Date** (use date-only in UI if offered) | Yes |
| Meta Title     | `metaTitle`      | Short text                   | No       |
| Meta Description | `metaDescription` | Long text                 | No       |

## Steps in Contentful

1. **Content model** → open **Article**.
2. **Add field** → **Summary** → type **Rich text** → Field ID `summary` → Save.
3. **Add field** → **Feature Image** → **Media**, one file → Field ID `featureImage` → Save.  
   - If you already have **Featured Image** (`featuredImage`), you can keep it: the app still reads `featuredImage`. Optionally migrate assets to `featureImage` and remove the old field later.
4. **Add field** → **Related News** → **References** → **Many references** → allow only **Article** → Field ID `relatedNews` → Save.
5. **Publish date without time:** Edit **Published Date** / **Publish Date** field → in field settings / appearance, choose **Date only** if Contentful shows that option. The field type stays **Date**; editors pick only the date.
6. **Optional cleanup:** If you added **Summary**, you can stop using **Excerpt** and remove it after copying content into Summary (the app still falls back to `excerpt` for cards/meta if `summary` is empty).
7. **Save** the content type and **publish** the content type if prompted.

## Rich text: images and links in Body

In **Body** (and optionally **Summary**), editors can use:
- Paragraphs, headings, lists, quotes
- **Hyperlinks** (add link in the rich text editor)
- **Embedded assets** (images): use “Embed” / “Embedded asset” in the rich text field so images appear in the article

Ensure the rich text field validation allows **embedded assets** and **hyperlinks** (default in Contentful usually does).

## Related News

Pick other **Article** entries in **Related News**. They appear in a “Related News” block at the bottom of the article page (above the author box).
