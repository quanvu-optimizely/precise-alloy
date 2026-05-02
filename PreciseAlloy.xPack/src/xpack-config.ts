import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

export interface XPackConfig {
  srcDir: string;
  outDir: string;
  publicDir: string;
  cssOutDir: string;
  statesOutputPath: string;
  stylesAbstractsDir: string;
  stylesFunctionsDir: string;
  stylesMixinsDir: string;
  stylesBaseDir: string;
  pagesGlob: string;
  statesGlob: string;
  aliases: Record<string, string>;
}

const defaults: XPackConfig = {
  srcDir: 'src',
  outDir: 'dist',
  publicDir: 'public',
  cssOutDir: 'public/assets/css',
  statesOutputPath: 'public/pl-states.json',
  stylesAbstractsDir: 'src/assets/styles/00-abstracts',
  stylesFunctionsDir: 'src/assets/styles/01-functions',
  stylesMixinsDir: 'src/assets/styles/01-mixins',
  stylesBaseDir: 'src/assets/styles/02-base',
  pagesGlob: '../src/pages/*.tsx',
  statesGlob: 'src/**/*.states.json',
  aliases: {
    '@atoms': 'src/atoms',
    '@molecules': 'src/molecules',
    '@organisms': 'src/organisms',
    '@templates': 'src/templates',
    '@pages': 'src/pages',
    '@assets': 'src/assets',
    '@helpers': 'src/_helpers',
    '@data': 'src/_data',
    '@_http': 'src/_http',
    '@_api': 'src/_api',
    '@mocks': 'src/mocks',
  },
};

let cachedConfig: XPackConfig | undefined;
let cachedRoot: string | undefined;

export const loadXPackConfig = async (projectRoot?: string): Promise<XPackConfig> => {
  const root = projectRoot ?? process.cwd();

  if (cachedConfig && cachedRoot === root) {
    return cachedConfig;
  }

  const configNames = ['xpack.config.ts', 'xpack.config.js', 'xpack.config.mjs', 'xpack.config.json'];

  for (const name of configNames) {
    const configPath = path.resolve(root, name);

    if (fs.existsSync(configPath)) {
      if (name.endsWith('.json')) {
        const raw = fs.readFileSync(configPath, 'utf-8');
        const resolved: XPackConfig = { ...defaults, ...JSON.parse(raw) };
        cachedConfig = resolved;
        cachedRoot = root;
        return resolved;
      }

      const mod = await import(pathToFileURL(configPath).href);
      const userConfig = mod.default ?? mod;
      const resolved: XPackConfig = { ...defaults, ...userConfig };
      cachedConfig = resolved;
      cachedRoot = root;
      return resolved;
    }
  }

  const resolved: XPackConfig = { ...defaults };
  cachedConfig = resolved;
  cachedRoot = root;
  return resolved;
};

export const loadXPackConfigSync = (projectRoot?: string): XPackConfig => {
  const root = projectRoot ?? process.cwd();

  if (cachedConfig && cachedRoot === root) {
    return cachedConfig;
  }

  const jsonPath = path.resolve(root, 'xpack.config.json');

  if (fs.existsSync(jsonPath)) {
    const raw = fs.readFileSync(jsonPath, 'utf-8');
    const resolved: XPackConfig = { ...defaults, ...JSON.parse(raw) };
    cachedConfig = resolved;
    cachedRoot = root;
    return resolved;
  }

  const resolved: XPackConfig = { ...defaults };
  cachedConfig = resolved;
  cachedRoot = root;
  return resolved;
};

export const getDefaults = (): XPackConfig => ({ ...defaults });

export const resetConfigCache = () => {
  cachedConfig = undefined;
  cachedRoot = undefined;
};
