module.exports = {
	mode: "development",
	entry: {
		"renderer": ["./src/renderer/index.tsx"],
		"main": ["./src/main/main.tsx"]
	},
	output: {
		filename: "[name].js",
		path: __dirname + "/dist"
	},
	devtool: "source-map",
	resolve: {
		extensions: [".ts", ".tsx", ".js", ".json"]
	},
	experiments: {
		topLevelAwait: true,
	},
	module: {
		rules: [{
			test: /\.tsx?$/,
			loader: "ts-loader",
		},
		{
			test: /\.css$/,
			use: [{
				"loader": "style-loader"
			},
			{
				"loader": "css-loader"
			},
			]
		},
		{
			test: /\.scss$/,
			use: [{
				"loader": "style-loader"
			},
			{
				"loader": "css-loader"
			},
			{
				"loader": "sass-loader"
			},
			]
		},
		{
			test: /\.ico$/,
			use: [{
				loader: 'file-loader'
			},],
		},
		]
	},
	plugins: [],
	ignoreWarnings: [/Failed to parse source map/],
	target: "electron-renderer"
}