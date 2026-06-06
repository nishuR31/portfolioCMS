// scripts/fix-imports.js
// This script walks through all .ts files in the backend/src directory, finds import statements
// that use a relative path without an explicit file extension, and appends `.js` to the path.
// It skips imports that already end with .js, .ts, .json, .mjs, .cjs, or are absolute/module imports.

import fs from "fs";
import path from "path";

const srcDir = path.resolve(process.cwd(), "src");

// Recursively collect .ts files (exclude .d.ts)
function getTsFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...getTsFiles(fullPath));
        } else if (entry.isFile() && entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) {
            files.push(fullPath);
        }
    }
    return files;
}

function fixImportLine(line) {
    // Match import statements like: import X from "../path"; or import "../path";
    const importRegex = /^(\s*import\s+(?:[^'";]+\s+from\s+)?["'])(\.\.?\/[^'";]+)(["'];)/;
    const match = line.match(importRegex);
    if (!match) return line;
    const [, prefix, importPath, suffix] = match;
    // If path already has an extension, leave untouched
    if (/\.(js|ts|json|mjs|cjs)$/i.test(importPath)) return line;
    const newPath = `${importPath}.js`;
    return `${prefix}${newPath}${suffix}`;
}

function processFile(filePath) {
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split(/\r?\n/);
    let changed = false;
    const newLines = lines.map((ln) => {
        const newLn = fixImportLine(ln);
        if (newLn !== ln) changed = true;
        return newLn;
    });
    if (changed) {
        fs.writeFileSync(filePath, newLines.join("\n"), "utf-8");
        console.log(`Updated: ${filePath}`);
    }
}

const tsFiles = getTsFiles(srcDir);
for (const file of tsFiles) {
    processFile(file);
}
console.log('Import fix completed.');
