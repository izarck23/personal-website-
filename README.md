# codertech — Software Developer, Tech Creator & Digital Products

A portfolio, tech blog, and online monetization website for **codertech (Isaac)**. Built with React 19, TypeScript, Tailwind CSS, and Motion.

---

## 🚀 Hosting on GitHub Pages

This repository is pre-configured for GitHub Pages hosting with **no blank screens, no crashes, and zero 404 errors**.

### Method 1: Automatic Deployment with GitHub Actions (Recommended)

1. **Push this repository to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of codertech website"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```

2. **Enable GitHub Pages via GitHub Actions**:
   - Go to your repository on GitHub: **Settings → Pages**
   - Under **Build and deployment → Source**, select **"GitHub Actions"**
   - That's it! The included `.github/workflows/deploy.yml` workflow will automatically build and deploy the website every time you push to `main`.

3. **Visit your live website**:
   Your site will be live at:
   `https://<your-username>.github.io/<your-repo-name>/` (or your custom domain).

---

### Method 2: Manual Local Build & Push

If you prefer building locally:

1. **Build the production static bundle**:
   ```bash
   npm install
   npm run build
   ```
   This generates the production static files inside the `dist/` directory with relative asset paths.

2. **Deploy the `dist` folder**:
   - Push the contents of the `dist/` folder to the `gh-pages` branch, or host it on any static hosting provider (Vercel, Netlify, Cloudflare Pages, Firebase Hosting, AWS S3).

---

## 🛡️ Blank-Screen & Crash Protections Included

- **Relative Asset Resolution (`base: './'`)**: Works flawlessly whether hosted on a root domain (`https://codertech.dev`), root GitHub account (`https://username.github.io`), or repository subfolder (`https://username.github.io/portfolio/`).
- **SPA 404 Fallback (`public/404.html`)**: Prevents 404 blank screens when refreshing or bookmarking nested routes on GitHub Pages.
- **Jekyll Bypassed (`public/.nojekyll`)**: Ensures GitHub Pages does not skip Vite-bundled assets or underscore files.
- **Safe Clipboard Utility**: Uses fallback `execCommand` when modern `navigator.clipboard` is unavailable or restricted.
- **Graceful Error Boundary**: Prevents white-screen crashes by catching runtime exceptions and providing one-click recovery options.
- **Safe LocalStorage Handlers**: Wrapped in defensive `try...catch` blocks to protect against private browsing storage blocks.

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run TypeScript linter
npm run lint

# Build production bundle
npm run build
```
