#!/usr/bin/env node
import { program } from 'commander';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

import { cancelPreviousBuilds } from '.';

const pkgContents = fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf-8');
const pkg = JSON.parse(pkgContents);

program
    .description(pkg.description)
    .version(pkg.version)
    .option('--dry-run', 'Performs a dry run, no builds are actually cancelled');
program.parse();

const opts = program.opts();
const { dryRun } = opts;

config();

cancelPreviousBuilds({
    dryRun
}).catch(err => {
    console.error(err);
    process.exit(1);
});
