'use strict';

angular.module('myApp.loan_cash', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/money/loan_cash', {
            templateUrl: 'templates/money/loan_cash.html',
            controller: 'loanCashCtrl'
        });
    }])

    .controller('loanCashCtrl', function ($scope, $http, $mdDialog, riskService) {
        // 检测登录
        var val = 1;
        var userId = localStorage.userId;
        var token = localStorage.token;
        if (token == undefined) {
            alert("您尚未登录！");
            self.location = "/manageSystem/#/login";
            return 0;
        }

        $scope.setVal = function (input) {
            // 设置状态
            $scope.cashData['val'] = input;  
            $scope.selectPage(1);   
        };

         //获取状态
        $http.get(HOST_URL+"/money/getStateOptions").success(function(responseData) {
            $scope.stateOptions = responseData;
        });

        $scope.changeState = function(id,state){
            $http.post(HOST_URL+"/money/updateState?id="+id+"&state="+state).success(function(){
                 $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent('状态更新成功')
                            .ok('确定')
                    ).then(function(){//确定按钮方法
                        // 获取交易流水
                        $scope.selectPage(1);
                    }, function(){});
            }).error(function(responseData){
                $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent(responseData['error'])
                            .ok('确定')
                    );
                
            }); 
        }     

        // 查询条件
        $scope.cashData = {
            val : val,
            token: token,
            page: 1,
            limit: 10,
            userId: "",
            account: "",
            cash: "",
            createdTime: "",
            keyword: ""
        };

        $scope.selectPage = function (page) {
            $scope.cashData['page'] = page;
            var data = angular.copy($scope.cashData);
            riskService.selectPage("/money/getLoanWithdraw", "/money/getLoanWithdraw/toal", data).then(function () {
                var tmpObject = riskService.getResult();
                $scope.itemList = tmpObject.itemList;
                $scope.nowPage = tmpObject.nowPage;
                $scope.pages = tmpObject.pages;
                $scope.isShowDot = tmpObject.isShowDot;
                $scope.totalPages = tmpObject.totalPages;
                $scope.startIndex = tmpObject.startIndex;
            });
        };

        $scope.setVal(1);
    });