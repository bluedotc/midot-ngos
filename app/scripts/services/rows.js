'use strict';

/**
 * @ngdoc service
 * @name midotApp.rows
 * @description
 * # rows
 * Factory in the midotApp.
 */
angular.module('midotApp')
  .factory('rows', function (Tabletop, $q) {
    return $q(function(resolve) {
      Tabletop.then(function(t) {
        var data = {
          amutot: t[0].amutot.elements,
          subjects: _.object(_.map(t[0].subjects.elements,function(d){
            return [d.subject, d.text];
          }))
        };
        resolve(data);
      });
    });
  });
