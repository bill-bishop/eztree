#!/usr/bin/env node

import path from "path";
import {eztree} from "../index.js";

function runCLI(argv) {
    const targetPath = argv[argv.length - 1] === argv[1] ? process.cwd() : path.resolve(argv[argv.length - 1]);
    console.log(
        eztree(targetPath)
    );
}

runCLI(process.argv);