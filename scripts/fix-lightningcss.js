// Fix Lightning CSS native binary placement on Windows
// This script tries to copy the native .node file to locations where nested deps expect it.
// It is safe to run multiple times.

const fs = require('fs');
const path = require('path');

function exists(p) {
  try { fs.accessSync(p); return true; } catch { return false; }
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyIfPossible(src, dest) {
  if (!exists(src)) return false;
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
  console.log(`[lightningcss-fix] Copied -> ${dest}`);
  return true;
}

(function main() {
  try {
    const root = process.cwd();
    const src = path.join(root, 'node_modules', 'lightningcss-win32-x64-msvc', 'lightningcss.win32-x64-msvc.node');

    // Primary destination (direct lightningcss)
    const dest1 = path.join(root, 'node_modules', 'lightningcss', 'lightningcss.win32-x64-msvc.node');
    // Nested destination (tailwindcss internal lightningcss)
    const dest2 = path.join(root, 'node_modules', '@tailwindcss', 'node', 'node_modules', 'lightningcss', 'lightningcss.win32-x64-msvc.node');

    let ok = false;
    ok = copyIfPossible(src, dest1) || ok;
    ok = copyIfPossible(src, dest2) || ok;

    if (!ok) {
      console.log('[lightningcss-fix] Source binary not found, skipping.');
    }
  } catch (e) {
    console.warn('[lightningcss-fix] Warning:', e.message);
    process.exit(0); // Do not fail install
  }
})();
