// TODO modules to package.json
const flog        = require( 'fancy-log' );
const PluginError = require( 'plugin-error' );
const PugLint     = require( 'pug-lint' );
const throughObj  = require( 'through2' ).obj;
const PLUGIN_NAME = 'gulp-pug-linter';

/**
 * @name getReporter
 * @description Gets the reporter depending on its type. Falls back to the default reporter with a warning.
 * @param {*} reporter - Existing reporter type, name, or function
 * @returns {Function} - Reporter function to be called with lint errors
 */
const getReporter = function ( reporter ) {
	if ( reporter === 'default' ) {
		return report;
	}
	if ( typeof reporter === 'function' ) {
		return reporter;
	}
	if ( typeof reporter === 'string' ) {
		try {
			return require( reporter );
		} catch ( error ) {}
	}

	flog.warn( `${PLUGIN_NAME} warning: ${reporter} not found; falling back to default` );

	return report;
};

/**
 * @name gulpPugLinter
 * @description Hooks to PugLint to lint for errors
 * @param {Object} options - Configuration object
 * @param {Boolean} failAfterError - Whether to throw a plugin error after encountering one or more lint errors
 * @param {*} reporter - Reporter type, name, or function to show lint errors
 */
const gulpPugLinter = function ( options = {} ) {
	const config = options.config || {};
	const linter = new PugLint();

	/**
	 * @name checkFile
	 * @description Checks the given file for lint errors
	 * @param {Object} file - File chunk
	 * @param {String} file.path - File path
	 * @returns {Array} - List of error messages
	 */
	const checkFile = file => linter.checkFile( file.path );

	linter.configure( config );

	return throughObj( function transform ( file, encoding, callback ) {
		if ( file.isNull() ) {
			return callback( null, file );
		}
		if ( file.isStream() ) {
			return callback(
				new PluginError( PLUGIN_NAME, 'Streaming is not supported' )
			);
		}

		const errors = checkFile( file );

		if ( Object.keys( options ).includes( 'reporter' ) ) {
			getReporter( options.reporter )( errors );
		}

		if ( options.failAfterError && errors.length ) {
			this.emit( 'error', new PluginError( PLUGIN_NAME, 'Lint failed' ) );
		}

		file.pugLinter = { errors, options };

		return callback( null, file );
	} );
};

/**
 * @name report
 * @description Combines and logs lint error messages
 * @param {Object[]} errors - List of lint errors
 * @param {String} errors.message - Lint error message
 */
const report = function ( errors ) {
	let allErrors;

	if ( errors.length ) {
		allErrors = errors.map( error => error.message ).join( '\n\n' );
		flog( allErrors );
	}
};

module.exports = gulpPugLinter;
