'use strict';

angular.module('myApp.express', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/investor/express', {
            templateUrl: 'templates/investor/express.html',
            controller: 'ExpressController'
        });
    }])
    .controller('ExpressController', function ($scope, ExpressService) {
        $scope.expressList = [];
        ExpressService.synExpressList().then(function () {
            $scope.expressList = ExpressService.getExpressList();
        })

        $scope.saveExpress = function (orderAddress) {
            delete orderAddress['name'];
            ExpressService.updateExpress(orderAddress);
        }
    })
    .factory('ExpressService', function ($http, $mdDialog) {
        var expressList = [];
        return {
            synExpressList: function () {
                return $http.get(HOST_URL + '/expresses?token=' + localStorage.token).error(function (responseData) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent(responseData.error)
                            .ok('确定')
                    );
                }).success(function (responseData) {
                    expressList = responseData;
                })
            },
            getExpressList: function () {
                return expressList;
            },
            updateExpress: function (data) {
                return $http.post(HOST_URL + '/express/' + data.id + '?token=' + localStorage.token, data).success(function (responseData) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent('操作成功')
                            .ok('确定')
                    );
                }).error(function (responseData) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent(responseData.error)
                            .ok('确定')
                    );
                })
            }
        }
    });