const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');


const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const filename = ext => (isDev ? `[name].${ext}` : `[name].[fullhash].${ext}`);

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
    'css-loader',
    'postcss-loader'
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
  },
  output: {
    filename: `js/${filename('js')}`,
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
    open: isDev,
    publicPath: '',
  },
  devtool: isDev ? 'source-map' : 'nosources-source-map',
  plugins: [
    new HTMLWebpackPlugin({
      template: `${PATHS.src}/index.html`,
      minify: {
        collapseWhitespace: isProd
      },
      chunks: ['main'],
    }),
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
    new webpack.HotModuleReplacementPlugin(),
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
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: babelOptions(),
          },
        ],
      }
    ]
  },
};