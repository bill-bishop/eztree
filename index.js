#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const IGNORE_DIRS = new Set(['node_modules', '.git', 'coverage', '.angular', '.vscode', '.idea', '__pycache__']);

export function eztree(dir, prefix = '') {
  let output = '';
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (e) {
    return;
  }
  entries = entries.filter(entry => !IGNORE_DIRS.has(entry.name));
  entries.sort((a, b) => a.name.localeCompare(b.name));
  entries.forEach((entry, idx) => {
    const isLast = idx === entries.length - 1;
    const pointer = isLast ? '└── ' : '├── ';
    output += prefix + pointer + entry.name + '\n';
    if (entry.isDirectory()) {
      const nextPrefix = prefix + (isLast ? '    ' : '│   ');
      output += eztree(path.join(dir, entry.name), nextPrefix);
    }
  });

  return output;
}

// Find files matching a requested filename in a tolerant way.
// Usage: import { find } from './index.js' or via CLI --find
export function find(dir, target) {
  const results = [];
  if (!target || typeof target !== 'string') return results;

  const normalize = (s) => {
    if (!s) return '';
    // drop extension, lowercase, remove dashes/underscores and any non-alphanumerics
    const noExt = s.replace(/\.[^.]+$/, '');
    return noExt.toLowerCase().replace(/[-_]/g, '').replace(/[^a-z0-9]/g, '');
  };

  const normTarget = normalize(target);
  if (!normTarget) return results;

  function walk(d) {
    let entries;
    try {
      entries = fs.readdirSync(d, { withFileTypes: true });
    } catch (e) {
      return;
    }
    entries = entries.filter(entry => !IGNORE_DIRS.has(entry.name));
    entries.forEach(entry => {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile && entry.isFile()) {
        const normName = normalize(entry.name);
        if (normName === normTarget) results.push(full);
      }
    });
  }

  walk(dir);
  return results;
}

// Integration notes:
// - Make sure to run `chmod +x index.js` if on Unix/Mac.
// - Usage: `node index.js [optional-path]` or `npx ./index.js [optional-path]`
// - For module usage: import { eztree, find } from './index.js'
