'use strict';

/**
 * @ngdoc filter
 * @name midotApp.filter:unique
 * @function
 * @description
 * # unique
 * Filter in the midotApp.
 */
angular.module('midotApp')
  .filter('unique', function () {
    return function (arr,field) {
      if ( field ) {
        return _.uniq(arr, false, function(a) { return a[field]; });
      } else {
        return _.uniq(arr, false);
      }
    };
  });
