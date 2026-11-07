const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const FRONTEND_DIR = __dirname;

function resolveVersion() {
  if (process.env.BUILD_VERSION) {
    return process.env.BUILD_VERSION.trim();
  }
  if (process.env.GITHUB_SHA) {
    return process.env.GITHUB_SHA.slice(0, 8);
  }
  try {
    const gitHash = execSync('git rev-parse --short HEAD', {
      cwd: FRONTEND_DIR,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim();
    if (gitHash) {
      return gitHash;
    }
  } catch (_) {}
  const now = new Date();
  return now.toISOString().replace(/\D/g, '').slice(0, 14);
}

function findHtmlFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const item of list) {
    if (['node_modules', '.git'].includes(item)) continue;
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(findHtmlFiles(fullPath));
    } else if (item.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

function applyCacheBusting(version) {
  const targetDirs = [FRONTEND_DIR];
  const distDir = path.join(FRONTEND_DIR, 'dist');
  if (fs.existsSync(distDir) && !targetDirs.includes(distDir)) {
    targetDirs.push(distDir);
  }

  const allHtmlFiles = new Set();
  targetDirs.forEach(dir => {
    findHtmlFiles(dir).forEach(file => allHtmlFiles.add(file));
  });

  console.log(`🔄 Applying cache-busting (v=${version}) across ${allHtmlFiles.size} HTML files...`);

  let updatedCount = 0;
  let totalLinksUpdated = 0;

  allHtmlFiles.forEach(filePath => {
    const originalContent = fs.readFileSync(filePath, 'utf8');

    let matchCount = 0;
    // 1. Update local CSS <link> tags
    let updatedContent = originalContent.replace(
      /(<link\b[^>]*?\bhref=["'])(?!(?:https?:|\/\/|data:))([^"']+?\.css)(?:\?[^"']*)?(["'][^>]*>)/gi,
      (match, p1, p2, p3) => {
        matchCount++;
        return `${p1}${p2}?v=${version}${p3}`;
      }
    );

    // 2. Update local JS <script> tags
    updatedContent = updatedContent.replace(
      /(<script\b[^>]*?\bsrc=["'])(?!(?:https?:|\/\/|data:))([^"']+?\.js)(?:\?[^"']*)?(["'][^>]*>)/gi,
      (match, p1, p2, p3) => {
        matchCount++;
        return `${p1}${p2}?v=${version}${p3}`;
      }
    );

    if (updatedContent !== originalContent) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      updatedCount++;
      totalLinksUpdated += matchCount;
    }
  });

  console.log(`✅ Cache-busting complete: ${totalLinksUpdated} asset references updated in ${updatedCount} files.`);
  return { updatedCount, totalLinksUpdated, version };
}

if (require.main === module) {
  const version = resolveVersion();
  applyCacheBusting(version);
}

module.exports = { resolveVersion, applyCacheBusting };
