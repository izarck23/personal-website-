import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const files = fs.readdirSync(src);
    for (const file of files) {
      copyRecursive(path.join(src, file), path.join(dest, file));
    }
  } else {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
  }
}

console.log('🔄 Syncing assets for GitHub export and production build...');

// 1. Sync auth-screens images to public/assets/images/auth-screens
copyRecursive(
  path.join(rootDir, 'assets/images/auth-screens'),
  path.join(rootDir, 'public/assets/images/auth-screens')
);

// 2. Sync templates to public/templates
copyRecursive(
  path.join(rootDir, 'templates'),
  path.join(rootDir, 'public/templates')
);

// 3. Sync js to public/js
copyRecursive(
  path.join(rootDir, 'js'),
  path.join(rootDir, 'public/js')
);

// 4. Sync css to public/css
copyRecursive(
  path.join(rootDir, 'css'),
  path.join(rootDir, 'public/css')
);

console.log('✅ Assets synced to public/ directory successfully.');
