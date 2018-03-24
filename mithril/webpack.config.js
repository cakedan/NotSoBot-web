const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

const path = require('path');

const DIR = {
	APP: path.resolve(__dirname, './src/client'),
	BUILD: path.resolve(__dirname, './src/public/build')
};

module.exports = {
	entry: [
		path.join(DIR.APP, 'js', 'app.js'),
		path.join(DIR.APP, 'scss', 'app.scss')
	],
	output: {
		filename: 'app.js',
		path: DIR.BUILD
	},
	module: {
		rules: [
			{
				test: /\.scss$/,
				include: [/node_modules/, path.join(DIR.APP, 'scss', 'app.scss')],
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader', 'sass-loader'
				]
			}
		]
	},
	plugins: [
		new MiniCssExtractPlugin({filename: 'app.css'}),
		new webpack.ProvidePlugin({
			'window.jQuery': 'jquery',
			'window.$': 'jquery'
		})
	]
};