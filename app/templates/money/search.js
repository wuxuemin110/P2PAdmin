/**
 * Created by admin on 2016/12/21.
 */
'use strict';

angular.module('myApp.search', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/money/search', {
            templateUrl: 'templates/money/search.html',
            controller: 'searchCtrl'
        });
    }])

    .controller('searchCtrl', function ($scope, $http, $mdDialog, riskService) {
        $scope.getcount = function() {
            $scope.news1='';
            $scope.news='';
            $http.get(HOST_URL + "/totalMoney").success(function (responseData) {
                $scope.news1 = responseData;
            }).error(function () {
                alert("请联系管理员！")
            });
        };
        $scope.getcount();


        $scope.cashData = {
            page: 1,
            limit: 10,
            totalPages:30,
        };
        $scope.selectPage = function (page) {
            $scope.cashData['page'] = page;
            var data = angular.copy($scope.cashData);
            riskService.selectPage("/accountMoney/1", "/accountMoney/2", data).then(function () {
                var tmpObject = riskService.getResult();
                $scope.itemList = tmpObject.itemList;
                $scope.nowPage = tmpObject.nowPage;
                $scope.pages = tmpObject.pages;
                $scope.isShowDot = tmpObject.isShowDot;
                $scope.totalPages = tmpObject.totalPages;
                $scope.startIndex = tmpObject.startIndex;
            });
        };

        $scope.selectPage(1);

        $scope.getSum = function(){
            $http.get(HOST_URL + "/select/data?userId=118866").success(function (responseData) {
                $scope.sum = responseData;
            })

        }
    });