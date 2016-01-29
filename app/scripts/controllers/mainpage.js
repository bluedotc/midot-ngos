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
    this.minVolumeLabel = '';
    this.maxVolumeLabel = '';

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
      if ( $scope.minVolume >=0 && $scope.maxVolume >= 0 ) {
        f = $filter('fieldRangeFilter')(f, 'volume_2013', $scope.minVolume, $scope.maxVolume);
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

      that.stats = stats;

      window.setTimeout(function() {
        var columns = $($('.table tr')[2]).find('td');
        var headers = $('.table th');
        for ( var i = 0 ; i < columns.length ; i++ ) {
          $(headers[i]).width( $(columns[i]).width() );
        }
        window.setTimeout(function() {
          var h = $($('.table thead tr')[0]).height();
          $($('.table td div')[0]).height(h-16);
        });
      },0);
    }

    $scope.$watchGroup(['query','selectedSector', 'minVolume', 'maxVolume', 'selectedLocationArea', 'selectedOperationField'],
      function() {
        updateFiltered();
      }
    );

    $scope.isNumber= function (n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    };

    this.onClick = function(row) {
      $scope.selectedRow = $scope.selectedRow === row ? null : row;
    };

    $(function() {
      $('[data-clampedwidth]').each(function () {
        var elem = $(this);
        var parentPanel = elem.data('clampedwidth');
        var resizeFn = function () {
          var sideBarNavWidth = $(parentPanel).width();// - parseInt(elem.css('paddingLeft')) - parseInt(elem.css('paddingRight')) - parseInt(elem.css('marginLeft')) - parseInt(elem.css('marginRight')) - parseInt(elem.css('borderLeftWidth')) - parseInt(elem.css('borderRightWidth'));
          elem.css('width', sideBarNavWidth);
        };

        resizeFn();
        $(window).resize(resizeFn);
      });
      that.volumeSlider = new Slider("#volume2013GranularSlider");
      that.volumeSlider.on('slide', function() {
        var values = that.volumeSlider.getValue();
        var x = {
          8: ['0', 0],
          7: ['מיליון', 1000000],
          6: ['5 מיליון', 5000000],
          5: ['10 מיליון', 10000000],
          4: ['25 מיליון', 25000000],
          3: ['50 מיליון', 50000000],
          2: ['100 מיליון', 100000000],
          1: ['500 מיליון', 500000000],
          0: ['מיליארד', 1000000000]
        };
        that.minVolumeLabel = x[values[1]][0];
        that.maxVolumeLabel = x[values[0]][0];
        $scope.minVolume = x[values[1]][1];
        $scope.maxVolume = x[values[0]][1];
        $scope.$apply();
      });
      that.volumeSlider._trigger('slide');
    });

  });
