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
    this.selectedRow = null;
    this.rows = [];
    rows.then(function(data) {
      that.rows = data[0];
      that.operation_fields =
        _.union(_.map(that.rows, function(d) { return d.operation_field; }),
                _.map(that.rows, function(d) { return d.operation_field_2; }));
    });

    this.onHover = function(row,event) {
      that.selectedRow = row;
      if ( row !== null ) {
        var el = $(event.currentTarget);
        var width = el.width();
        var height = el.height();
        //var next = $(event.currentTarget.nextElementSibling);
        var panel = $("#detail-card");
        var pos = el.offset();
        panel.css('width',width+'px');
        if (pos) {
          console.log(pos);
          panel.css('position','absolute');
          panel.css('top',(pos.top+22+height)+'px');
          panel.css('right',pos.left+'px');
        } else {
          panel.css('position','static');
        }
      }
    };
  });
