/* jshint node: true */
/* jshint -W079 */
import remap from './remap';
import writeReport from './writeReport';
import checkThreshold from './checkThreshold';
import MemoryStore from '../utils/node!istanbul/lib/store/memory';
import { PluginError } from '../utils/node!gulp-util';
import through from '../utils/node!through2';

/* global Promise */

export default function gulpPlugin(opts = {}) {
	return through.obj((file, enc, cb) => {
		if (!opts.warn) {
			opts.warn = (message) => {
				if (opts.fail) {
					cb(new PluginError('remap-istanbul', message));
				} else {
					console.error(message);
				}
			};
		}

		opts.sources = new MemoryStore();

		if (file.isNull()) {
			cb(null, file);
		}

		if (file.isStream()) {
			cb(new PluginError('remap-istanbul', 'Streaming not supported'));
		}

		const collector = remap(JSON.parse(file.contents.toString('utf8')), opts);

		let thresholdCheckFailed = false;
		if (opts.check) {				
			thresholdCheckFailed = checkThreshold(opts.check, collector);
		}

		let sources;
		if (Object.keys(opts.sources.map).length) {
			sources = opts.sources;
		}

		const p = [];
		if (opts.reports) {
			Object.keys(opts.reports).forEach((key) => {
				p.push(writeReport(collector, key, opts.reportOpts || {}, opts.reports[key], sources));
			});
		}

		file.contents = new Buffer(JSON.stringify(collector.getFinalCoverage()));

		Promise.all(p).then(() => {
			if (thresholdCheckFailed) {
				return cb(new PluginError('remap-istanbul', 'Coverage threshold not met'));					
			} else {
				cb(null, file);
			}			
		});
	});
};
