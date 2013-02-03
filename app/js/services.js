'use strict';

/* Services */

angular.module('sa.services', [])

  // The version of the application
  .value('version', '0.1')

  // Shape Analysers Service
  .factory('analysers', ['$window', function ($window) {
    var analysers = {};
    var service = {};
    service.register = function(name, proc) {
      analysers[name] = proc;
    };
    service.get = function(name) {
      var a = analysers[name];
      if(!a) {
        // Try dynamically loading the analyser
        a = $window[name+'Analyser'](service);
        service.register(name, a);
      }
      return a;
    };

    return service;
  }]);

