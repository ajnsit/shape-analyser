'use strict';

/* Routes */

// Declare app level module which depends on filters, and services
angular.module('sa', ['sa.filters', 'sa.services', 'sa.directives']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {templateUrl: 'partials/partialSa.html', controller: SaController});
    $routeProvider.otherwise({redirectTo: '/home'});
  }]);
