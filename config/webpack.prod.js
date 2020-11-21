
const { merge } = require('webpack-merge');

const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

const base = require('./webpack.base');

module.exports = merge(base, {
	// Режим продакшена
	mode: 'production',
	target: 'browserslist',

	// Control how source maps are generated
	devtool: false,

	// Оптимизация
	optimization: {
		splitChunks: {
			chunks: 'all',
		},
		minimizer: [
			new OptimizeCssAssetsWebpackPlugin(),
			new TerserWebpackPlugin(),
		],
	},

});



