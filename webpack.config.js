const webpack = require('webpack');
//const CleanPlugin = require('clean-webpack-plugin');
//const ExtractPlugin = require('extract-text-webpack-plugin');
const production = process.env.NODE_ENV;
// if (production) {
//     plugins = plugins.concat([
       
//     ]);
// }
module.exports = {
	entry:{
		common:'./src/css/base.css',
	},
	output:{
	     path:'dest/js',
	     filename:production?'[name]-[hash].js':'bundle.js',
	     chunkFilename:'[name]-[chunkhash].js',
	     publicPath:'dest/js'
	},
	module:{
		loaders:[{
			test:/.js$/,
			exclude:/node_modules/,
			loader:"babel-loader",
		},
		{
			test:/\.scss/,
			loader:'style!css!sass',
		},
		{
			test:/\.html/,
			loader:'html'
		},{
			test:/\.(png|gif|jpe?g|svg)/i,
			loader:'url',
			query:{
				limit:10000
			}
		}]
	},
	plugins:[
		//new ExtractPlugin('bundle.css',{allChunks: true}),
		//new CleanPlugin('bin'),
		// new webpack.optimize.UglifyJsPlugin({
		// 	compress:{
		// 		warnings:false,
		// 	},
		// 	output:{
		// 		comments:false,
		// 	},
		// }),
		new webpack.optimize.CommonsChunkPlugin({
			name:'main',
			children: true,
			minChunks:2,
		}),
		
		// new webpack.optimize.MinChunkSizePlugin({
  //           minChunkSize: 51200, // ~50kb
  //       }),
	]
};
