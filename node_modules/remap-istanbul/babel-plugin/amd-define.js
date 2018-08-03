const template = require('babel-template');

const buildAmdDefine = template(`
	(function (define) {
		CODE;
	})(typeof define !== 'function' ? require('amdefine')(module) : define);
`);

module.exports = function ({ types: t }) {
	return {
		visitor: {
			Program: {
				exit: function (path) {
					if (this.ran) return;
					this.ran = true;

					const node = path.node;
					node.body = [buildAmdDefine({
						CODE: node.body
					})];
				}
			}
		}
	};
};
