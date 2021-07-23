import path from 'path'

export default {
  build: {
    rollupOptions: {
      external: ['phaser'],
      output: {
        // format: 'iife',
        globals: {
          phaser: 'Phaser',
        },
      },
    },
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
}
