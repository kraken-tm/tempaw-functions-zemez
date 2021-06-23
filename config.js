const
	action = require( 'tempaw-functions-zemez' ).action,
	preset = require( 'tempaw-functions-zemez' ).preset;

module.exports = {
	livedemo: {
		enable: true,
		server: {
			baseDir: "dev/",
			directory: false
		},
		port: 8000,
		open: false,
		notify: true,
		reloadDelay: 0,
		ghostMode: {
			clicks: false,
			forms: false,
			scroll: false
		}
	},
	sass: {
		enable: true,
		showTask: false,
		watch: `dev/scss/**/*.scss`,
		source: `dev/scss/custom/!(_)style.scss`,
		dest: 'dev/css/',
		options: {
			outputStyle: 'expanded',
			indentType: 'tab',
			indentWidth: 1,
			linefeed: 'cr'
		}
	},
	pug: {
		enable: true,
		showTask: false,
		watch: 'dev/pug/**/*.pug',
		source: 'dev/pug/pages/!(_)*.pug',
		dest: 'dev/',
		options: {
			pretty: true,
			verbose: true,
			emitty: true
		}
	},
	autoprefixer: {
		enable: false,
		options: {
			cascade: true,
			browsers: ['Chrome >= 45', 'Firefox ESR', 'Edge >= 12', 'Explorer >= 10', 'iOS >= 9', 'Safari >= 9', 'Android >= 4.4', 'Opera >= 30']
		}
	},
	watcher: {
		enable: true,
		watch: 'dev/js/**/*.js'
	},
	lint: {
		showTask: true,
		sass: [ 'dev/scss/*.scss', 'dev/scss/!(bootstrap)/**/*.scss' ],
		pug: 'dev/pug/**/*.pug',
		js: 'dev/js/**/!(*.min).js',
		html: 'dev/**/*.html'
	},
	cache: {
		showTask: true,
	},
	buildRules: {
		'util-backup': [
			action.pack({
				src: [ 'dev/**/*', '*.*' ], dest: 'versions/',
				name( dateTime ) { return `backup-${dateTime[0]}-${dateTime[1]}.zip`; }
			})
		]
	}
};
