// inspired by https://github.com/59naga/babel-plugin-add-module-exports/blob/master/src/index.js
// however we didn't use the module itself because it didn't work with amd and didn't handle non-default
// exports at the time of this comment anyway. 
module.exports = function ({ types: t }) {
	return {
		visitor: {
			Program: {
				exit: function (path) {
					if (this.ran) return;
					this.ran = true;

                    let hasExportDefault = false;
                    const exports = [];

                    path.get('body').forEach((path) => {
                        if (path.isExportDefaultDeclaration()) {
                            hasExportDefault = true;
                        }

                        if (path.isExportNamedDeclaration()) {
                            if (path.node.specifiers.length === 1 && path.node.specifiers[0].exported.name === 'default') {
                                hasExportDefault = true
                            } else {
                                exports.push(path.node.declaration.declarations[0].id.loc.identifierName);
                            }
                        }
                    });

                    if (hasExportDefault) {
                        path.pushContainer('body', [
                            t.expressionStatement(t.assignmentExpression(
                                '=',
                                t.memberExpression(t.identifier('module'), t.identifier('exports')),
                                t.memberExpression(t.identifier('exports'), t.stringLiteral('default'), true)
                            ))
                        ]);
                    }

                    if (exports.length) {
                        if (!hasExportDefault) {
                            path.pushContainer('body', [
                                t.expressionStatement(t.assignmentExpression(
                                    '=',
                                    t.memberExpression(t.identifier('module'), t.identifier('exports')),
                                    t.objectExpression([])
                                ))
                            ]);
                        }
                        exports.forEach((name) => {
                            path.pushContainer('body', [
                                t.expressionStatement(t.assignmentExpression(
                                    '=',
                                    t.memberExpression(t.identifier('module.exports'), t.identifier(name)),
                                    t.memberExpression(t.identifier('exports'), t.stringLiteral(name), true)
                                ))
                            ]);
                        });
                    }
				}
			}
		}
	};
};
