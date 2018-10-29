'use strict';

angular.module('myApp.loan_borrower', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/loan/loan_borrower', {
            templateUrl: 'templates/loan/loan_borrower.html',
            controller: 'Loan_borrowerCtrl'
        });
    }])

    .controller('Loan_borrowerCtrl', function ($scope, $http, $mdDialog, riskService, LoanBorrowerService) {
        // 检测登录
        var userId = localStorage.userId;
        var token = localStorage.token;
        var onMakeLoan = false;
        if (token == undefined) {
            alert("您尚未登录！");
            self.location = "/manageSystem/#/login";
            return 0;
        }
        $scope.makeLoanResult = {total: 0, success: 0, failure: 0};
        $scope.makeLoanOnOneKey = function () {
            $http.get(HOST_URL + '/borrower/makeLoanOnOneKey?token=' + localStorage.token).success(function (data) {
                $scope.makeLoanResult = data;
                if (data.total == 0) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent('没有要放款的人')
                            .ok('确定')
                    );
                }
                $scope.selectPage(1);
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
            var filters = {
                token: localStorage.getItem('token'),
                page: page,
                limit: 15
            };

            riskService.selectPage('/loans/waiting', '/loans/waiting/total', filters).then(function () {
                var tmpObject = riskService.getResult();
                $scope.itemList = tmpObject.itemList;
                $scope.nowPage = tmpObject.nowPage;
                $scope.pages = tmpObject.pages;
                $scope.isShowDot = tmpObject.isShowDot;
                $scope.totalPages = tmpObject.totalPages;
                $scope.startIndex = tmpObject.startIndex;
            })
        };

        $scope.selectPage(1);

        $scope.makeLoan = function (loanId) {
            if (onMakeLoan)
                return;
            onMakeLoan = true;
            LoanBorrowerService.makeLoan(loanId).success(function (res) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent('放款成功')
                        .ok('确定')
                );
                $scope.selectPage(1);
            }).error(function (res) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent(res['error'])
                        .ok('确定')
                );
                onMakeLoan = false;
            })
        }
    }).factory('LoanBorrowerService', function ($http) {

    return {
        makeLoan: function (loanId) {
            return $http.get(HOST_URL + '/borrower/makeLoan?token=' + localStorage.getItem('token') + '&loanId=' + loanId);
        }
    }
});