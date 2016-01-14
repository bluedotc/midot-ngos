'use strict';

/**
 * @ngdoc overview
 * @name midotApp
 * @description
 * # midotApp
 *
 * Main module of the application.
 */
  var app = angular
    .module('midotApp', [
      'ngAnimate',
      'ngCookies',
      'ngResource',
      'ngRoute',
      'ngSanitize',
      'ngTouch',
      'times.tabletop'
  ]);
  app.config(function(TabletopProvider){
    TabletopProvider.setTabletopOptions({
      key: 'https://docs.google.com/spreadsheets/d/1tZL7qG6Ysbv_nB0XZR487pBKwKvGdGAv1ObaYPwqf8U/pubhtml?gid=1195003145&single=true',
      simpleSheet: true
  });
})
;
