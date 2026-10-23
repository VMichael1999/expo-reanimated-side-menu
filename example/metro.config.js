// Serves the library straight from ../src, so edits show up without building it.
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const root = path.resolve(__dirname, '..');
const config = getDefaultConfig(__dirname);

config.watchFolders = [root];
// Only the example's node_modules: the library's own dev copies of react and react-native would
// otherwise be loaded twice.
config.resolver.nodeModulesPaths = [path.resolve(__dirname, 'node_modules')];
config.resolver.disableHierarchicalLookup = true;
config.resolver.extraNodeModules = {
  'expo-reanimated-side-menu': path.join(root, 'src'),
};

module.exports = config;
