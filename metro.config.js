const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure proper resolver configuration for web compatibility
config.resolver.platforms = ['ios', 'android', 'native', 'web'];
config.resolver.alias = {
  '@': __dirname,
};

module.exports = config;