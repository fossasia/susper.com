import { Collector } from '../utils/node!istanbul';
import path from '../utils/node!path';
import fs from '../utils/node!fs';
import { SourceMapConsumer } from '../utils/node!source-map';
import SparceCoverageCollector from './SparceCoverageCollector';
import getMapping from './getMapping';
import remapFunction from './remapFunction';
import remapBranch from './remapBranch';

const sourceMapRegEx = /(?:\/{2}[#@]{1,2}|\/\*)\s+sourceMappingURL\s*=\s*(data:(?:[^;]+;)+base64,)?(\S+)(?:\n\s*)?$/;

export default class CoverageTransformer {
	constructor(options) {
		this.basePath = options.basePath;
		this.warn = options.warn || console.warn;

		this.exclude = () => false;
		if (options.exclude) {
			if (typeof options.exclude === 'function') {
				this.exclude = options.exclude;
			} else if (typeof options.exclude === 'string') {
				this.exclude = (fileName) => fileName.indexOf(options.exclude) > -1;
			} else {
				this.exclude = (fileName) => fileName.match(options.exclude);
			}
		}

		this.mapFileName = options.mapFileName || ((fileName) => fileName);

		this.useAbsolutePaths = !!options.useAbsolutePaths;

		this.readJSON = options.readJSON
			|| function readJSON(filePath) {
				if (!fs.existsSync(filePath)) {
					this.warn(Error(`Could not find file: "${filePath}"`));
					return null;
				}
				return JSON.parse(fs.readFileSync(filePath));
			};

		this.readFile = options.readFile
			|| function readFile(filePath) {
				if (!fs.existsSync(filePath)) {
					this.warn(new Error(`Could not find file: "${filePath}"`));
					return '';
				}
				return fs.readFileSync(filePath);
			};

		this.sourceStore = options.sources;

		this.sparceCoverageCollector = new SparceCoverageCollector();
	}

	addFileCoverage(filePath, fileCoverage) {
		if (this.exclude(filePath)) {
			this.warn(`Excluding: "${filePath}"`);
			return;
		}

		let rawSourceMap;
		let sourceMapDir = path.dirname(filePath);
		let codeIsArray = true;
		if (fileCoverage.inputSourceMap) {
			rawSourceMap = fileCoverage.inputSourceMap;
		} else {
			/* coverage.json can sometimes include the code inline */
			let codeFromFile = false;
			let jsText = fileCoverage.code;
			if (!jsText) {
				jsText = this.readFile(filePath);
				codeFromFile = true;
			}
			if (Array.isArray(jsText)) { /* sometimes the source is an array */
				jsText = jsText.join('\n');
			} else {
				codeIsArray = false;
			}
			let match = sourceMapRegEx.exec(jsText);

			if (!match && !codeFromFile) {
				codeIsArray = false;
				jsText = this.readFile(filePath);
				match = sourceMapRegEx.exec(jsText);
			}

			if (match) {
				if (match[1]) {
					rawSourceMap = JSON.parse((new Buffer(match[2], 'base64').toString('utf8')));
				} else {
					const sourceMapPath = path.join(sourceMapDir, match[2]);
					rawSourceMap = this.readJSON(sourceMapPath);
					sourceMapDir = path.dirname(sourceMapPath);
				}
			}
		}

		if (!rawSourceMap) {
			/* We couldn't find a source map, so will copy coverage after warning. */
			this.warn(new Error(`Could not find source map for: "${filePath}"`));
			try {
				fileCoverage.code = String(fs.readFileSync(filePath)).split('\n');
			} catch (error) {
				this.warn(new Error(`Could find source for : "${filePath}"`));
			}
			this.sparceCoverageCollector.setCoverage(filePath, fileCoverage);
			return;
		}

		sourceMapDir = this.basePath || sourceMapDir;

		// Clean up source map paths:
		// * prepend sourceRoot if it is set
		// * replace relative paths in source maps with absolute
		rawSourceMap.sources = rawSourceMap.sources.map((srcPath) => {
			let tempVal = srcPath;
			if (rawSourceMap.sourceRoot) {
				tempVal = /\/$/g.test(rawSourceMap.sourceRoot)
					? rawSourceMap.sourceRoot + srcPath
					: srcPath;
			}
			return tempVal.substr(0, 1) === '.'
				? path.resolve(sourceMapDir, tempVal)
				: tempVal
		});

		let sourceMap = new SourceMapConsumer(rawSourceMap);

		/* if there are inline sources and a store to put them into, we will populate it */
		const inlineSourceMap = {};
		let origSourceFilename;
		let origFileName;
		let fileName;

		if (sourceMap.sourcesContent) {
			origSourceFilename = rawSourceMap.sources[0];

			if (origSourceFilename && path.extname(origSourceFilename) !== '' && rawSourceMap.sources.length === 1) {
				origFileName = rawSourceMap.file;
				fileName = filePath.replace(path.extname(origFileName), path.extname(origSourceFilename));
				rawSourceMap.file = fileName;
				rawSourceMap.sources = [fileName];
				rawSourceMap.sourceRoot = '';
				sourceMap = new SourceMapConsumer(rawSourceMap);
			}

			sourceMap.sourcesContent.forEach((source, idx) => {
				inlineSourceMap[sourceMap.sources[idx]] = true;
				this.sparceCoverageCollector.setSourceCode(
					sourceMap.sources[idx],
					codeIsArray ? source.split('\n') : source
				);
				if (this.sourceStore) {
					this.sourceStore.set(sourceMap.sources[idx], source);
				}
			});
		}

		const resolvePath = (source) => {
			let resolvedSource = source in inlineSourceMap
				? source
				: path.resolve(sourceMapDir, source);

			if (!this.useAbsolutePaths && !(source in inlineSourceMap)) {
				resolvedSource = path.relative(process.cwd(), resolvedSource);
			}
			return resolvedSource;
		};

		const getMappingResolved = (location) => {
			const mapping = getMapping(sourceMap, location);
			if (!mapping) return null;

			return Object.assign(mapping, { source: resolvePath(mapping.source) });
		};

		Object.keys(fileCoverage.branchMap).forEach((index) => {
			const genItem = fileCoverage.branchMap[index];
			const hits = fileCoverage.b[index];

			const info = remapBranch(genItem, getMappingResolved);

			if (info) {
				this.sparceCoverageCollector.updateBranch(info.source, info.srcItem, hits);
			}
		});

		Object.keys(fileCoverage.fnMap).forEach((index) => {
			const genItem = fileCoverage.fnMap[index];
			const hits = fileCoverage.f[index];

			const info = remapFunction(genItem, getMappingResolved);

			if (info) {
				this.sparceCoverageCollector.updateFunction(info.source, info.srcItem, hits);
			}
		});

		Object.keys(fileCoverage.statementMap).forEach((index) => {
			const genItem = fileCoverage.statementMap[index];
			const hits = fileCoverage.s[index];

			const mapping = getMappingResolved(genItem);

			if (mapping) {
				this.sparceCoverageCollector.updateStatement(mapping.source, mapping.loc, hits);
			}
		});

		// todo: refactor exposing implementation details
		const srcCoverage = this.sparceCoverageCollector.getFinalCoverage();

		if (sourceMap.sourcesContent && this.basePath) {
			// Convert path to use base path option
			const getPath = filePath => {
				const absolutePath = path.resolve(this.basePath, filePath);
				if (!this.useAbsolutePaths) {
					return path.relative(process.cwd(), absolutePath);
				}
				return absolutePath;
			};
			const fullSourceMapPath = getPath(
				origFileName.replace(path.extname(origFileName), path.extname(origSourceFilename))
			);
			srcCoverage[fullSourceMapPath] = srcCoverage[fileName];
			srcCoverage[fullSourceMapPath].path = fullSourceMapPath;
			delete srcCoverage[fileName];
		}
	}

	addCoverage(item) {
		Object.keys(item)
			.forEach((filePath) => {
				const fileCoverage = item[filePath];
				this.addFileCoverage(filePath, fileCoverage);
			});
	}

	getFinalCoverage() {
		const collector = new Collector();

		const srcCoverage = this.sparceCoverageCollector.getFinalCoverage();

		Object.keys(srcCoverage)
			.filter((filePath) => !this.exclude(filePath))
			.forEach((filename) => {
				const coverage = Object.assign({}, srcCoverage[filename]);
				coverage.path = this.mapFileName(filename);
				if (this.sourceStore && coverage.path !== filename) {
					const source = this.sourceStore.get(filename);
					this.sourceStore.set(coverage.path, source);
				}
				collector.add({
					[coverage.path]: coverage
				});
			});

		/* refreshes the line counts for reports */
		collector.getFinalCoverage();

		return collector;
	}
}
