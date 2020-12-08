const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const PATHS = require('./paths');

const filename = ext => (isDev ? `[name].${ext}` : `[name].[fullhash].${ext}`);


module.exports = {
	// Входные файлы
	entry: {
		main: ['@babel/polyfill', `${PATHS.src}/index.jsx`],
	},

	// Выходные файлы
	output: {
		filename: `js/${filename('js')}`,
		path: `${PATHS.build}/`,
	},

	// Алиасы
	resolve: {
		extensions: ['.js', '.json', '.jsx'],
		alias: {
			'@components': `${PATHS.src}/components`,
			'@': PATHS.src,
		},
	},

	// Плагины
	plugins: [

		// Сброка html
		new HTMLWebpackPlugin({
			template: `${PATHS.src}/index.html`,
			minify: {
				collapseWhitespace: isProd
			},
			chunks: ['main'],
			filename: 'index.html',
		}),

		// Очистка от лишних файлов
		new CleanWebpackPlugin(),

		// Копирование картинок
		new CopyWebpackPlugin({
			patterns: [
				{
					from: `${PATHS.src}/${PATHS.assets}`,
					to: `${PATHS.build}/${PATHS.assets}`,
				},
			],
		}),

		new MiniCssExtractPlugin({
			filename: `css/${filename('css')}`,
		}),
	],

	// Файлы
	module: {
		rules: [
			// css
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'postcss-loader'
				],
			},

			// sass/sccs
			{
				test: /\.s[ac]ss$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'postcss-loader',
					'sass-loader'
				],
			},

			// images
			{
				test: /img\.svg$|\.(png|jpg|jpeg|gif)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							publicPath: '../',
							name: `assets/image/[name].[ext]`,
						}
					},
				],
			},

			// fonts
			{
				test: /font\.svg$|\.(ttf|woff|woff2|eot)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							publicPath: '../',
							name: `assets/fonts/[name].[ext]`,
						},
					},
				],
			},

			// js
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: [
								'@babel/preset-env'
							]
						},
					},
				],
			},
			
			// react jsx
			{
				test: /\.jsx$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: [
								'@babel/preset-env',
								'@babel/preset-react',
							],
							plugins: [
								'babel-plugin-styled-components'
							]
						},
					},
				],
			}
		]
	},
};
