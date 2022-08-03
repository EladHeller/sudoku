module.exports = {
  presets: [
    ['@babel/preset-env', {
      modules: false,
      targets: {
        chrome: '70',
      },
    }],
    ['@babel/preset-typescript'],
  ],
  env: {
    test: {
      plugins: ['@babel/plugin-transform-modules-commonjs'],
      presets: ['@babel/preset-typescript'],
    },
  },
};
