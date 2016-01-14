'use strict';

/**
 * @ngdoc function
 * @name midotApp.controller:MainpageCtrl
 * @description
 * # MainpageCtrl
 * Controller of the midotApp
 */
angular.module('midotApp')
  .controller('MainpageCtrl', function (rows) {
    var that = this;

    this.rows = [];
    rows.then(function(data) {
      that.rows = data[0];
      that.operation_fields =
        _.union(_.map(that.rows, function(d) { return d.operation_field; }),
                _.map(that.rows, function(d) { return d.operation_field_2; }));
    });
  });
