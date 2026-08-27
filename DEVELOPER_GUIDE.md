# 🛠️ Developer Guide for Isaac (codertech)

Welcome to your official personal portfolio, project showcase, and technical blog codebase!

This website is built with a clean **HTML5, CSS3, and JavaScript (ES6+)** tech stack — **100% zero-build, zero-compiler architecture**.

It runs instantly in **Acode Editor (Android & Tablets)**, **VS Code (Desktop)**, **Sublime Text**, **GitHub Pages**, or by double-clicking `index.html` in any browser without needing Node.js, Vite, npm, or terminal builds!

---

## 📑 Table of Contents
1. [Editing in Acode Editor (Android/Mobile)](#-1-editing-in-acode-editor-android--mobile)
2. [Editing in Visual Studio Code (Desktop)](#-2-editing-in-visual-studio-code-desktop)
3. [Simple Blog Creation Workflow](#-3-simple-blog-creation-workflow)
4. [Updating Profile, Projects, & Services](#-4-updating-profile-projects--services)
5. [Free 1-Click Hosting & Deployment](#-5-free-1-click-hosting--deployment)
6. [File Structure Overview](#-6-file-structure-overview)

---

## 📱 1. Editing in Acode Editor (Android & Mobile)

Acode is the premier code editor on Android. Because this project uses pure HTML, CSS, and JavaScript, you can edit and preview the entire website directly on your Android phone or tablet!

### Quick Steps:
1. **Open Acode Editor**.
2. Tap the **Menu (☰)** > **Open Folder** and select this website's folder.
3. Open `index.html` or `js/data.js`.
4. Tap the **Play / Preview (▶)** button in Acode to instantly run the website in the built-in browser preview!
5. Any edit you make in `js/data.js`, `index.html`, or `css/style.css` is immediately reflected when you tap refresh.

---

## 💻 2. Editing in Visual Studio Code (Desktop)

### Quick Steps:
1. Open **VS Code**.
2. Click **File > Open Folder...** and select this project folder.
3. Install the **Live Server** extension (by Ritwick Dey) if you haven't already:
   - Press `Ctrl + Shift + X`, search for `Live Server`, and click **Install**.
4. Right-click `index.html` and click **"Open with Live Server"** (or click "Go Live" at the bottom right).
5. The website will open at `http://127.0.0.1:5500/index.html` with instant live-reload!

---

## ✍️ 3. Simple Blog Creation Workflow

You don't need to write HTML to create new blog posts. All blog posts live as simple JavaScript objects in **`js/data.js`**.

### How to Add a New Blog Post in 3 Steps:

1. Open `js/data.js` in Acode or VS Code.
2. Scroll to the `blogPosts: [` array (around line 455).
3. Copy the template below and paste it at the top of the `blogPosts: [` list:

```javascript
{
  id: 'my-new-kotlin-or-web-article',
  slug: 'my-new-kotlin-or-web-article',
  title: 'Your Article Title Here',
  excerpt: 'A 1-2 sentence summary of what this article covers for the card preview.',
  contentMarkdown: `## Introduction
Write your article here using standard Markdown headings, lists, and code blocks!

### Code Example
\`\`\`kotlin
fun main() {
    println("Hello from Isaac codertech!")
}
\`\`\`

### Key Takeaway
Summarize the main learning points for your readers.`,
  category: 'Kotlin', // Choose: 'Kotlin' | 'Web Dev' | 'Android' | 'Monetization'
  readTime: '5 min read',
  publishedAt: 'Aug 26, 2026',
  coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
  author: {
    name: 'Isaac (codertech)',
    role: 'Kotlin & Web Developer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  tags: ['Kotlin', 'Android', 'Compose', 'WebDev'],
  likesCount: 0,
  bookmarksCount: 0,
  viewsCount: 1,
  comments: []
},
```

4. Save `js/data.js`. Your new blog post will automatically appear on the home page, in the dedicated `#blog` directory, in search (⌘K), and has its own shareable link (`#/blog/my-new-kotlin-or-web-article`)!

---

## 👤 4. Updating Profile, Projects, & Services

All site data is centrally organized in `js/data.js`:

- **Profile & Bio**: Edit `window.PORTFOLIO_DATA.profile` (name, title, bio, email, stats).
- **Technical Skills**: Edit `window.PORTFOLIO_DATA.skills` (Kotlin, Android, HTML5, CSS3, JavaScript, etc.).
- **Projects**: Edit `window.PORTFOLIO_DATA.projects` (add your Kotlin Android apps, web apps, live URLs, GitHub links, and metric badges).
- **Services & Consulting**: Edit `window.PORTFOLIO_DATA.services` (service titles, pricing, delivery timelines, and features).
- **Process Steps**: Edit `window.PORTFOLIO_DATA.processSteps` (your 4-step client delivery roadmap).
- **Developer Products**: Edit `window.PORTFOLIO_DATA.monetizationProducts` (starter kits, blueprints, 1-on-1 mentorship).
- **Social Links**: Edit `window.PORTFOLIO_DATA.socialLinks` (GitHub, LinkedIn, Twitter/X, YouTube, Discord, Email).

---

## 🚀 5. Free 1-Click Hosting & Deployment

Because this project is pure HTML, CSS, and JavaScript with no build steps:

### GitHub Pages (Free & Instant):
1. Create a repository on GitHub (e.g., `codertech-portfolio`).
2. Push or upload your files (`index.html`, `css/`, `js/`, `assets/`, etc.).
3. In GitHub, go to **Settings > Pages**.
4. Set **Source** to **"Deploy from a branch"**, choose `main` branch and `/ (root)` folder.
5. Click **Save**. Your site is live at `https://<your-username>.github.io/codertech-portfolio/`!

### Netlify / Vercel / Cloudflare Pages:
- Simply drag-and-drop the project folder into Netlify Drop or connect your GitHub repo with **no build command** and **publish directory = `.`**.

---

## 📁 6. File Structure Overview

```text
├── index.html            # Main semantic HTML5 SPA layout & all modal views
├── js/
│   ├── data.js           # Central content source (profile, projects, blogs, services)
│   └── app.js            # Pure vanilla JS router, markdown parser, search, state
├── css/
│   └── style.css         # Custom animations, card hover effects, and typography
├── assets/
│   └── images/           # Generated developer & mascot illustrations
├── DEVELOPER_GUIDE.md    # This complete developer documentation
└── metadata.json         # Project metadata
```

Everything is lightweight, performant, and 100% customizable in Acode, VS Code, or any text editor!
