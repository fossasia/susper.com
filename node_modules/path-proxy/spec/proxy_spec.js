var pathProxy = require('../index');

function Base() {}

describe('#proxy', function() {
  beforeEach(function() {
    spyOn(pathProxy, 'pathProxy').andCallThrough();
  });

  it('calls #pathProxy for each path', function() {
    pathProxy.proxy(Base, ['/foo'])
    expect(pathProxy.pathProxy).toHaveBeenCalledWith(Base, '/foo');
  });

  it('returns the base', function() {
    expect(pathProxy.proxy(Base, ['/foo'])).toEqual(Base);
  });
});
