import type { XPackConfig } from '@quanvu-optimizely/xpack/config';

const config: Partial<XPackConfig> = {
  srcDir: 'src',
  outDir: 'dist',
  cssOutDir: 'public/assets/css',
  statesOutputPath: 'public/pl-states.json',
  stylesAbstractsDir: 'src/assets/styles/00-abstracts',
  stylesFunctionsDir: 'src/assets/styles/01-functions',
  stylesMixinsDir: 'src/assets/styles/01-mixins',
  stylesBaseDir: 'src/assets/styles/02-base',
  pagesGlob: '../src/pages/*.tsx',
  statesGlob: 'src/**/*.states.json',
};

export default config;
