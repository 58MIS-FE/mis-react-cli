/**
 * @description webpack配置
 */

const
	path = require('path'),
	Glob = require('glob').Glob,
	base = require('./base');

let { mapObject, arrToObj } = require('./util');

function getPath(...args) {
	return path.join(base.assetsRoot, ...args);
}

function getEntrySetting() {
	let result = {
		entry: {},
		template: []
	};

	new Glob('!(_)*/!(_)*.html', {
		cwd: getPath('mis'),
		sync: true
	})
		.found
		.forEach(file => {
			let pageName = file.split('/')[0];

			result.entry[pageName] = getPath('mis', pageName, 'js', 'index.js');
			result.template.push(getPath('mis', file));
		});

	return result;
}

let setting = getEntrySetting();

let baseConfig = Object.assign({}, base, {
	entry: base.isMultiplePage ? setting.entry : { index: getPath('mis/index/js/index.js') },
	template: base.isMultiplePage ? setting.template : [getPath('mis/index/index.html')],
	outputPath: base.buildRoot,
	commonAlias: mapObject(base.commonAlias, value => getPath(value))
});

module.exports = {
	build: Object.assign({
		env: require('./prod.env'),
		sourceMap: '#source-map'
	}, baseConfig),
	'build:d': Object.assign({
		env: require('./prod-d.env'),
		sourceMap: '#source-map'
	}, baseConfig),
	dev: Object.assign({
		env: require('./dev.env')
	}, baseConfig)
}
