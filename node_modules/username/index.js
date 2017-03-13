'use strict';
const os = require('os');
const execa = require('execa');
const mem = require('mem');

function getEnvVar() {
	const env = process.env;

	return env.SUDO_USER ||
		env.C9_USER /* Cloud9 */ ||
		env.LOGNAME ||
		env.USER ||
		env.LNAME ||
		env.USERNAME;
}

function cleanWinCmd(x) {
	return x.replace(/^.*\\/, '');
}

function noop() {}

module.exports = mem(() => {
	if (os.userInfo) {
		return Promise.resolve(os.userInfo().username);
	}

	const envVar = getEnvVar();

	if (envVar) {
		return Promise.resolve(envVar);
	}

	if (process.platform === 'darwin' || process.platform === 'linux') {
		return execa('id', ['-un']).then(x => x.stdout).catch(noop);
	} else if (process.platform === 'win32') {
		return execa('whoami').then(x => cleanWinCmd(x.stdout)).catch(noop);
	}

	return Promise.resolve();
});

module.exports.sync = mem(() => {
	if (os.userInfo) {
		return os.userInfo().username;
	}

	const envVar = getEnvVar();

	if (envVar) {
		return envVar;
	}

	try {
		if (process.platform === 'darwin' || process.platform === 'linux') {
			return execa.sync('id', ['-un']).stdout;
		} else if (process.platform === 'win32') {
			return cleanWinCmd(execa.sync('whoami').stdout);
		}
	} catch (err) {}
});
