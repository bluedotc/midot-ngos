'use strict';

/**
 * @ngdoc service
 * @name midotApp.rows
 * @description
 * # rows
 * Factory in the midotApp.
 */
angular.module('midotApp')
  .factory('rows', function (Tabletop) {
    var rows = Tabletop;
    return rows;
  });
