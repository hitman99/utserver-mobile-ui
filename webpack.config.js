var webpack = require('webpack');

module.exports = {
    entry: './react-code/app.jsx',
    output: { path: __dirname + '/public/static/', filename: 'bundle.js' },
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react']
                }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.LoaderOptionsPlugin({
            debug: true
        })
    ],
    resolve: {
        extensions: ['.js', '.jsx']
    },
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    }
};