'use strict';

angular.module('myApp.logout', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/logout', {
            templateUrl: 'templates/index/logout.html',
            controller: 'LogoutCtrl'
        });
    }])

    .controller('LogoutCtrl', function () {
        localStorage.clear();
        self.location = "/manageSystem/#/login";
    })
;