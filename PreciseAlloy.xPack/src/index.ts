export { loadXPackConfig, loadXPackConfigSync, getDefaults, resetConfigCache } from './xpack-config';
export type { XPackConfig } from './xpack-config';

export { root, srcRoot, outDir, xpackEnv, mode, getAbsolutePath } from './paths';

export { default as alias } from './alias';

export { prepareCssFileContent, stripInjectedPreludeFromSourceMap, getStylesOutputFileName } from './styles-core';

export { default as viteConfig } from './config';
