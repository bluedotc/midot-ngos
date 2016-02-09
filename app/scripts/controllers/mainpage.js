'use strict';

/**
 * @ngdoc function
 * @name midotApp.controller:MainpageCtrl
 * @description
 * # MainpageCtrl
 * Controller of the midotApp
 */
angular.module('midotApp')
  .controller('MainpageCtrl', function (rows, $scope, $filter, $window) {
    var that = this;
    this.selectedRow = null;
    this.rows = [];
    this.updatePie = null;

    rows.then(function(data) {
      that.rows = data.amutot;
      that.columns = data.columns;
      that.headers = data.headers;
      that.rows = data.amutot;
      that.subjects = data.subjects;
      that.stats = {};
      that.operation_fields =
        _.sortBy(
          _.union(_.map(that.rows, function(d) { return d.operation_field; }),
                  _.map(that.rows, function(d) { return d.operation_field_2; })),
          function(x) {
            return x;
          });
      that.operation_fields =
        _.filter(that.operation_fields, function(d) { return d!==null;});
      updateFiltered();
    });

    function calcStats(list, field) {
      var ret =  _.countBy(list, field);
      var max = d3.sum(_.values(ret));
      ret = _.sortBy(_.pairs(ret), function(d) { return -d[1]; });
      _.forEach(ret, function(d,i) {
        d[0] = d[0].replace('בין ','').replace(new RegExp(' מיליון','g'), 'M');
        d.push( (100*d[1])/max );
        d.push(field);
        d.push(i);
      });
      ret = _.filter(ret, function(d) { return d[0] !== null; });
      return ret;
    }

    function updateFiltered() {
      var f = $filter('filter')(that.rows, $scope.query);
      var stats = {};
      if ( $scope.selectedSector ) {
        f = $filter('fieldFilter')(f,'sector',$scope.selectedSector.sector);
      }
      if ( $scope.orgNameQuery && $scope.orgNameQuery.length > 0 ) {
        f = $filter('fieldFilter')(f,['~name', '~alias'],$scope.orgNameQuery);
      }
      if ( $scope.minVolume >0 || $scope.maxVolume < 750000000 ) {
        f = $filter('fieldRangeFilter')(f, 'volume_2013', $scope.minVolume, $scope.maxVolume);
      }
      if ( $scope.selectedLocationArea ) {
        f = $filter('fieldFilter')(f, 'location_area', $scope.selectedLocationArea.location_area);
      }
      if ( $scope.selectedOperationField && $scope.selectedOperationField.length > 0 ) {
        f = $filter('fieldFilter')(f, ['operation_field', 'operation_field_2'], $scope.selectedOperationField);
      }
      that.filteredRows = f;

      if ( !$scope.selectedSector ) {
        stats['סיווג ענפי'] = calcStats(f, 'sector');
      }
      if ( !$scope.selectedVolume2013Granular ) {
        stats['מחזור כספי'] = calcStats(f, 'volume_2013_granular');
      }
      if ( $scope.selectedSector && !$scope.selectedOperationField ) {
        stats['תחום פעולה'] = calcStats(f, 'operation_field');
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

      if (!that.updatePie) {
        that.updatePie = that.drawPie();
      }
      that.updatePie(stats[$scope.selectedStat]);
    }

    $scope.$watchGroup(['query','selectedSector', 'minVolume', 'maxVolume', 'selectedLocationArea', 'selectedOperationField', 'orgNameQuery'],
      function() {
        updateFiltered();
        onResize();
      }
    );

    $scope.$watchGroup(['selectedStat'],
      function() {
        if (that.updatePie) {
          that.updatePie(that.stats[$scope.selectedStat]);
        }
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
      that.volumeSlider = new Slider('#volume2013GranularSlider');
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
          0: ['750 מיליון', 750000000]
        };
        that.minVolumeLabel = x[values[1]][0];
        that.maxVolumeLabel = x[values[0]][0];
        $scope.minVolume = x[values[1]][1];
        $scope.maxVolume = x[values[0]][1];
        $scope.$apply();
      });
      that.volumeSlider._trigger('slide');
    });

    this.downloadData = function (rows) {
      var data = _.map(rows, function(row) {
        return _.map(that.columns, function(c) {
          return row[c];
        });
      });
      data.unshift(that.headers);
      var encodedString = windows1255.encode(Papa.unparse(data), {mode:'html'});
      var buf = new ArrayBuffer(encodedString.length);
      var bufView = new Uint8Array(buf);
      for (var i=0, strLen=encodedString.length; i < strLen; i++) {
        bufView[i] = encodedString.charCodeAt(i);
      }
      var blob = new Blob([buf], { type: 'text/csv' });
      var url = URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.download = 'midot-dataset.csv';
      link.href = url;
      link.click();
    };

    this.drawPie = function() {
      var width = 220,
        height = 220,
        radius = Math.min(width, height) / 2;

      var color = d3.scale.ordinal()
        .range(['#009bd5','#eec100','#00b8af','#89b804','#00a854','#4cb8e2','#f3d34c','#4ccdc7','#adce4f','#4cc287']);

      var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

      var labelArc = d3.svg.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);

      var pie = d3.layout.pie()
        .sort(null)
        .value(function (d) {
          return d[1];
        });

      var svg = d3.select('#pieChart').append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
      var pathsGroup = svg.append('g');
      var textsGroup = svg.append('g');
      var tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return d.data[0]+'&rlm; - '+Math.round(d.data[2])+'%'; });
      svg.call(tip);

      function update(data) {
        var paths = pathsGroup.selectAll('path.arc')
          .data(pie(data));
        paths.exit().remove();
        paths.enter().append('path')
          .attr('class', 'arc')
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide);


        paths.attr('d', arc)
          .style('fill', function (d) {
            return color(d.data[4]);
          });

        var texts = textsGroup.selectAll('text.arc')
          .data(pie(data));
        texts.exit().remove();
        texts.enter().append('text')
          .attr('class', 'arc')
          .style('text-anchor','middle')
          .style('pointer-events','none');
        texts.attr('transform', function (d) {
            return 'translate(' + labelArc.centroid(d) + ')';
          })
          .text(function (d) {
            return (d.endAngle - d.startAngle) > 0.5 ? d.data[0] : '';
          });
      }

      return update;
    };

    var onResize = function() {
      var viewport = $(window).width();
      var leftCol = $('.left-col');
      var rightCol = $('.right-col');
      var left = leftCol.outerWidth();
      var right = rightCol.outerWidth();
      var margin = 10;
      var spare = viewport - left - right - 2*margin;
      if ( spare < 0 ) {
        spare = 0;
      }
      var align = spare/2;
      rightCol.css('right',(align+margin)+'px');
      leftCol.css('right',(align+margin+right+margin)+'px');
      $('.upper-text').css('right',(align+margin+right+margin+5)+'px');
      $('.left-col thead').css('right',(align+margin+right+margin+10)+'px');
    };
    angular.element($window).bind('resize', onResize);
    $(onResize);
    $(function() {
      $('select[multiple]').multiselect({
        buttonWidth: '220px',
        nonSelectedText: 'כל תחומי הפעילות',
        allSelectedText: 'כל תחומי הפעילות',
        nSelectedText: 'תחומים נבחרו',
        numberDisplayed: 1
      });
    });

    this.hasadna = function() {
      $window.open('http://www.hasadna.org.il','_blank');
    };
  });
