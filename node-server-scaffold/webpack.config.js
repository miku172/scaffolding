

const path = require("path");
const fs = require('fs');
const terserWebpackPlugin = require('terser-webpack-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');

const isProduction = process.env.NODE_ENV == "production";

module.exports = function (env, argvs) {
  const config = Object.assign({});
  config.mode = isProduction ? 'production' : 'development';
  config.entry = { '_root_': './index.ts' };
  config.output = {};
  config.output.clean = {};
  config.output.compareBeforeEmit = false;
  const dirs = fs.readdirSync('./subPackages', { encoding: 'utf-8' });
  for (let i in dirs) {
    config.entry[dirs[i]] = `./subPackages/${dirs[i]}/main/node/index.ts`;
  }
  config.output.filename = (pathData) => {
    return pathData.chunk.name === '_root_' ? 'index.js' : '[name]/index.js';
  };
  config.output.libraryTarget = 'umd';
  config.module = {};
  const rules = [];
  rules.push({
    test: /\.ts$/,
    use: 'ts-loader',
  });
  config.module.rules = rules;
  config.module.parser = { javascript: { dynamicImportMode: 'lazy' } };
  config.resolve = { extensions: ['.js', '.ts', '.json', '.json5', '.ini'] };
  config.optimization = { minimize: false, minimizer: [new terserWebpackPlugin({ extractComments: false, terserOptions: { format: { comments: false } } })] };
  config.cache = { type: 'filesystem', cacheDirectory: path.resolve(__dirname, '.cache'), cacheLocation: path.resolve(__dirname, '.cache'), hashAlgorithm: 'md5', maxAge: 24 * 60 * 60 * 1000, store: 'pack' };
  config.target = 'node';
  config.watch = false;
  config.watchOptions = { aggregateTimeout: 600, ignored: ['node_modules', '.cache'], poll: 800 };
  config.performance = { hints: !isProduction ? false : 'error' };
  const externals = [];
  for (let i in dirs) {
    externals.push(`./subPackages/${dirs[i]}/main/resources`);
    externals.push(`./subPackages/${dirs[i]}/test`);
  }
  config.externals = externals;
  config.plugins = [];
  const patterns = [];
  for (let i in dirs) {
    if (!fs.existsSync(`./subPackages/${dirs[i]}/main/resources`)) continue;
    const files = fs.readdirSync(`./subPackages/${dirs[i]}/main/resources`);
    if (!files.length) continue;
    patterns.push({
      from: `./subPackages/${dirs[i]}/main/resources`,
      to: path.resolve(__dirname, 'dist', dirs[i], 'resources'),
      toType: 'dir'
    });
  }
  const isExsists = fs.existsSync(path.resolve(__dirname, 'my.ini'));
  if(isExsists){
    patterns.push({
      from: `./my.ini`,
      to: path.resolve(__dirname, 'dist', 'my.ini'),
      toType: 'file'
    });
  }
  config.plugins.push(new copyWebpackPlugin({ patterns }));
  return config;
}
