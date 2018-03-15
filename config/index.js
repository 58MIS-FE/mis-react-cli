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

//判断是否在数组中
function IsInArray(arr,val){
	if(arr.length == 0) return true
	 let testStr = arr.join(",")
  　　return testStr.indexOf(val)!= -1;
}

function getEntrySetting() {
	let result = {
		entry: {},
		template: []
	};

	new Glob('!(_)*/!(_)*.html', {
		cwd: getPath('./'),
		sync: true
	})
		.found
		.forEach(file => {
			let pageName = file.split('/')[0];
            if (IsInArray(base.multiplePage,pageName)) {
              result.entry[pageName] = getPath(pageName, 'index.js');
              result.template.push(getPath(file));
            }
		});
		console.log(result,'result')
	return result;
}

let setting = getEntrySetting();

let baseConfig = Object.assign({}, base, {
	entry: base.isMultiplePage ? setting.entry : { index: getPath(`${base.entryPage}/index.js`) },
	template: base.isMultiplePage ? setting.template : [getPath(`${base.entryPage}/index.html`)],
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
