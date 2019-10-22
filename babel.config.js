const browsers = require("./package.json").browserslist;

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
						browsers
					},
					modules: false
				}
			],
			["@babel/preset-typescript"]
		],
		plugins: []
	};
};
