'use strict';

angular.module('myApp.loanDetail', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/plan/loanDetail/:id', {
            templateUrl: 'templates/plan/loanDetail.html',
            controller: 'loanDetailCtrl'
        }); 
    }])

    .controller('loanDetailCtrl', function ($scope, $rootScope, riskService) {
//      $scope.loan_detail = {};
        $scope.planId;
        $scope.planName;
        // 检测登录
        var userId = localStorage.userId;
        var token = localStorage.token;
        if (token == undefined) {
            alert("您尚未登录！");
            self.location = "/manageSystem/#/login";
        }
        $scope.planId=$rootScope.loan.planId;  
        $scope.planName=$rootScope.loan.name;
        $scope.amount=$rootScope.loan.amount;
        // 查询条件
        $scope.cashData = {
            token: token,
            page: 1,
            limit: 10,
            planId:""
        };
       $scope.selectPage = function (page) {
           $scope.cashData['planId'] = $scope.planId;
            $scope.cashData['page'] = page;
            var data = angular.copy($scope.cashData);
            riskService.selectPage("/planInvestment/planInvestmentList", "/planInvestment/planInvestmentList/total", data).then(function () {
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
    })