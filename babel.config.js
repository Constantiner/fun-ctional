const BROWSERS = [">0.25%", "not ie 11", "not op_mini all"];

module.exports = api => {
	if (api.env("test")) {
		return {
			presets: [
				[
					"@babel/preset-env",
					{
						targets: {
							node: "current"
						}
					}
				]
			],
			plugins: []
		};
	}
	return {
		presets: [
			[
				"@babel/preset-env",
				{
					targets: {
						browsers: BROWSERS
					},
					modules: false
				}
			]
		],
		plugins: []
	};
};
