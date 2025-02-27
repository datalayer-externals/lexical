/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import react from '@vitejs/plugin-react';
import {resolve} from 'path';
import {defineConfig} from 'vite';

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        nested: resolve(__dirname, 'app.html'),
      },
    },
  },
  plugins: [
    react(),
    // This is only used for development in the lexical repository
    ...(process.env.LEXICAL_MONOREPO === '1'
      ? [
          (
            await import(
              '../../packages/shared/lexicalMonorepoPlugin' as string
            )
          ).default(),
        ]
      : []),
  ],
}));
