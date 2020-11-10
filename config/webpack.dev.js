const { merge } = require('webpack-merge');

const webpack = require('webpack');

const base = require('./webpack.base');
const PATHS = require('./paths');

module.exports = merge(base, {
	// Режим разработки
	mode: 'development',

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
		historyApiFallback: true,
		contentBase: PATHS.build,
		open: true,
		compress: true,
		hot: true,
		// inline: true,
		port: 5500,
	},

	plugins: [
		// Only update what has changed on hot reload
		// new webpack.HotModuleReplacementPlugin(),
	],
});



