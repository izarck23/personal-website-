# 🛠️ Developer Guide for Isaac (codertech)

Welcome to your personal portfolio and tech blog codebase! This website is built with **React 19, TypeScript, Vite, and Tailwind CSS**.

It is engineered to run seamlessly across **Visual Studio Code (Desktop)**, **Acode Editor (Android & Mobile)**, and any standard terminal or cloud host.

---

## 📑 Table of Contents
1. [Running in Visual Studio Code](#-1-running-in-visual-studio-code-vs-code)
2. [Running in Acode Editor (Android & Mobile)](#-2-running-in-acode-editor-android--mobile)
3. [How to Add Anything (Projects, Blogs, Services)](#-3-how-to-add-anything)
4. [Google Search Ranking & SEO Optimization](#-4-google-search-ranking--seo-optimization)
5. [Deploying to Production](#-5-deploying-to-production)

---

## 💻 1. Running in Visual Studio Code (VS Code)

### Prerequisites
- **Node.js (v18 or newer)** installed on your computer. (Download from [nodejs.org](https://nodejs.org))
- **Git** installed.

### Quick Start in VS Code
1. **Open the project folder**:
   - Open VS Code, click **File > Open Folder...**, and select the project root folder.
2. **Open the integrated terminal**:
   - Press <kbd>Ctrl</kbd> + <kbd>`</kbd> (or `Terminal > New Terminal`).
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the local development server**:
   ```bash
   npm run dev
   ```
5. **Open in browser**:
   - Click the link in the terminal: `http://localhost:3000`
   - Any code changes you make will instantly reload in the browser!

### Built-in VS Code Features
- **Auto-Formatting on Save**: Pre-configured in `.vscode/settings.json`.
- **Recommended Extensions**: When prompted, click **Install All** for Tailwind CSS IntelliSense, TypeScript Next, and ESLint.
- **VS Code Tasks**: Press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>B</kbd> to quickly run `npm run dev` or `npm run build`.

---

## 📱 2. Running in Acode Editor (Android & Mobile)

Acode is the premier code editor on Android. You can write code, add blog posts, and preview your website directly from your phone or tablet.

### Method A: Full Node.js Environment with Termux (Recommended)
This method lets you run the actual Vite dev server directly on Android with live reload.

1. **Install Termux** from [F-Droid](https://f-droid.org/en/packages/com.termux/) or GitHub Releases (avoid outdated Play Store version).
2. **Open Termux** and set up Node.js & Git:
   ```bash
   pkg update && pkg upgrade -y
   pkg install nodejs git -y
   termux-setup-storage
   ```
3. **Navigate to your project directory**:
   ```bash
   cd ~/storage/shared/codertech-website
   # Or clone your repository:
   # git clone https://github.com/<your-username>/codertech.git
   # cd codertech
   ```
4. **Install dependencies and start dev server**:
   ```bash
   npm install
   npm run dev -- --host
   ```
5. **Open in your mobile browser**:
   - Go to `http://localhost:3000` (or `http://127.0.0.1:3000`) in Chrome, Firefox, or Kiwi Browser.
6. **Edit in Acode**:
   - Open **Acode**, tap **Open Folder**, select the project folder, and start editing!

### Method B: Static Build & Acode In-App Live Server
If you want to edit and preview static builds inside Acode:
1. Build the production files:
   ```bash
   npm run build
   ```
2. In Acode, install the **Live Server** or **HTML Preview** plugin from Acode Settings > Plugins.
3. Open `dist/index.html` and click the **Play / Preview** icon.

---

## ✏️ 3. How to Add Anything

All content is managed in **`/src/data/portfolioData.ts`**. You don't need to write complex HTML or CSS—just edit standard TypeScript objects!

---

### A. How to Update Your Profile, Bio & Social Links
Open `src/data/portfolioData.ts` and edit `initialProfileConfig`:

```typescript
export const initialProfileConfig: ProfileConfig = {
  brandName: 'codertech',
  creatorName: 'Isaac',
  heroBadge: 'FULL-STACK DEVELOPER & TECH CREATOR ❤️',
  heroHeadline: 'I build digital experiences & tech solutions',
  heroHeadlineAccent: 'people love.',
  heroBio: 'Hi! I\'m Isaac (codertech), a software developer & tech creator turning ideas into clean, fast, and scalable digital solutions.',
  email: 'isaacapptech23developer@gmail.com',
  github: 'https://github.com/your-username',
  twitter: 'https://twitter.com/your-handle',
  linkedin: 'https://linkedin.com/in/your-profile',
  youtube: 'https://youtube.com/@your-channel',
  discord: 'https://discord.gg/your-invite',
};
```

---

### B. How to Add a New Project
In `src/data/portfolioData.ts`, add a new object to the `projectsData` array:

```typescript
{
  id: 'my-awesome-app',
  title: 'QuickBill — Automated Invoicing for Freelancers',
  tag: 'SAAS WEB APP',
  category: 'saas', // 'web' | 'mobile' | 'saas' | 'devtool' | 'monetization'
  shortDescription: 'Send branded invoices and accept crypto or Stripe payments in 30 seconds.',
  fullDescription: 'QuickBill simplifies financial bookkeeping for independent software developers with automated payment reminders and webhook notifications.',
  accentColor: '#6C5CE7',
  badgeBg: 'bg-purple-50',
  badgeText: 'text-purple-600',
  techStack: ['React 19', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Stripe API'],
  metrics: [
    { label: 'Active Users', value: '1,200+' },
    { label: 'Payments Handled', value: '$250K+' }
  ],
  liveUrl: 'https://quickbill.example.com',
  githubUrl: 'https://github.com/codertech/quickbill',
  deviceType: 'laptop', // 'laptop' | 'mobile' | 'dashboard'
  highlights: [
    'Sub-second invoice rendering with PDF generator',
    'Custom Stripe Connect onboarding and split payments',
    'Offline draft caching in browser LocalStorage'
  ]
}
```

---

### C. How to Add a New Blog Post
In `src/data/portfolioData.ts`, add a new entry to `blogPostsData`:

```typescript
{
  id: 'how-to-scale-react-apps-2026',
  slug: 'how-to-scale-react-apps-2026',
  title: 'How to Scale React 19 Applications in 2026: State, Suspense & Caching',
  excerpt: 'A deep dive into architecture patterns that keep large React codebases clean, performant, and maintainable.',
  contentMarkdown: `## Modern React Architecture

When building apps with dozens of interactive components, performance optimization requires smart boundaries.

### 1. Granular Component Isolation
Avoid storing global state for local interactions.

\`\`\`typescript
// Clean, isolated hook pattern
export function useFeatureState() {
  const [data, setData] = useState<Item[]>([]);
  return { data, setData };
}
\`\`\`

### Summary
Keep components focused, use TypeScript types strictly, and measure rendering costs with React DevTools!`,
  category: 'Frontend',
  readTime: '5 min read',
  publishedDate: 'Aug 25, 2026',
  likesCount: 142,
  viewsCount: 3200,
  coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
  author: {
    name: 'Isaac',
    role: 'Full-Stack Developer @ codertech',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  tags: ['React', 'TypeScript', 'Architecture', 'WebDev']
}
```

---

### D. How to Add a Digital Product / Starter Kit
In `src/data/portfolioData.ts`, add to `monetizationProductsData`:

```typescript
{
  id: 'mobile-starter-kit',
  title: 'React Native + Expo Pro Starter Kit',
  subtitle: 'Launch cross-platform iOS & Android apps in under 48 hours.',
  description: 'Production-ready mobile codebase with offline SQLite sync, biometric auth, and RevenueCat in-app subscriptions.',
  price: '$49',
  originalPrice: '$99',
  badge: 'POPULAR',
  type: 'Source Code & Boilerplate',
  rating: '4.9 ★ (88 sales)',
  deliveryTime: 'Instant GitHub Access & ZIP Download',
  highlights: [
    'Biometric FaceID & Fingerprint authentication',
    'Dark mode & fluid 60fps animations',
    'Stripe & Apple In-App Purchase integration'
  ]
}
```

---

## 🔍 4. Google Search Ranking & SEO Optimization

This website has been built with search engine optimization (SEO) best practices:

### 1. Claim Google Search Console
1. Visit [Google Search Console](https://search.google.com/search-console).
2. Add your property: `https://codertech.dev` (or your GitHub Pages domain).
3. Choose **HTML Tag verification**.
4. Copy the verification string and paste it in `index.html`:
   ```html
   <meta name="google-site-verification" content="PASTE_YOUR_CODE_HERE" />
   ```
5. Commit and push. Click **Verify** in Google Search Console!

### 2. Submit Your Sitemap
- In Google Search Console, go to **Sitemaps**.
- Enter: `sitemap.xml`
- Google will automatically crawl and index your homepage, all project views, and all blog posts.

### 3. Rich Snippets Included
- **Schema.org Person**: Tells Google your name (Isaac), brand (codertech), job title, skills, and social profiles.
- **Schema.org FAQPage**: Displays your FAQs directly in Google search dropdowns.
- **OpenGraph & Twitter Cards**: High-resolution share previews when links are shared on Twitter/X, LinkedIn, Discord, and WhatsApp.

---

## 🚀 5. Deploying to Production

### Free GitHub Pages Deployment
1. Initialize and push your repository:
   ```bash
   git init
   git add .
   git commit -m "feat: launch Isaac codertech website"
   git branch -M main
   git remote add origin https://github.com/<your-github-username>/<your-repo-name>.git
   git push -u origin main
   ```
2. In your GitHub repository:
   - Go to **Settings > Pages**
   - Under **Build and deployment > Source**, select **"GitHub Actions"**
3. Your site will automatically build and publish!

### Free Vercel / Netlify 1-Click Deployment
1. Sign in to [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
2. Click **Add New Project** and select your GitHub repository.
3. Keep default settings (`Framework: Vite`, `Build: npm run build`, `Output: dist`).
4. Click **Deploy**. Done!
