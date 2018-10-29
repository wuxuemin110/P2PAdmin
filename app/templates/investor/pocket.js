'use strict';

angular.module('myApp.pocket', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/investor/pocket', {
            templateUrl: 'templates/investor/pocket.html',
            controller: 'pocketCtrl'
        });
    }])

    .controller('pocketCtrl', function ($scope, $http, $mdDialog, riskService,investorCashCtrlService,$filter) {
        var token = localStorage.token;
       $scope.keyword = '';
        $scope.type = '';
        $scope.searchRecharge = function (keyword,type) {

           $scope.cashData['keyword']=$scope.keyword;
       $scope.cashData['itemType']=$scope.itemType;
            // $scope.cashData['status'] = input;
            $scope.selectPage(1);
        }
        $scope.cashData = {

            status:status,
            token: token,
            page: 1,
            limit: 20,

            // purchaseTime: null
            // keyword: ""
        };

        $scope.selectPage = function (page) {
            if (page <= 1) {
                page = 1;
            } else if (page >= $scope.totalPages) {
                page = $scope.totalPages;
            }
            $scope.cashData['page'] = page;
            var data = angular.copy($scope.cashData);
            // console.log(data)
            // data.startDate=$filter('date')(data.startDate, "yyyyMMddHHmmss");
            // data.endDate=$filter('date')(data.endDate, "yyyyMMddHHmmss");
            // var str= $("#myTime").val()
            // var reg = /\/| |:/g;
            // data.startDate=str.replace(reg,'');
            // var str1= $("#myTime1").val()
            // var reg1 = /\/| |:/g;
            // data.endDate= str1.replace(reg1,'');
            investorCashCtrlService.selectPage("/user/pocket",data).then(function () {
                var tmpObject = investorCashCtrlService.getResult();
                $scope.itemList = tmpObject.itemList;
                $scope.nowPage = tmpObject.nowPage;
                $scope.pages = tmpObject.pages;
                $scope.sumCount= tmpObject.sumCount;
                $scope.isShowDot = tmpObject.isShowDot;
                $scope.totalPages = tmpObject.totalPages;
                $scope.startIndex = tmpObject.startIndex;
            });
        };
        $scope.searchRecharge(1);





    });