# 🚀 codertech — Isaac's Developer Portfolio & Tech Platform

A personal developer portfolio, technical blog, and online monetization website for **Isaac (codertech)**. Built with a clean, ultra-fast **HTML5, CSS3, and JavaScript** tech stack.

> **Developer:** Isaac (`isaacapptech23developer@gmail.com`)  
> **Brand:** codertech  
> **Compatibility:** 100% Native support for **Acode Editor (Android)**, **VS Code**, **GitHub Pages**, **Vercel**, and any browser.
> **Documentation:** Full customization guide available in [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)

---

## ⚡ How to Run

### 📱 Running in Acode Editor (Android & Mobile) — Zero Setup Needed!
1. **Open Acode App** on your Android device.
2. Select **Open Folder** and pick this project directory.
3. Open `index.html`.
4. Tap the **Play (▶) button** in the top bar of Acode.
5. 🎉 Your website opens instantly in Acode's internal browser with live interactive modals, search (⌘K), filter buttons, and animations!

### 💻 Running in Visual Studio Code (VS Code)
1. **Open project folder** in VS Code.
2. Right click `index.html` → **"Open with Live Server"** (or open `index.html` directly in any web browser like Chrome, Edge, Safari, or Firefox).
3. Alternatively, you can also use `npm run dev` to launch the dev server.

---

## ✏️ How to Customize Data (Projects, Blogs, Services)

All content is conveniently structured in **`js/data.js`**:
- **Update Bio & Profile**: Edit `initialProfileConfig` (email, skills, stats, socials).
- **Add a Project**: Add an entry to `projectsData` (title, tech stack, screenshots, live demo link, GitHub link, metrics).
- **Add a Blog Post**: Add an entry to `blogPostsData` with Markdown content, code blocks, read time, and tags.
- **Add a Service / Pricing**: Add an entry to `servicesData`.
- **Add a Digital Product**: Add an entry to `monetizationProductsData`.

---

## 🔍 Google Search & SEO Ranking Included

The website includes search engine optimization (SEO) configurations:
- **Rich Meta Tags**: Complete OpenGraph, Twitter Cards, canonical links, and viewport settings in `index.html`.
- **Schema.org Structured Data (JSON-LD)**: `Person` (Isaac), `WebSite`, `ProfessionalService`, and `FAQPage`.
- **XML Sitemap**: Accessible at [`public/sitemap.xml`](./public/sitemap.xml) or [`sitemap.xml`](./sitemap.xml).
- **Robots Directive**: [`robots.txt`](./robots.txt) configured to allow search crawlers.

---

## 🚀 Free Hosting & 1-Click Deployment

### GitHub Pages (100% Free)
1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit of codertech website"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
2. On GitHub: Go to **Settings → Pages → Source** and choose **Deploy from a branch** (`main` / root).
3. Your site is live immediately at `https://<your-username>.github.io/<your-repo-name>/`!

---

## 🛡️ Blank-Screen & Crash Protections Included
- **No Node/Compiler Dependency Required**: Can run directly from a static file path or local server.
- **Defensive Error Handling**: Safe DOM selectors and event listeners.
- **Safe Clipboard Fallback**: Uses `document.execCommand` when `navigator.clipboard` is restricted in iframe/webview environments.
- **Safe LocalStorage Handlers**: Wrapped in defensive `try...catch` blocks.
