'use strict';

var exec = require('child_process').exec;

module.exports = function(grunt) {
	grunt.registerTask('git-add', 'Adds files to git index', function () {

		var opts = this.options({
				files: []
			}),

			done = this.async(),

			files;

		files = grunt.file.expand(opts.files)

		if (files.length) {
			exec('git add -f ' + files.join(' '), function (err, stdout, stderr) {

				if (err) {
					grunt.fail.fatal('Cannot add files to index: ' + stderr)
				}

				grunt.log.ok('Files added to the index');
				done()
			})
		} else {
			done()
		}
	})
}