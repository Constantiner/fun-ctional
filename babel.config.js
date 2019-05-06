module.exports = api => {
	api.cache.never();
	const config = {
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
	return config;
};
