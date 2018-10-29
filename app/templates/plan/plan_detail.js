'use strict';

angular.module('myApp.plan_detail', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/plan/plan_detail/:id', {
            templateUrl: 'templates/plan/plan_detail.html',
            controller: 'plan_detailCtrl'
        }); 
    }])

    .controller('plan_detailCtrl', function ($scope, $rootScope, investorCashCtrlService,$routeParams) {
        // 检测登录
        var userId = localStorage.userId;
        var token = localStorage.token;
        if (token == undefined) {
            alert("您尚未登录！");
            self.location = "/manageSystem/#/login";
        }
       
      
        // 查询条件
        $scope.cashData = {
            token: token,
            page: 1,
            limit: 10,


           
        };
       $scope.selectPage = function (page) {
           if (page <= 1) {
               page = 1;
           } else if (page >= $scope.totalPages) {
               page = $scope.totalPages;
           }
           $scope.cashData['page'] = page;
           var data = angular.copy($scope.cashData);
            $scope.cashData['planId'] = $routeParams.id;

            var data = angular.copy($scope.cashData);
            investorCashCtrlService.selectPage("/planInvestment/list", data).then(function () {
                var tmpObject = investorCashCtrlService.getResult();
//              console.log(tmpObject);
                $scope.itemList = tmpObject.itemList;
                  // console.log($scope.itemList);
                $scope.nowPage = tmpObject.nowPage;
                $scope.pages = tmpObject.pages;
                $scope.sumCount=tmpObject.sumCount;
                $scope.isShowDot = tmpObject.isShowDot;
                $scope.totalPages = tmpObject.totalPages;
                $scope.startIndex = tmpObject.startIndex;
            });
        };

         $scope.selectPage(1);
    })