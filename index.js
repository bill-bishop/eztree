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

//
// Integration notes:
// - Make sure to run `chmod +x index.js` if on Unix/Mac.
// - Usage: `node index.js [optional-path]` or `npx ./index.js [optional-path]`
// - For module usage: import { eztree, someFunction, runCLI } from './index.js'
//