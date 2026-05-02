#!/usr/bin/env node
import { Command } from 'commander';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgPath = path.resolve(__dirname, '..', 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

const program = new Command();

program
  .name('xpack')
  .description('PreciseAlloy xPack — build toolchain for pattern library projects')
  .version(pkg.version);

program
  .command('generate')
  .description('Scaffold config + entry files in consumer project')
  .action(async () => {
    const { runGenerate } = await import('./commands/generate.js');
    await runGenerate();
  });

program
  .command('styles')
  .description('Run SCSS compilation')
  .option('--watch', 'Watch for changes')
  .action(async () => {
    await import('./styles.js');
  });

program
  .command('scripts')
  .description('Run script compilation')
  .action(async () => {
    await import('./scripts.js');
  });

program
  .command('dev')
  .description('Start Vite dev server')
  .option('--mode <mode>', 'Vite mode', 'development')
  .action(async () => {
    await import('./server.js');
  });

program
  .command('build')
  .description('Run production build')
  .action(async () => {
    const { execSync } = await import('child_process');
    execSync('vite build --outDir dist/static', { stdio: 'inherit', cwd: process.cwd() });
  });

program
  .command('prerender')
  .description('Run prerendering')
  .option('--add-hash', 'Add asset hashes')
  .option('--mode <mode>', 'Vite mode', 'production')
  .action(async () => {
    await import('./prerender.js');
  });

program
  .command('integrate')
  .description('Run integration build')
  .option('--mode <mode>', 'Vite mode', 'production')
  .action(async () => {
    await import('./integration.js');
  });

program
  .command('states')
  .description('Generate state JSON')
  .option('--watch', 'Watch for changes')
  .action(async () => {
    await import('./states.js');
  });

program.parse();
