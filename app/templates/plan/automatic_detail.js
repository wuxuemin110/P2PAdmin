'use strict';

angular.module('myApp.automatic_detail', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/plan/automatic_detail', {
            templateUrl: 'templates/plan/automatic_detail.html',
            controller: 'automatic_detailCtrl'
        });
    }])
    .controller('automatic_detailCtrl', function ($http,$mdDialog,$scope, $rootScope, automatic_detailService) {
        $scope.plan_detail = {};
        $scope.planId;
        $scope.planName;
        // 检测登录
        var userId = localStorage.userId;
        var token = localStorage.token;
        if (token == undefined) {
            alert("您尚未登录！");
            self.location = "/manageSystem/#/login";
        }
        $scope.planId=$rootScope.plan.planId;
        $scope.planName=$rootScope.plan.name;
        
        $scope.delectY = function (en,ex) {
            $http.get(HOST_URL + "/plan/automatic/delect?id=" + en+"&planId="+ex).success(function (responseData) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent("删除成功！")
                        .ok('确定')
                );
            }).error(function (responseData) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('发生错误，错误信息如下：')
                        .textContent(responseData.message)
                        .ok('确定')
                );
            });
        }

        automatic_detailService.AutomaticList(token,$scope.planId).success(function () {
            $scope.automaticList = automatic_detailService.getAutomaticList();
        })
    })
    .factory('automatic_detailService', function ($http, $mdDialog) {
        var AutomaticList;
        return {
        getAutomaticList:function () {
            return AutomaticList;
        },
        AutomaticList: function (token,planId) {
            return $http.get(HOST_URL + "/plan/automatic/list?token="+token+"&planId="+planId).success(function (responseData) {
                AutomaticList =  responseData
                // console.log(AutomaticList)
            }).error(function (responseData) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent("123")
                        .ok('确定')
                );
            });
        }
    }
});