'use strict';

angular.module('myApp.loan_recharge', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/money/loan_recharge', {
            templateUrl: 'templates/money/loan_recharge.html',
            controller: 'Loan_rechargeCtrl'
        });
    }])

    .controller('Loan_rechargeCtrl', function ($scope, $http, $mdDialog, riskService) {
        // 检测登录
        var token = localStorage.token;
        if (token == undefined) {
            alert("您尚未登录！");
            self.location = "/manageSystem/#/login";
            return 0;
        }

        // 查询条件
        $scope.rechargeData = {
            token: token,
            page: 1,
            limit: 10,
            name: "",
            account: "",
            pocketMoneyNum: "",
            expMoneyNum: "",
            raisingRatesNum: "",
            keyword: ""
        };

        $scope.recharge = function (money, userId) {
            if (money == undefined) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent('请输入充值金额')
                        .ok('确定')
                );
                return;
            }

            $http.post(HOST_URL + "/money/topupForBorrower?token=" + token + "&money=" + (money * 100) + "&userId=" + userId).success(function () {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent('充值成功')
                        .ok('确定')
                ).then(function () {//确定按钮方法
                    $scope.selectPage($scope.rechargeData['page']);
                }, function () {
                });
            }).error(function (responseData) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent(responseData['error'])
                        .ok('确定')
                );

            });
        };

        $scope.selectPage = function (page) {
            $scope.rechargeData['page'] = page;
            var data = angular.copy($scope.rechargeData);
            riskService.selectPage("/money/getBorrowerList/", "/money/getBorrowerList/total", data).then(function () {
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
    });