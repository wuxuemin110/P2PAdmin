'use strict';

angular.module('myApp.investor_recharge', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/money/investor_recharge', {
            templateUrl: 'templates/money/investor_recharge.html',
            controller: 'investorRechargeCtrl'
        });
    }])

    .controller('investorRechargeCtrl', function ($scope, $filter, $http, $mdDialog, riskService) {
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

        $scope.changeType = function (type, select) {
            $("tr select").each(function () {
                if ($(this).val() == 1) {
                    $(this).parent().parent().find(".srk").hide();
                } else {
                    $(this).parent().parent().find(".srk").show();
                }
            });
            if (type == 1) {
                $("#sel_" + select).parent().parent().find(".srk").hide()
            }
        };

        $scope.recharge = function (money, type, userId, voucherCondition, beginTime, expiredTime,restricta) {
            if (type == undefined) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent('请选择充值的类型')
                        .ok('确定')
                );
                return;
            }
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
            if (type != 1) {
                if (voucherCondition == undefined) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent('请输入使用条件')
                            .ok('确定')
                    );
                    return;
                }
                if (beginTime == undefined) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent('请输入开始时间')
                            .ok('确定')
                    );
                    return;
                }
                if (expiredTime == undefined) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent('请输入结束时间')
                            .ok('确定')
                    );
                    return;
                }
            }
            beginTime = $filter('date')(beginTime, 'yyyy-MM-dd HH:mm:ss');
            expiredTime = $filter('date')(expiredTime, 'yyyy-MM-dd HH:mm:ss');
            if(beginTime == undefined){
                beginTime = new Date().getTime();
                voucherCondition = 0;
            }
            if(expiredTime == undefined){
                expiredTime = new Date().getTime();
                voucherCondition = 0;
            }
            money = money * 100;
            money =  parseInt(money)
            // console.log(money)
            $http.post(HOST_URL + "/money/topupForInvestor?token=" + token + "&money=" + money + "&type=" + type + "&userId=" + userId + "&beginTime=" + beginTime + "&expiredTime=" + expiredTime + "&voucherCondition=" + voucherCondition * 100+"&restricta="+restricta).success(function () {
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
            riskService.selectPage("/money/getInvestorList/", "/money/getInvestorList/total", data).then(function () {
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