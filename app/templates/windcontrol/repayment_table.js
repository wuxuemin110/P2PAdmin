'use strict';

angular.module('myApp.repayment_table', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/windcontrol/repayment_table', {
            templateUrl: 'templates/windcontrol/repayment_table.html',
            controller: 'RepaymentTableCtrl'
        });
    }])

    .controller('RepaymentTableCtrl', function ($scope, $http, $mdDialog, IndexService, riskService) {
        // 检测登录
        var userId = localStorage.userId;
        var token = localStorage.token;
        if (token == undefined) {
            alert("您尚未登录！");
            self.location = "/manageSystem/#/login";
            return 0;
        }
        // 查询条件
        $scope.riskData = {
            token: token,
            page: 1,
            limit: 10,
            filters: {
                state: ""
            },
            hadRepayment: "",
            keyword: "",
            group: 'loanId',
            'repayment.created_time': 'asc'
        };

        $scope.selectPage = function (page) {
            $scope.riskData['page'] = page;
            var data = angular.copy($scope.riskData);
            riskService.selectPage("/repayment/list", "/repayment/list/total", data).then(function () {
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

        // 查看详情
        $scope.showInfoDialog = function (loanId, userName) {
            localStorage.showInfoUserName = userName;
            localStorage.showInfoLoanId = loanId;
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'templates/windcontrol/repayment_info.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true
            });
        };

        function DialogController($scope, $mdDialog, $http) {

            //临时启用
            function setExpiryTime(repaymentList) {
                for (var i = 0; i < repaymentList.length; i++) {
                    var repayment = repaymentList[i];
                    var expireDate = new Date(repayment.expiryTime);
                    expireDate.setDate(expireDate.getDate() + 1);
                    expireDate.setHours(0);
                    expireDate.setMinutes(0);
                    expireDate.setSeconds(0);
                    expireDate.setMilliseconds(0);
                    repaymentList[i].realExpiryTime = expireDate.getTime();
                }
                return repaymentList;
            }

            $http.get(HOST_URL + "/repayment/" + localStorage.showInfoLoanId + "?token=" + token).success(function (responseData) {
                $scope.repaymentInfos = setExpiryTime(responseData);
                $scope.showInfoUserName = localStorage.showInfoUserName;
                $scope.getRepaymentSumAmount(angular.copy(responseData));
            });
            $scope.hide = function () {
                $mdDialog.hide();
            };
            $scope.cancel = function () {
                $mdDialog.cancel();
            };
            $scope.answer = function (answer) {
                $mdDialog.hide(answer);
            };
            $scope.getRepaymentSumAmount = function (repaymentList) {
                var repaySum = 0;
                var oneTimeRepaySum = 0;
                var isShowEachTimeRepayment = true;
                var isOverDue = false;
                var k = 0;
                for (var i = 0; i < repaymentList.length; i++) {

                    var repayment = repaymentList[i];
                    if (repayment.state == 210) {
                        isOverDue = true;
                        if (isShowEachTimeRepayment) {
                            isShowEachTimeRepayment = false;
                        }
                    }
                    if (repayment.repaymentAmount == 0 || repayment.repaymentAmount == undefined) {
                        if (k == 0) {
                            repaySum += (repayment.amount + repayment.penalty);
                            oneTimeRepaySum += (repayment.amount + repayment.penalty)
                        } else {
                            if (isOverDue) {
                                oneTimeRepaySum += repayment.amount;
                                repaySum += repayment.amount;
                            } else {
                                oneTimeRepaySum += (repayment.eachAmount + repayment.eachAmount * 0.01);
                                repaySum += (repayment.amount);
                            }
                        }
                        ++k;
                    }
                }
                $scope.repaymentSum = {
                    repaymentSum: repaySum,
                    oneTimePaySum: oneTimeRepaySum
                };
            };
        }
    })
;