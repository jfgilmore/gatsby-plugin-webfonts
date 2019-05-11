import path from 'path';
import fs from 'fs-extra';

import createOptions from './create-options';
import webFonts from './web-fonts';

export const onPreBootstrap = async (
  { cache, createContentDigest, store },
  pluginOptions
) => {
  const { directory } = store.getState().program;

  const cacheFolder = path.join(directory, '.cache', 'webfonts');
  const publicFolder = path.join(directory, 'public', 'static', 'webfonts');

  const options = createOptions({ ...pluginOptions, cacheFolder });

  const optionsCacheKey = `options-${createContentDigest(options)}`;

  if (!cache.get(optionsCacheKey)) {
    await webFonts(options);
    cache.set(optionsCacheKey, options);
  }

  const filter = src => path.extname(src) !== '.css';
  await fs.copy(cacheFolder, publicFolder, { filter });
};
