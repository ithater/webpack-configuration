const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const filename = ext => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`);

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all',
    }
  };
  
  if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetsWebpackPlugin(),
      new TerserWebpackPlugin(),
    ];
  }

  return config;
};
const cssLoaders = extra => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: isDev,
        reloadAll: true,
      },
    }, 
    'css-loader'
  ];

  if (extra) loaders.push(extra);

  return loaders;
};
const babelOptions = (preset, plugins) => {
  const options = {
    presets: [
      '@babel/preset-env'
    ]
  };

  if (preset) options.presets.push(preset);
  if (plugins) options.plugins.push(plugins);

  return options;
};

const PATHS = {
  dist: path.resolve(__dirname, 'dist'),
  src: path.resolve(__dirname, 'src'),
  assets: '/assets',
};

module.exports = {
  mode: 'development',
  entry: {
    main: ['@babel/polyfill', './src/index.js'],
    analytics: './src/analytics.js',
  },
  output: {
    filename: filename('js'),
    path: `${PATHS.dist}/`,
  },
  resolve: {
    extensions: ['.js', '.json'], 
    alias: {
      '@modules': `${PATHS.src}/modules`,
      '@': PATHS.src,
    },
  },
  optimization: optimization(),
  devServer: {
    port: 4200,
    hot: isDev,
    inline: true,
    hot: true,
  },
  devtool: isDev ? 'sourse-map' : '',
  plugins: [
    new HTMLWebpackPlugin({
      template: `${PATHS.src}/index.html`,
      minify: {
        collapseWhitespace: isProd
      },
      alwaysWriteToDisk: true,
    }),
    new HtmlWebpackHarddiskPlugin(),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: `${PATHS.src}/${PATHS.assets}/image`,
          to: `${PATHS.dist}/${PATHS.assets}/image`,
        },
        {
          from: `${PATHS.src}/${PATHS.assets}/fonts`,
          to: `${PATHS.dist}/${PATHS.assets}/fonts`,
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: `css/${filename('css')}`,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: cssLoaders(),
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders('sass-loader'),
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        use: ['url-loader'],
      },
      {
        test: /\.(ttf|woff|woff2|eot|svg)/,
        use: ['url-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: {
          loader: 'babel-loader',
          options: babelOptions(),
        },
      }
    ]
  },
};