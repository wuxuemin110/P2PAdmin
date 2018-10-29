'use strict';

angular.module('myApp.userPassword', ['ngRoute', 'ngMaterial'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/user/userPassword', {
            templateUrl: 'templates/user/userPassword.html',
            controller: 'UserPasswordCtrl'
        });
    }])

    .controller('UserPasswordCtrl', function ($scope, $mdDialog, layoutService, UserPasswordService) {
        $scope.password = {};
        //
        var userId = localStorage.userId;
        var token = localStorage.token;
        if (token == undefined) {
            alert("您尚未登录！");
            self.location = "/manageSystem/#/login";
        }
        else {
            layoutService.synUser(token).then(function () {
                $scope.user = layoutService.getUser();
            });
        }
        // function
        $scope.update = function () {
            if (typeof($scope.password.password) == "undefined" && typeof($scope.password.passwordNew) == "undefined" && typeof($scope.password.passwordNew2 == "undefined")) {
                UserPasswordService.alertError("请完整输入以上信息")
                return 0;
            }
            if ($scope.password.passwordNew != $scope.password.passwordNew2) {
                UserPasswordService.alertError("您输入的两次密码不一致")
                return 0;
            }
            var data={
                token:token,
                password:$scope.password.password,
                passwordNew:$scope.password.passwordNew
            }
            UserPasswordService.updatePassword(data).then(function () {
                $scope.password = {};
            });
        };
    })

    .factory('UserPasswordService', function ($http, $mdDialog) {
        return {
            updatePassword: function (data) {
                return $http.post(
                    HOST_URL + "/user/updatePassword",
                    $.param(data),
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }
                ).success(function (responseData) {
                    if(responseData.resultCode=="0"){
                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title('提示')
                                .textContent(responseData['resultMsg'])
                                .ok('确定')
                        );
                    }else{
                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title('提示')
                                .textContent(responseData['resultMsg'])
                                .ok('确定')
                        );
                    }

                }).error(function (responseData) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('发生错误，错误信息如下：')
                            .textContent(responseData['error'])
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
            }
        }
    });