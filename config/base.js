/**
 * @description webpack通用配置
 */

const path = require('path');

module.exports = {
	// 多页配置
	isMultiplePage: false,
	//多页面打包入口
	multiplePage:['admin','index'],
	//想要打包的页面
	entryPage: 'admin',
	// 是否启用异步加载功能
	isOpenSyncImport: true,
	// 最小chunk的大小
	minChunkSize: 10000,
	// dev模式下是否自动打开页面
	autoOpenBrowser: true,
	// 文件目录
	assetsRoot: path.resolve(__dirname, '../src'),
	// 静态资源目录
	assetsStatic: path.resolve(__dirname, '../static'),
	// 生成目录
	buildRoot: path.resolve(__dirname, '../dist'),
	// 静态资源根目录
	staticAssets: 'static',
	// 生成路径
	publicPath: '/',
	// 公用别名
	commonAlias: {
		Static: 'static',
		'@': './',
		'mis@': './index',
		'mis@comp': './js/components'
	},
	// 外部扩展
	externals: {

	},
	// 公众模块(默认情况下common／js文件下的文件作为`commons chunk`打包)
	commons: {
		// 'axios': 'axios'
	},
	// 要打包的外部资源库
	library: [
		"axios",
		"react",
		"react-dom",
		"react-router"
	],
	// 要引进外部资源库的页面(为空则全部引入)
	libraryEntry: [],
	// 本地开发端口
	port: 5858,
	// 本地开发代理
	proxy: {
		// '/api': {
		// 	target: "http://*.com",
		// 	changeOrigin: true,
		// 	pathRewrite: {
		// 		'^/api': ''
		// 	},
		// 	logLevel: 'error'
		// }
	}
}
