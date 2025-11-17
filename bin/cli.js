#!/usr/bin/env node

import path from "path";
import {eztree, find} from "../index.js";

function runCLI(argv) {
    const args = argv.slice(2);
    let dirArg = null;
    let findArg = null;

    for (let i = 0; i < args.length; i++) {
        const a = args[i];
        if (a === '--find') {
            if (i + 1 < args.length) {
                findArg = args[i + 1];
                i++; // skip value
            }
            continue;
        }
        if (!dirArg) dirArg = a;
    }

    const targetPath = dirArg ? path.resolve(dirArg) : process.cwd();

    if (findArg) {
        const results = find(targetPath, findArg) || [];
        if (results.length === 0) {
            console.log(`No matches for ${findArg}`);
            return;
        }
        results.forEach(full => {
            const rel = path.relative(targetPath, full);
            if (!rel || rel === '') {
                console.log(path.basename(full));
            } else if (rel.startsWith('..')) {
                // outside the targetPath for safety print absolute
                console.log(full);
            } else {
                console.log('.' + path.sep + rel);
            }
        });
        return;
    }

    console.log(eztree(targetPath));
}

runCLI(process.argv);
