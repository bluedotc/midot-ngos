'use strict';

describe('Filter: fieldRangeFilter', function () {

  // load the filter's module
  beforeEach(module('midotApp'));

  // initialize a new instance of the filter before each test
  var fieldRangeFilter;
  beforeEach(inject(function ($filter) {
    fieldRangeFilter = $filter('fieldRangeFilter');
  }));

  it('should return the input prefixed with "fieldRangeFilter filter:"', function () {
    var text = 'angularjs';
    expect(fieldRangeFilter(text)).toBe('fieldRangeFilter filter: ' + text);
  });

});
