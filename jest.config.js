module.exports = {
	preset: "jest-expo",
	moduleNameMapper: {
		// Force msw/node in Jest (jest-expo resolves with "react-native" and msw/node is null there)
		"^msw/node$": "<rootDir>/node_modules/msw/lib/node/index.js",
		// Resolve screen-security to a mock so CI does not need the real native module
		"^screen-security$": "<rootDir>/__mocks__/screen-security.js",
		"^screen-security/src/ScreenSecurityModule$":
			"<rootDir>/__mocks__/screen-security.js",
	},
	transformIgnorePatterns: [
		// Match both flat node_modules and pnpm's .pnpm store; allow ESM deps (immer, @reduxjs/toolkit, msw, react-redux, prism-nexus) to be transformed
		"node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-ng/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@reduxjs/toolkit|immer|until-async|react-redux|prism-nexus|\\.pnpm/[^/]+/node_modules/((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?|until-async|immer|@reduxjs/toolkit|react-redux|prism-nexus))",
	],
	setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
	collectCoverageFrom: [
		"app/**/*.{ts,tsx}",
		"components/**/*.{ts,tsx}",
		"features/**/*.{ts,tsx}",
		"!**/*.d.ts",
		"!**/node_modules/**",
	],
};
