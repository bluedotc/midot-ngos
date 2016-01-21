'use strict';

/**
 * @ngdoc function
 * @name midotApp.controller:MainpageCtrl
 * @description
 * # MainpageCtrl
 * Controller of the midotApp
 */
angular.module('midotApp')
  .controller('MainpageCtrl', function (rows, $scope, $filter) {
    var that = this;
    this.selectedRow = null;
    this.rows = [];
    rows.then(function(data) {
      that.rows = data.amutot;
      that.subjects = data.subjects;
      that.stats = {};
      that.operation_fields =
        _.union(_.map(that.rows, function(d) { return d.operation_field; }),
                _.map(that.rows, function(d) { return d.operation_field_2; }));
      updateFiltered();
    });

    function calcStats(list, field) {
      var ret =  _.countBy(list, field);
      var max = _.max(_.values(ret));
      ret = _.sortBy(_.pairs(ret), function(d) { return -d[1]; });
      _.forEach(ret, function(d) {
        d.push( (100*d[1])/max );
        d.push(field);
      });
      return ret;
    }

    function updateFiltered() {
      var f = $filter('filter')(that.rows, $scope.query);
      var stats = {};
      if ( $scope.selectedSector ) {
        f = $filter('fieldFilter')(f,'sector',$scope.selectedSector.sector);
      }
      if ( $scope.selectedVolume2013Granular ) {
        f = $filter('fieldFilter')(f, 'volume_2013_granular', $scope.selectedVolume2013Granular.volume_2013_granular);
      }
      if ( $scope.selectedLocationArea ) {
        f = $filter('fieldFilter')(f, 'location_area', $scope.selectedLocationArea.location_area);
      }
      if ( $scope.selectedOperationField ) {
        f = $filter('fieldFilter')(f, ['operation_field', 'operation_field_2'], $scope.selectedOperationField);
      }
      that.filteredRows = f;

      if ( !$scope.selectedSector ) {
        stats['סיווג ענפי'] = calcStats(f, 'sector');
      }
      if ( !$scope.selectedVolume2013Granular ) {
        stats['מחזור כספי'] = calcStats(f, 'volume_2013_granular');
      }
      if ( $scope.selectedMainChar && !$scope.selectedOperationField ) {
        stats['תחום פעולה ראשי'] = calcStats(f, 'operation_field');
      }
      if ( !$scope.selectedStat || !($scope.selectedStat in stats) ) {
        $scope.selectedStat = _.keys(stats)[0];
      }

      console.log(stats);
      that.stats = stats;
    }

    $scope.$watchGroup(['query','selectedSector', 'selectedVolume2013Granular', 'selectedLocationArea', 'selectedOperationField'],
      function() {
        updateFiltered();
      }
    );

    this.onHover = function(row,event) {
      that.selectedRow = row;
      if ( row !== null ) {
        var el = $(event.currentTarget);
        var width = el.width();
        var parentwidth = el.closest('.row').width();
        console.log(width,parentwidth);
        var height = el.height();
        //var next = $(event.currentTarget.nextElementSibling);
        var panel = $("#detail-card");
        var pos = el.offset();
        panel.css('width',parentwidth+'px');
        if (pos) {
          console.log(pos);
          panel.css('position','absolute');
          panel.css('top',(pos.top+22+height)+'px');
          panel.css('right',(pos.left-parentwidth+width)+'px');
        } else {
          panel.css('position','static');
        }
      }
    };
  });
