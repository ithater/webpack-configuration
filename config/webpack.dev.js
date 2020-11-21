const { merge } = require('webpack-merge');

const webpack = require('webpack');

const base = require('./webpack.base');


module.exports = merge(base, {
	// Режим разработки
	mode: 'development',
	target: 'web',

	// Control how source maps are generated
	devtool: 'inline-source-map',

	// Оптимизация
	optimization: {
		splitChunks: {
			chunks: 'all',
		}
	},

	// Spin up a server for quick development
	devServer: {
		open: true,
		compress: true,
		hot: true,
		port: 5500,
		publicPath: '/',
		watchContentBase: true,

	},

	plugins: [
		// Only update what has changed on hot reload
		new webpack.HotModuleReplacementPlugin(),
	],
});



