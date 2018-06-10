var pathProxy = require('../index'),
    context   = describe;

function Base() {}

function createsAProxyObjectConstructorWith(proxyObject, pathSegments, params, path) {
  it('creates a proxy object constructor with path segments ' + pathSegments.join(', '), function() {
    expect(proxyObject.pathSegments).toEqual(pathSegments);
  });

  it('creates a proxy object constructor with params ' + params.join(', '), function() {
    expect(proxyObject.params).toEqual(params);
  });

  it('creates a proxy object constructor with path ' + path, function() {
    expect(proxyObject.path).toEqual(path);
  });
}

describe('#pathProxy', function() {
  context('when the path is a single segment', function() {
    var base = new Base();
    pathProxy.pathProxy(Base, '/foo');

    createsAProxyObjectConstructorWith(base.foo(), ['foo'], [], '/foo');
  });

  context('when the path is a segment with a parameter', function() {
    var base = new Base();
    pathProxy.pathProxy(Base, '/foo/{bar}');

    createsAProxyObjectConstructorWith(base.foo('bar'), ['foo', 'bar'], ['bar'], '/foo/bar');
  });

  context('when the path is two segments', function() {
    var base = new Base();
    pathProxy.pathProxy(Base, '/foo/bar');

    createsAProxyObjectConstructorWith(base.foo(), ['foo'], [], '/foo');
    createsAProxyObjectConstructorWith(base.foo().bar(), ['foo', 'bar'], [], '/foo/bar');
  });

  context('when the path is a segment with a parameter followed by a segment', function() {
    var base = new Base();
    pathProxy.pathProxy(Base, '/foo/{bar}/baz');

    createsAProxyObjectConstructorWith(base.foo('bar'), ['foo', 'bar'], ['bar'], '/foo/bar');
    createsAProxyObjectConstructorWith(base.foo('bar').baz(), ['foo', 'bar', 'baz'], ['bar'], '/foo/bar/baz');
  });

  context('when the path is a segment followed by a segment with a parameter', function() {
    var base = new Base();
    pathProxy.pathProxy(Base, '/foo/baz/{qux}');

    createsAProxyObjectConstructorWith(base.foo(), ['foo'], [], '/foo');
    createsAProxyObjectConstructorWith(base.foo().baz('qux'), ['foo', 'baz', 'qux'], ['qux'], '/foo/baz/qux');
  });

  context('when the path is a segment with a parameter followed by a segment with a parameter', function() {
    var base = new Base();
    pathProxy.pathProxy(Base, '/foo/{bar}/baz/{qux}');

    createsAProxyObjectConstructorWith(base.foo('bar'), ['foo', 'bar'], ['bar'], '/foo/bar');
    createsAProxyObjectConstructorWith(base.foo('bar').baz('qux'), ['foo', 'bar', 'baz', 'qux'], ['bar', 'qux'], '/foo/bar/baz/qux');
  });
});
