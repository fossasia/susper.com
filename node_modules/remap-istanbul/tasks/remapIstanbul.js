/* jshint node: true */
/* global Promise */

var loadCoverage = require('../lib/loadCoverage');
var remap = require('../lib/remap');
var writeReport = require('../lib/writeReport');
var MemoryStore = require('istanbul/lib/store/memory');

module.exports = function (grunt) {
	grunt.registerMultiTask('remapIstanbul', function () {
		var done = this.async();
		var options = this.options();
		var sources = new MemoryStore();
		var p = [];

		function warn(message) {
			if (options.fail) {
				grunt.fail.warn(message);
			}
			else {
				grunt.log.error(message);
			}
		}

		this.files.forEach(function (file) {

			var coverage = remap(loadCoverage(file.src, {
				readJSON: grunt.readJSON,
				warn: warn
			}), {
				readFile: grunt.readFile,
				readJSON: grunt.readJSON,
				warn: warn,
				sources: sources,
				basePath: file.basePath,
				useAbsolutePaths: options.useAbsolutePaths
			});

			if (!Object.keys(sources.map).length) {
				sources = undefined;
			}

			if (file.type && file.dest) {
				p.push(writeReport(coverage, file.type, {}, file.dest, sources));
			}
			else {
				p = p.concat(Object.keys(options.reports).map(function (key) {
					return writeReport(coverage, key, options.reportOpts || {}, options.reports[key], sources);
				}));
			}
		});

		Promise.all(p).then(function() {
			done();
		}, grunt.fail.fatal);
	});
};
