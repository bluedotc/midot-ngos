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
    function match(e,f,q) {
      if (f[0] === '~') {
        var ref = e[f.substr(1)];
        return ref !== null && ref.indexOf(q) !== -1;
      } else {
        return e[f] === q;
      }
    }
    return function (arr,field,query) {
      if ( query ) {
        if ( field.constructor === Array ) {
          return _.filter(arr, function(e) { return _.some(field, function(f) { return match(e,f,query); }); });
        } else {
          return _.filter(arr, function(e) { return match(e,field,query); });
        }
      } else {
        return arr;
      }
    };
  });
