import path from 'path';

import { root, srcRoot } from './paths';
import { loadXPackConfigSync } from './xpack-config';

const buildAlias = () => {
  const config = loadXPackConfigSync(root);

  const defaultAliases = [
    { find: '@atoms', replacement: path.resolve(srcRoot, 'atoms') },
    { find: '@molecules', replacement: path.resolve(srcRoot, 'molecules') },
    { find: '@organisms', replacement: path.resolve(srcRoot, 'organisms') },
    { find: '@templates', replacement: path.resolve(srcRoot, 'templates') },
    { find: '@pages', replacement: path.resolve(srcRoot, 'pages') },
    { find: '@assets', replacement: path.resolve(srcRoot, 'assets') },
    { find: '@helpers', replacement: path.resolve(srcRoot, '_helpers') },
    { find: '@data', replacement: path.resolve(srcRoot, '_data') },
    { find: '@_http', replacement: path.resolve(srcRoot, '_http') },
    { find: '@_api', replacement: path.resolve(srcRoot, '_api') },
    { find: '@mocks', replacement: path.resolve(srcRoot, 'mocks') },
    { find: '@xpack', replacement: path.resolve(root, 'xpack') },
  ];

  if (config.aliases) {
    const configAliases = Object.entries(config.aliases).map(([find, replacement]) => ({
      find,
      replacement: path.resolve(root, replacement),
    }));

    const configFinds = new Set(configAliases.map((a) => a.find));
    const merged = [
      ...defaultAliases.filter((a) => !configFinds.has(a.find)),
      ...configAliases,
    ];

    return merged;
  }

  return defaultAliases;
};

const alias = buildAlias();

export default alias;
