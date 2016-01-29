'use strict';

/**
 * @ngdoc service
 * @name midotApp.rows
 * @description
 * # rows
 * Factory in the midotApp.
 */
angular.module('midotApp')
  .factory('rows', function (Tabletop, $q, $window) {
    return $q(function(resolve) {
      if ( $window.localStorage && $window.localStorage.data && $window.localStorage.date + 3600*1000 > Date.now() ) {
        resolve(JSON.parse($window.localStorage.data));
      } else {
        Tabletop.then(function(t) {
          var data = {
            amutot: t[0].amutot.elements,
            subjects: _.object(_.map(t[0].subjects.elements,function(d){
              return [d.subject.trim(), d.text];
            }))
          };
          _.forEach(data.amutot, function(row) {
            _.mapObject(row, function(val) {
              val = val.trim();
              if ( val === '' ) {
                val = null;
              }
              if ( val === '√' ) {
                val = true;
              }
              if ( val === 'X' ) {
                val = false;
              }
              return val;
            });
            row.age = parseInt(row.age);
            row.found_year = parseInt(row.found_year);
            row.reg_year = parseInt(row.reg_year);
            row.year = row.reg_year?
              (row.found_year?
                ((row.found_year < row.reg_year) ? row.found_year : row.reg_year) : row.reg_year)
              :
              (row.found_year?
                row.found_year:
                null);
          });
          if ( $window.localStorage ) {
            $window.localStorage.data = JSON.stringify(data);
            $window.localStorage.date = Date.now();
          }
          resolve(data);
        });
      }
    });
  });
