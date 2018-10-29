/**
 * Created by admin on 2016/12/30.
 */
'use strict';

angular.module('myApp.activity_new', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/investor/activity_new', {
            templateUrl: 'templates/investor/activity_new.html',
            controller: 'activity_new'
        });
    }])

    .controller('activity_new', function ($scope, riskService) {
        $scope.nodejs = {
            page: 1,
            limit: 10,
            keyword: ""
        };
        $scope.selectPage = function (page) {
            if (page == 'undefined' || page == null) {
                return;
            }
            $scope.nodejs['page'] = page;
            var data = angular.copy($scope.nodejs);
            $scope.itemList1='';

                riskService.selectPage("/selectBigWheel/1/170101", "/selectBigWheel/2/170101", data).then(function () {
                var tmpObject = riskService.getResult();
                    // console.log(tmpObject.itemList)
                $scope.itemList1 = tmpObject.itemList;
                    // console.log($scope.itemList1)
                $scope.nowPage = tmpObject.nowPage;
                $scope.pages = tmpObject.pages;
                $scope.isShowDot = tmpObject.isShowDot;
                $scope.totalPages = tmpObject.totalPages;
                $scope.startIndex = tmpObject.startIndex;


            });
            // console.log($scope.itemList1);
        };
        $scope.selectPage(1)
    });