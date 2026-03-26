# Contentful Tokens – Step-by-Step Setup

This guide walks you through the Contentful web interface to get the tokens and IDs you need for **Khabar for India**.

You will end up with **two tokens** in your `.env.local`:
1. **Delivery API token** – used by your Next.js app to **read** content.
2. **Content Management token** – used by the script to **create content types** (optional; only if you run `npm run contentful:create-model`).

---

## Part 1: Open your Space and API Keys

1. Go to **[app.contentful.com](https://app.contentful.com)** and log in.
2. On the **left sidebar**, click your **space name** (e.g. “Khabar for India” or “My space”).  
   - You must be inside a space (you’ll see Content, Content model, etc. in the sidebar).
3. Click the **gear icon** at the bottom of the left sidebar.  
   - This opens **Settings** for your space.
4. In Settings, in the left menu, click **API keys**.  
   - You’ll see a list of API keys (there is often one “Content delivery / preview” key by default).

---

## Part 2: Get Space ID and Delivery API Token (for your website)

These are used by your Next.js app to fetch content. They go in `.env.local` as `CONTENTFUL_SPACE_ID` and `CONTENTFUL_ACCESS_TOKEN`.

### Step 2.1 – Find your Space ID

1. Stay on **Settings → API keys**.
2. Click one of the API keys in the list (e.g. “Content delivery / preview” or the default key).
3. On the key’s page you’ll see:
   - **Space ID** (e.g. `abc123xyz`)
   - **Content Delivery API – access token** (long string)
   - **Content Preview API – access token** (optional; for drafts)
4. Copy the **Space ID** and paste it into `.env.local` as:
   ```env
   CONTENTFUL_SPACE_ID=paste_here
   ```

### Step 2.2 – Copy the Delivery API token

1. On the same API key page, find **“Content delivery API – access token”**.
2. Click **Show** or the copy icon to reveal/copy the token.
3. Paste it into `.env.local` as:
   ```env
   CONTENTFUL_ACCESS_TOKEN=paste_here
   ```

**Optional:** To create a **new** API key instead of using the default one:

1. Go to **Settings → API keys**.
2. Click **Add API key**.
3. Give it a name (e.g. “Khabar for India – Delivery”).
4. You’ll see the new **Space ID** and **Content delivery API – access token** for this key. Use those in `.env.local` as above.

Your `.env.local` should now have at least:

```env
CONTENTFUL_SPACE_ID=your_space_id_here
CONTENTFUL_ACCESS_TOKEN=your_delivery_token_here
```

The website uses these to load content. You can stop here if you only need the app to work.

---

## Part 3: Get Content Management Token (for the content-model script)

You need this **only if** you want to run `npm run contentful:create-model` to create content types via script. The Content Management token has write access to your space, so keep it secret.

### Step 3.1 – Open Content management tokens

1. In Contentful, go to **Settings** (gear icon in the left sidebar).
2. In the Settings left menu, click **API keys**.
3. On the API keys page you’ll see either:
   - **Tabs** at the top: e.g. **“Content delivery / preview”** and **“Content management tokens”**.  
     → Click the **“Content management tokens”** tab.
   - Or a single list with a section or link for **“Content management tokens”** or **“Personal access tokens”**.  
     → Open that section.
4. You should now see the list of Content management / personal access tokens and a button like **“Create personal access token”** or **“Generate personal access token”**.

### Step 3.2 – Generate a personal access token

1. On the **Content management tokens** page, click:
   - **“Generate personal access token”**, or  
   - **“Create token”**, or  
   - **“Generate new token”**
2. Give the token a **name** (e.g. “Khabar – create content model”).
3. If asked for **permissions** or **scope**:
   - Choose access to **this space** (or “Content management”).
   - You need at least permission to manage content model / content types.
4. Click **Generate** (or **Create**).
5. **Copy the token immediately** – Contentful usually shows it only once. If you don’t copy it, you’ll need to generate a new token later.
6. Paste it into `.env.local` as:
   ```env
   CONTENTFUL_MANAGEMENT_TOKEN=paste_here
   ```

**If you don’t see “Content management tokens”:**

- It may be under your **organization** or **user** settings rather than space settings. Try:
  - Top-right **profile/avatar** → **Developer options** or **Personal access tokens**.
  - Or **Organization** (if you have multiple) → **Settings** → **API keys** / **Tokens**.
- Contentful’s UI can vary by plan; the option might be named **“Personal access tokens”** or **“CMA tokens”**.

**About “Authorize” for tokens:**  
The **Authorize** button next to a token only appears if your **organization** has **“Token authorization enforcement”** turned on. Many organizations do not have this, so you will **not** see Authorize—and that’s normal. You can skip authorization in that case; your token should still work. If you do see Authorize, click it and select the organization that contains your space.

---

## Part 4: Check your `.env.local`

Your `.env.local` in the project root should look like this (with your real values):

```env
# Required for the Next.js app (reading content)
CONTENTFUL_SPACE_ID=your_actual_space_id
CONTENTFUL_ACCESS_TOKEN=your_actual_delivery_token

# Optional – only for running: npm run contentful:create-model
CONTENTFUL_MANAGEMENT_TOKEN=your_actual_management_token
```

- **No quotes** around the values.
- **No spaces** around the `=` sign.
- **Restart the dev server** after changing `.env.local` (`npm run dev`).

---

## Part 5: Verify

### Delivery token (website)

1. Save `.env.local` with `CONTENTFUL_SPACE_ID` and `CONTENTFUL_ACCESS_TOKEN`.
2. Run `npm run dev` and open the site.
3. If content types and entries exist, the home page or blog should load (or show “No articles yet” if the space is empty).  
   If you get a build/runtime error about Contentful, the Space ID or delivery token is wrong or missing.

### Management token (script)

1. Add `CONTENTFUL_MANAGEMENT_TOKEN` to `.env.local`.
2. Run:
   ```bash
   npm run contentful:create-model
   ```
3. If the script creates (or skips) the four content types without errors, the management token is correct.

---

## Quick reference

| What you need        | Where in Contentful                         | Used for                          |
|----------------------|---------------------------------------------|-----------------------------------|
| **Space ID**         | Settings → API keys → (any key) → Space ID  | App + script                      |
| **Delivery token**   | Same key → Content delivery API – access token | Next.js app (read content)       |
| **Management token** | Content management tokens → Generate token  | `contentful:create-model` script |

---

## Troubleshooting

- **“The access token you sent does not have access to the requested resource”**  
  - **If this happens when running the app (website):** Use the **Content delivery API** token in `CONTENTFUL_ACCESS_TOKEN` (from Settings → API keys → your key → “Content delivery API – access token”). Do not put the management token here.  
  - **If this happens when running `npm run contentful:create-model`:** Use a **Content management (personal access) token** in `CONTENTFUL_MANAGEMENT_TOKEN` (from Settings → API keys → **Content management tokens** tab → Create personal access token). Do not put the delivery token here.  
  - **Authorize (only if your org has it):** Some organizations have “Token authorization enforcement” enabled. Only then do you see **Authorize** in the Content management tokens list—click it and select the organization that contains your space. If you **don’t** see Authorize anywhere, your org doesn’t use this; skip it and try the steps below.  
  - **Try a new token:** Create a **new** personal access token (Content management tokens → Create personal access token), copy it once, put it in `CONTENTFUL_MANAGEMENT_TOKEN` in `.env.local`, and run the script again.  
  - **Check Space ID:** Ensure `CONTENTFUL_SPACE_ID` in `.env.local` is the **exact** Space ID shown on the same Contentful page as your **delivery** API key (Settings → API keys → your delivery key → Space ID).  
  - **Verify:** Run `npm run contentful:verify` to test both tokens without exposing them.

- **“Invalid space” or 404**  
  Double-check **Space ID** (no extra spaces, correct key). Make sure you’re in the right space in the Contentful UI.

- **“Unauthorized” or 401**  
  The **access token** is wrong or revoked. Generate a new delivery or management token and update `.env.local`.

- **“Access denied” when running the script**  
  The **Content Management token** doesn’t have permission to change the content model. Create a new token and ensure it has Content management / “Manage content model” (or equivalent) for your space. If your org uses token authorization, **Authorize** the token for your organization (see above).

- **Changes not showing on the site**  
  Restart the dev server after editing `.env.local`. Clear browser cache if needed.

If you tell me which step you’re on (e.g. “I’m in Settings but don’t see Content management tokens”), I can give you exact labels to look for in your current screen.
