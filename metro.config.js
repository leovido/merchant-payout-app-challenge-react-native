const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Exclude test files from the app bundle. Jest globals (describe, it, expect) exist only when
// running Jest (via jest.setup.js); the app must never bundle test files.
const defaultBlockList = config.resolver.blockList;
const testFilePattern = /[/\\].*\.(test|spec)\.(ts|tsx|js|jsx)$/;
const testsDirPattern = /[/\\]__tests__[/\\]/;
config.resolver.blockList = Array.isArray(defaultBlockList)
	? [...defaultBlockList, testFilePattern, testsDirPattern]
	: [defaultBlockList, testFilePattern, testsDirPattern];

// Stub Node built-ins for msw/node when bundled in React Native (no Node runtime)
config.resolver.extraNodeModules = {
	...config.resolver.extraNodeModules,
	async_hooks: path.resolve(__dirname, "mocks/node-stubs/async_hooks.js"),
};

module.exports = config;
