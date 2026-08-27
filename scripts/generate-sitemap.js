/**
 * ============================================================================
 * Sitemap Generator for CODERTECH Portfolio & Blog
 * ============================================================================
 * Usage: node scripts/generate-sitemap.js
 * 
 * Reads `js/data.js` directly and generates an updated `public/sitemap.xml`
 * with exact SEO priorities, change frequencies, and publication timestamps.
 * ============================================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataFilePath = path.join(__dirname, '../js/data.js');
const sitemapOutputPath = path.join(__dirname, '../public/sitemap.xml');

try {
  const dataFileContent = fs.readFileSync(dataFilePath, 'utf8');

  // Safely evaluate window.PORTFOLIO_DATA in a sandbox
  const sandbox = { window: {} };
  const fn = new Function('window', dataFileContent);
  fn(sandbox.window);

  const data = sandbox.window.PORTFOLIO_DATA || {};
  const baseUrl = 'https://codertech.dev';
  const today = new Date().toISOString().split('T')[0];

  const corePages = [
    { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${baseUrl}/#/projects`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${baseUrl}/#/blog`, priority: '0.9', changefreq: 'daily' },
    { loc: `${baseUrl}/#services`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${baseUrl}/#process`, priority: '0.7', changefreq: 'monthly' },
    { loc: `${baseUrl}/#monetize`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/#socials`, priority: '0.7', changefreq: 'monthly' },
    { loc: `${baseUrl}/#faq`, priority: '0.6', changefreq: 'monthly' }
  ];

  const blogEntries = (data.blogPosts || []).map(post => ({
    loc: `${baseUrl}/#/blog/${post.slug}`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.85'
  }));

  const projectEntries = (data.projects || []).map(proj => ({
    loc: `${baseUrl}/#project-${proj.id}`,
    lastmod: today,
    changefreq: 'monthly',
    priority: '0.80'
  }));

  const allEntries = [...corePages, ...blogEntries, ...projectEntries];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n`;
  xml += `        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n`;
  xml += `        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n`;

  allEntries.forEach(entry => {
    xml += `  <url>\n`;
    xml += `    <loc>${entry.loc}</loc>\n`;
    if (entry.lastmod) {
      xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
    }
    if (entry.changefreq) {
      xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
    }
    if (entry.priority) {
      xml += `    <priority>${entry.priority}</priority>\n`;
    }
    xml += `  </url>\n`;
  });

  xml += `</urlset>\n`;

  fs.writeFileSync(sitemapOutputPath, xml, 'utf8');
  console.log(`✅ Sitemap successfully generated with ${allEntries.length} URLs at ${sitemapOutputPath}`);
} catch (err) {
  console.error('❌ Error generating sitemap:', err);
  process.exit(1);
}
