module.exports = {
	collectCoverageFrom: [
		"<rootDir>/src/**/*.js",
		"!<rootDir>/src/index.js",
		"<rootDir>/src/**/*.ts",
		"!<rootDir>/src/index.ts"
	],
	coverageDirectory: "<rootDir>/coverage/",
	coverageThreshold: {
		global: {
			branches: 100,
			functions: 100,
			lines: 100,
			statements: 100
		}
	},
	testMatch: ["<rootDir>/__tests__/**/*.js"],
	testEnvironment: "node",
	transform: {
		"^.+\\.js$": "babel-jest",
		"^.+\\.ts$": "ts-jest"
	},
	testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/__tests__/test-utils/"],
	preset: "ts-jest/presets/js-with-babel",
	moduleDirectories: ["node_modules", "<rootDir>/src", "<rootDir>/__tests__"]
};
