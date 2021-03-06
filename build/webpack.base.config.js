const
    path = require('path')
    webpack = require('webpack')
    Glob = require('glob').Glob;

const
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

const { nowConfig, pathJoin } = require('./util');

const config = nowConfig();

function getPath(...args) {
    return pathJoin(config.assetsRoot, ...args);
}

function getCommonsChunk() {
    return new Glob('!(_)*/!(_)*.js', {
            cwd: getPath('common'),
            sync: true
        })
        .found
        .map(file => getPath('common', file));
}

const commonsChunk = config.isOpenSyncImport ? {} : Object.assign({
    common: getCommonsChunk()
}, config.commons);

function getCommonsChunkPluginSetting() {
    return config.isOpenSyncImport
        ? config.minChunkSize
            ? [
                // 设置chunk的最小大小
                new webpack.optimize.MinChunkSizePlugin({
                    minChunkSize: config.minChunkSize || 10000
                })
            ]
            : []
        : [
            // 公用模块抽离
            new webpack.optimize.CommonsChunkPlugin({
                names: ['manifest'].concat(Object.keys(commonsChunk)),
                minChunk: function(module) {
                    return module.context && module.context.index('node_modules') !== -1;
                }
            })
        ]
}


/**
 * 将需要的全局资源(项目static目录下的文件)插入到指定的html文件中
 * @param {要插入的全局资源的名称, Array[string]} assetsPath 
 * @param {要插入的页面, Array[string]} injectHtml 
 */
function generateCommonAssetArg (assetsPath, injectHtml) {
    return assetsPath.map(pathItem => {
        return {
            filepath: pathJoin(config.assetsStatic, pathItem),
            publicPath: pathJoin(config.publicPath, config.staticAssets, path.dirname(pathItem)),
            outputPath: pathJoin(config.staticAssets, path.dirname(pathItem)),
            files: injectHtml.map(entry => `${entry}.html`),
            typeOfAsset: path.extname(pathItem).slice(1),
            includeSourcemap: false
        }
    });
}


module.exports = {
    entry: Object.assign({}, config.entry, commonsChunk),

    output: {
        path: config.buildRoot,
        filename: pathJoin('js', '[name].[hash].js'),
        chunkFilename: pathJoin('js', '[name].[hash].js'),
        publicPath: config.publicPath
    },

    resolve: {
        extensions: ['.js', '.json', '.css'],
        alias: config.commonAlias
    },

    externals: config.externals,

    module: {
        rules: [
            {
                test: /\.js[x]?$/,
                include: [
                    config.assetsRoot,
                    path.resolve(__dirname, '..', 'text')
                ],
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: [
                            'css-loader',
                            'postcss-loader'
                        ]
                    })
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: pathJoin(config.staticAssets, 'images/[name].[hash:8].[ext]')
                    }
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)$/i,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: pathJoin(config.staticAssets, 'fonts/[name].[hash:8].[ext]')
                    }
                }
            }
        ]
    },

    plugins: [
        // 提取css
        new ExtractTextPlugin({
            filename: pathJoin('css', '[name].[hash:8].css')
        }),

        // 检测外部依赖包是否更新
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require(`${config.assetsStatic}/libs/js/manifest_vendors.json`)
        }),

        // 插入自定义文件插入到html中
        new AddAssetHtmlPlugin([
            {
                filepath: pathJoin(config.assetsStatic, 'libs/js/vendors.js'),
                publicPath: pathJoin(config.publicPath, config.staticAssets, 'libs/js'),
                outputPath: pathJoin(config.staticAssets, 'libs/js'),
                files: config.libraryEntry.map(entry => entry + '.html'),
                includeSourcemap: false
            },
            ...generateCommonAssetArg(config.injectStatic, config.injectHtml)
        ])
    ].concat(getCommonsChunkPluginSetting())
}
