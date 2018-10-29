'use strict';

angular.module('myApp.activity', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/investor/activity', {
            templateUrl: 'templates/investor/activity.html',
            controller: 'ActivityCtrl'
        });
    }])
    .controller('ActivityCtrl', function ($scope, $http, $rootScope, $location, $mdDialog, IndexService, riskService) {
        // 检测登录
        $scope.adStyle = "0"
        $scope.activity = {};
        var userId = localStorage.userId;
        var token = localStorage.token;
        if (token == undefined) {
            alert("您尚未登录！");
            self.location = "/manageSystem/#/login";
            return 0;
        }
        $scope.deleteConf = function (en) {
            $http.get(HOST_URL + "/investor/activity/delete/"+en).success(function (responseData) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent("删除成功")
                        .ok('确定')
                );
                $scope.selectPage(1,$scope.adStyle)
            })
        };

        $scope.selectPage = function (page,en) {
            var data = {
                token: token,
                page: page,
                limit: 5,
            };
            riskService.selectPage("/investor/activity/" + en, "/investor/activity/total/"+en, data).then(function () {
                var tmpObject = riskService.getResult();
                $scope.itemList = tmpObject.itemList;
                $scope.nowPage = tmpObject.nowPage;
                $scope.pages = tmpObject.pages;
                $scope.isShowDot = tmpObject.isShowDot;
                $scope.totalPages = tmpObject.totalPages;
                $scope.startIndex = tmpObject.startIndex;
            });
        }

        $scope.selectPage(1,0);

        $scope.updateActivity = function () {
            $scope.activity.type=$scope.adStyle;
            var activity = angular.copy($scope.activity);
            activity.itemValue =    activity.itemValue*100;
            activity.itemCondition = activity.itemCondition*100;
            $http.post(HOST_URL + "/investor/activity",
                activity,
                {headers: {'Content-Type': 'application/json'}}
            ).success(function (responseData) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent("更新成功")
                        .ok('确定')
                );
                $scope.selectPage(1,$scope.adStyle);
            }).error(function (responseData) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('发生错误，错误信息如下：')
                        .textContent(responseData)
                        .ok('确定')
                );
            });
        };
    });