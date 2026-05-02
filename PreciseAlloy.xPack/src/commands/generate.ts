import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const TEMPLATES: { file: string; content: string }[] = [
  {
    file: 'xpack.config.ts',
    content: `import type { XPackConfig } from '@quanvu-optimizely/xpack/config';

const config: Partial<XPackConfig> = {
  srcDir: 'src',
  outDir: 'dist',
  cssOutDir: 'public/assets/css',
  statesOutputPath: 'public/pl-states.json',
};

export default config;
`,
  },
  {
    file: 'vite.config.ts',
    content: `import config from '@quanvu-optimizely/xpack/vite-plugin';

export default config;
`,
  },
];

export const runGenerate = async () => {
  const cwd = process.cwd();

  for (const template of TEMPLATES) {
    const dest = path.resolve(cwd, template.file);

    if (fs.existsSync(dest)) {
      console.log(chalk.yellow(`  skip: ${template.file} (already exists)`));
      continue;
    }

    fs.writeFileSync(dest, template.content);
    console.log(chalk.green(`  created: ${template.file}`));
  }

  console.log(chalk.green('\nDone! Run `xpack dev` to start developing.'));
};
