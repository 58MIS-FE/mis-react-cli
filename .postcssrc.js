module.exports = {
	"plugins": {
		"postcss-import": {
			path: [
				'src',
				'node_modules'
			]
		},
		"postcss-nesting": {
			prefix: null
		},
		"postcss-css-variables": {
			preserve: false
		},
		"postcss-cssnext": {
			browsers: [
				"> 1%",
			    "last 2 versions"
			]
		},
	}
}
