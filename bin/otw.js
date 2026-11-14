#!/usr/bin/env node
import { mainOrExit } from '#lib/cli/main';

await mainOrExit(process.argv.slice(2));
