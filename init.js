const
	gulp         = require( 'gulp' ),
	browserSync  = require( 'browser-sync' ),
	gutil        = require( 'gulp-util' ),
	util         = require( './util.js' ),
	task         = require( './tasks.js' );

module.exports = function ( configPath ) {
	util.configLoad( configPath );

	// Default task
	gulp.task( 'default', function() {
		global.watch = true;

		gulp.watch( configPath, function config( end ) {
			util.configLoad( configPath );
			end();
		});

		if( global.config.livedemo && global.config.livedemo.enable ) browserSync.init( global.config.livedemo );
		else gutil.log( gutil.colors.yellow( 'LiveDemo disabled!' ) );

		if( global.config.watcher && global.config.watcher.enable ) {
			var watcher = gulp.watch( global.config.watcher.watch );

			watcher.on ( 'change', function( path, stats ) {
				browserSync.reload( path );
			});
		}

		if( global.config.sass && global.config.sass.enable ) gulp.watch( [ configPath, global.config.sass.watch ],  task.sass );
		if( global.config.pug && global.config.pug.enable ) gulp.watch( [ configPath, global.config.pug.watch ],   task.pug ).on('all', ( event, filepath ) => {
			global.emittyChangedFile = filepath;
		});
	});

	// Show Extra Tasks
	if( global.config.cache && global.config.cache.showTask ) gulp.task( task.cache );
	if( global.config.sass && global.config.sass.showTask ) gulp.task( task.sass );
	if( global.config.pug && global.config.pug.showTask ) gulp.task( task.pug );

	if( global.config.lint && global.config.lint.showTask ) {
		if( global.config.lint.html ) gulp.task( 'Validate HTML', task.validateHtml );
	}

	// Generating tasks from build rules
	if ( global.config.buildRules ) util.genBuildTasks();
};
