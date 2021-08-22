// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  optimize: {
    bundle: true,
    minify: true,
    treeshake: true,
    splitting: true,
    sourcemap: false,
    target: 'es2018',
  },
  mount: {
    public: {url: '/', static: true},
    src: '/',
  },
};
