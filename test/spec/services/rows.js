'use strict';

describe('Service: rows', function () {

  // load the service's module
  beforeEach(module('midotApp'));

  // instantiate service
  var rows;
  beforeEach(inject(function (_rows_) {
    rows = _rows_;
  }));

  it('should do something', function () {
    expect(!!rows).toBe(true);
  });

});
