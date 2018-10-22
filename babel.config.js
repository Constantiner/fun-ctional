module.exports = api => {
	api.cache.never();
	const config = {
		presets: ["@babel/preset-env"],
		plugins: []
	};
	return config;
};
