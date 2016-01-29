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
    function sortkey(x,field) {
      var ret = x[field];
      if ( field !== 'volume_2013_granular' ) {
        return ret;
      }
      if (ret.startsWith('בין')) {
        try {
          ret = parseInt(ret.split(' ')[1]);
        } catch(e ) {
          ret = -1;
        }
        if ( isNaN(ret) ) {
          ret=-1;
        }
      } else {
        ret = -1;
      }
      return ret;
    }

    return function (arr,field) {
      if ( field ) {
        return _.sortBy(_.uniq(arr, false, function(a) { return a[field]; }), function(x) { return sortkey(x,field); });
      } else {
        return _.sortBy(_.uniq(arr, false), function(x) { return x; });
      }
    };
  });
