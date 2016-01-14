'use strict';

/**
 * @ngdoc filter
 * @name midotApp.filter:fieldFilter
 * @function
 * @description
 * # fieldFilter
 * Filter in the midotApp.
 */
angular.module('midotApp')
  .filter('fieldFilter', function () {
    return function (arr,field,query) {
      if ( query ) {
        if ( field.constructor === Array ) {
          return _.filter(arr, function(e) { return _.some(field, function(f) { return e[f]===query; }); });
        } else {
          return _.filter(arr, function(e) { return e[field]===query; });
        }
      } else {
        return arr;
      }
    };
  });
