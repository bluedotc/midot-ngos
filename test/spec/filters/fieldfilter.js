'use strict';

describe('Filter: fieldFilter', function () {

  // load the filter's module
  beforeEach(module('midotApp'));

  // initialize a new instance of the filter before each test
  var fieldFilter;
  beforeEach(inject(function ($filter) {
    fieldFilter = $filter('fieldFilter');
  }));

  it('should return the input prefixed with "fieldFilter filter:"', function () {
    var text = 'angularjs';
    expect(fieldFilter(text)).toBe('fieldFilter filter: ' + text);
  });

});
