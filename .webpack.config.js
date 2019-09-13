// Allows us to use import statement with rescripts
module.exports = config => {
  config.target = 'electron-renderer';
  return config;
};
