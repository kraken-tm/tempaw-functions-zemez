const
	gulp          = require( 'gulp' ),
	gutil         = require( 'gulp-util' ),
	browserSync   = require( 'browser-sync' ),
	plumber       = require( 'gulp-plumber' ),
	sass          = require( 'gulp-sass' ),
	pug           = require( 'gulp-pug' ),
	sourcemaps    = require( 'gulp-sourcemaps' ),
	autoprefixer  = require( 'gulp-autoprefixer' ),
	emitty        = require( 'emitty' ).setup( 'dev', 'pug' ), // Hardcode
	gulpIf        = require( 'gulp-if' ),
	htmlValidator = require( 'gulp-html-validator' ),
	cache         = require( 'gulp-cache' ),
	Balloon       = require( 'node-notifier' ).WindowsBalloon,
	notifier      = new Balloon();

function htmlValidateFormatter ( report ) {
	report.messages.forEach( function ( message ) {
		if ( !global.globalLintReport ) global.globalLintReport = {};
		switch( message.type ) {
			case 'error':
				console.log( gutil.colors.red( '⨂' ), message.message );
				if ( !global.globalLintReport.htmlErrors ) global.globalLintReport.htmlErrors = 0;
				global.globalLintReport.htmlErrors += 1;
				break;
			case 'info':
				console.log( gutil.colors.yellow( '⚠' ), message.message );
				if ( !global.globalLintReport.htmlWarnings ) global.globalLintReport.htmlWarnings = 0;
				global.globalLintReport.htmlWarnings += 1;
				break;
		}

		console.log( `${report.fileName}:${message.lastLine}:${message.firstColumn}\n` );
	});
}

module.exports = {
	sass( end ) {
		let fail = false, startTime = process.hrtime(), util = require( './util.js' );
		return gulp.src( global.config.sass.source )
			.pipe( plumber({ errorHandler: util.defaultErrorHandler }) )
			.pipe( sourcemaps.init({ loadMaps: true, largeFile: true, identityMap: true }) )
			.pipe( sass( global.config.sass.options ) )
			.on( 'error', function() {
				fail = true;
				end();
			} )
			.pipe( gulpIf( global.config.autoprefixer.enable, autoprefixer( global.config.autoprefixer.options ) ) )
			.pipe( sourcemaps.write( './' ) )
			.pipe( gulp.dest( global.config.sass.dest ) )
			.on( 'end', function() { if( !fail ) {
				browserSync.reload('*.css');
				notifier.notify({ title: 'SASS', message: `Successfully compiled!\r${ util.runtime( startTime ) }`, time: 3000 });
			}})
	},

	pug() {
		return new Promise( function( resolve, reject ) {
			let
				fail = false,
				startTime = process.hrtime(),
				util = require( './util.js' ),
				main = function () {
					gulp.src( global.config.pug.source )
						.pipe( plumber({ errorHandler: util.defaultErrorHandler }) )
						.pipe( gulpIf( global.watch && global.config.pug.options.emitty, emitty.filter( global.emittyChangedFile ) ) )
						.pipe( pug( global.config.pug.options ) )
						.on( 'error', function() { fail = true } )
						.pipe( gulp.dest( global.config.pug.dest ) )
						.on( 'end', function() {
							if( !fail ) {
								browserSync.reload();
								notifier.notify({ title: 'PUG', message: `Successfully compiled!\r${ util.runtime( startTime ) }`, time: 3000 });
							}
							resolve();
						});
				};

			if ( global.config.pug.options.emitty ) emitty.scan( global.emittyChangedFile ).then( main );
			else main();
		});
	},

	validateHtml() {
		return gulp.src( global.config.lint.html )
			.pipe( htmlValidator({ format: 'json' }) )
			.on( 'data', function ( vinyl ) {
				var report = JSON.parse( vinyl['_contents'].toString( 'utf8' ) );
				report.fileName = vinyl.history[ vinyl.history.length - 1 ];
				htmlValidateFormatter( report );
			});
	},

	fullReport ( end ) {
		console.log( global.globalLintReport );
		end();
	},

	cache() {
		return cache.clearAll();
	}
};
