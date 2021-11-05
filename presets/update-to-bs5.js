module.exports = function (data) {
	if (!data) data = {};

	const
			util = require('../util.js'),
			action = require('../actions.js');

	data.execute = util.genBuildTask(function () {
		let ruleSet = [];

		// Update
		ruleSet = ruleSet.concat([
			action.transformContent({
				task: 'Update Pug',
				src:  'dev/pug/**/*.pug',
				dest: 'dev/pug-test/',
				callback(content) {
					return content
					// Text
					.replace(/\.text(.{0,4})-left/g, '.text$1-start')
					.replace(/\.text(.{0,4})-right/g, '.text$1-end')

					// Float
					.replace(/\.float(.{0,4})-left/g, '.float$1-start')
					.replace(/\.float(.{0,4})-right/g, '.float$1-end')

					// Border
					.replace(/\.border-left/g, '.border-start')
					.replace(/\.border-right/g, '.border-end')

					// Border-radius
					.replace(/\.rounded-left/g, '.rounded-start')
					.replace(/\.rounded-right/g, '.rounded-end')

					// Spacing
					.replace(/\.ml-(.)/g, '.ms-$1')
					.replace(/\.mr-(.)/g, '.me-$1')
					.replace(/\.pl-(.)/g, '.ps-$1')
					.replace(/\.pr-(.)/g, '.pe-$1')

					// Text
					.replace(/\.font-weight-(.)/g, '.fw-$1')
					.replace(/\.font-style-(.)/g, '.fst-$1')
					.replace(/\.font-italic(.)/g, '.fst-italic')
					.replace(/\.text-monospace(.)/g, '.font-monospace')

					// Gutters
					.replace(/\.no-gutters/g, '.g-0')

					// Ratios
					.replace(/\.embed-responsive-(\d+)by(\d+)/g, '.ratio-$1x$2')
					.replace(/\.embed-responsive/g, '.ratio')

					// Modal & Tooltip & Popover
					.replace(/data-toggle/g, 'data-bs-toggle')
					.replace(/data-target/g, 'data-bs-target')
					.replace(/data-dismiss/g, 'data-bs-dismiss')
					.replace(/data-placement/g, 'data-bs-placement')
					.replace(/data-original-title/g, 'data-bs-original-title')
				}
			}),

			action.transformContent({
				task: 'Update Sass',
				src:  'dev/scss/**/*.scss',
				dest: 'dev/scss-test/',
				callback(content) {
					return content
					// Gutters
					.replace(/\.no-gutters/g, '.g-0')

					// Text
					.replace(/\.font-weight-(.*)/g, '.fw-$1')
					.replace(/\.font-style-(.*)/g, '.fst-$1')
					.replace(/\.font-italic/g, '.fst-italic')
					.replace(/\.text-monospace/g, '.font-monospace')

					// Ratios
					.replace(/\.embed-responsive-(\d+)by(\d+)/g, '.ratio-$1x$2')
					.replace(/\.embed-responsive/g, '.ratio')

					// Screen reader
					.replace(/sr-only/g, 'visually-hidden')

					// Breakpoints
					.replace(/media-breakpoint-down\(xl\)/g, 'media-breakpoint-down(xxl)')
					.replace(/media-breakpoint-down\(lg\)/g, 'media-breakpoint-down(xl)')
					.replace(/media-breakpoint-down\(md\)/g, 'media-breakpoint-down(lg)')
					.replace(/media-breakpoint-down\(sm\)/g, 'media-breakpoint-down(md)')
					.replace(/media-breakpoint-down\(xs\)/g, 'media-breakpoint-down(sm)')

					.replace(/media-breakpoint-between\(xl, xl\)/g, 'media-breakpoint-between(xl, xxl)')
					.replace(/media-breakpoint-between\(lg, lg\)/g, 'media-breakpoint-between(lg, xl)')
					.replace(/media-breakpoint-between\(md, md\)/g, 'media-breakpoint-between(md, lg)')
					.replace(/media-breakpoint-between\(sm, sm\)/g, 'media-breakpoint-between(sm, md)')
					.replace(/media-breakpoint-between\(xs, xs\)/g, 'media-breakpoint-between(xs, sm)')
				}
			}),

			action.transformContent({
				task: 'Update JS',
				src:  'dev/js/**/*.js',
				dest: 'dev/js/',
				callback(content) {
					return content
					// Modal & Tooltip & Popover
					.replace(/data-toggle/g, 'data-bs-toggle')
					.replace(/data-target/g, 'data-bs-target')
					.replace(/data-dismiss/g, 'data-bs-dismiss')
					.replace(/data-placement/g, 'data-bs-placement')
					.replace(/data-original-title/g, 'data-bs-original-title')
				}
			})
		]);

		if (ruleSet.length === 0) throw Error('At least something must be builded!');
		return ruleSet;
	}());

	return data;
};
