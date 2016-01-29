'use strict';

/**
 * @ngdoc filter
 * @name midotApp.filter:fieldRangeFilter
 * @function
 * @description
 * # fieldRangeFilter
 * Filter in the midotApp.
 */
angular.module('midotApp')
  .filter('fieldRangeFilter', function () {
    return function (arr, field, minval, maxval) {
      return _.filter(arr, function(e) { return e[field]>=minval && e[field]<=maxval; });
    };
  });
