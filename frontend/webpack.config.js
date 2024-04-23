const path = require('path');
const webpack = require('webpack');
const BundleTracker = require('webpack-bundle-tracker');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, argv) => {
	const isProduction = argv.mode === 'production';

	return {
		entry: isProduction
			? './src/index.js'
			: [
					'webpack-dev-server/client?http://localhost:3000/', // Ensure this is the correct URL
					'webpack/hot/only-dev-server',
					'./src/index.js',
			  ],
		output: {
			filename: 'js/[name].[contenthash:8].js',
			chunkFilename: 'js/[name].[contenthash:8].chunk.js',
			path: isProduction
				? path.resolve(__dirname, 'dist')
				: path.resolve(__dirname, 'static', 'bundles'),
			publicPath: isProduction ? '/static/' : 'http://localhost:3000/',
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: [
								'@babel/preset-env',
								'@babel/preset-react',
							],
							plugins: ['@babel/plugin-transform-runtime'],
						},
					},
				},
				{
					test: /\.css$/,
					use: [
						isProduction
							? MiniCssExtractPlugin.loader
							: 'style-loader',
						'css-loader',
					],
				},
				{
					test: /\.(png|jpg|jpeg|gif|svg|ico|webp)$/i,
					type: 'asset/resource',
					generator: {
						filename: 'media/[name].[hash:8][ext]',
					},
				},
			],
		},
		plugins: [
			new webpack.HotModuleReplacementPlugin(),
			new BundleTracker({
				path: path.resolve(__dirname, 'static', 'bundles'),
				filename: 'webpack-stats.json',
			}),
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify(
					isProduction ? 'production' : 'development'
				),
				'process.env.REACT_APP_STRIPE_KEY': JSON.stringify(
					process.env.REACT_APP_STRIPE_KEY
				),
			}),
			new HtmlWebpackPlugin({
				template: isProduction
					? './public/index.prod.html'
					: './public/index.html',
				inject: true,
				minify: isProduction && {
					removeComments: true,
					collapseWhitespace: true,
					removeRedundantAttributes: true,
					useShortDoctype: true,
					removeEmptyAttributes: true,
					removeStyleLinkTypeAttributes: true,
					keepClosingSlash: true,
					minifyJS: true,
					minifyCSS: true,
					minifyURLs: true,
				},
			}),
			new MiniCssExtractPlugin({
				filename: 'css/[name].[contenthash:8].css',
				chunkFilename: 'css/[id].[contenthash:8].css',
			}),
			new CleanWebpackPlugin(),
		],
		optimization: {
			minimize: isProduction,
			minimizer: [
				new TerserPlugin({
					terserOptions: {
						format: {
							comments: false,
						},
					},
					extractComments: false,
				}),
			],
		},
		devServer: {
			static: {
				directory: path.join(__dirname, 'dist'),
				publicPath: '/',
			},
			historyApiFallback: true,
			hot: true,
			open: true,
			port: 3000,
			proxy: [
				{
					context: ['/api'],
					target: 'http://localhost:8000',
					changeOrigin: true,
					secure: false,
				},
			],
		},
		devtool: isProduction ? false : 'eval-source-map',
	};
};
