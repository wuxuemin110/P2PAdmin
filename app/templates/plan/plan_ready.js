'use strict';

angular.module('myApp.plan_ready', ['ngRoute']).directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/plan/plan_ready', {
            templateUrl: 'templates/plan/plan_ready.html',
            controller: 'plan_readyCtrl'
        });
    }])

    .controller('plan_readyCtrl', function ($http, $scope, plan_readyService, riskService) {
        // 检测登录
        var token = localStorage.token;
        if (token == undefined) {
            alert("您尚未登录！");
            self.location = "/manageSystem/#/login";
        }
        //上传 身份证按钮
        $scope.uploadIDCardFile = function (userId) {
            var file = $scope.myFile;
            plan_readyService.uploadIDCardFileToUrl(file, userId, token);
        };
        //上传 学生证按钮
        $scope.uploadStudentFile = function (userId) {
            var file = $scope.myFile;
            plan_readyService.uploadStudentFileToUrl(file, userId, token);
        };

        // 查询条件
        $scope.cashData = {
            token: token,
            page: 1,
            limit: 3
        };

        $scope.selectPage = function (page) {
            $scope.cashData['page'] = page;
            var data = angular.copy($scope.cashData);
            riskService.selectPage("/planReady/planReadyList", "/planReady/planReadyList/total", data).then(function () {
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

    .factory('plan_readyService', function ($http, $mdDialog) {
        var fileName;
        var downloadPath = HOST_URL + "/planReady/downloadPic?fileName=";
        return {
            getPath: function () {
                return downloadPath;
            },
            getFileName: function () {
                return fileName;
            },
            //上传身份证图片
            uploadIDCardFileToUrl: function (file, userId, token) {
                var fd = new FormData();
                fd.append('file', file);
                $http.post(HOST_URL + "/planReady/upload?token=" + token + "&userId=" + userId + "&type=1", fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                })
                    .success(function (data) {
                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title('提示')
                                .textContent("身份证上传成功")
                                .ok('确定')
                        );
                    });
            },
            //上传学生证图片
            uploadStudentFileToUrl: function (file, userId, token) {
                var fd = new FormData();
                fd.append('file', file);
                $http.post(HOST_URL + "/planReady/upload?token=" + token + "&userId=" + userId + "&type=2", fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                })
                    .success(function (data) {
                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title('提示')
                                .textContent("学生证上传成功")
                                .ok('确定')
                        );
                    });
            },
            alertError: function (message) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('发生错误，错误信息如下：')
                        .textContent(message)
                        .ok('确定')
                );
            },
            alertInfo: function (message) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent(message)
                        .ok('确定')
                );
            },
        }
    });