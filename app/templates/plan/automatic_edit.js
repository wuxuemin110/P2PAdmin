'use strict';

angular.module('myApp.automatic_edit', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/plan/automatic_edit', {
            templateUrl: 'templates/plan/automatic_edit.html',
            controller: 'automatic_editCtrl'
        });
    }])

    .controller('automatic_editCtrl', function ($http,$filter, $mdDialog,$scope, $rootScope, automatic_editService) {
        var message;
        // 检测登录
        var userId = localStorage.userId;
        var token = localStorage.token;
        if (token == undefined) {
            alert("您尚未登录！");
            self.location = "/manageSystem/#/login";
        }
        $scope.automatic = {};
        $scope.automatic.aname =  $rootScope.plan.name;
        $scope.automatic.planId =  $rootScope.plan.planId;
        $scope.selectVoucherId=function (name,money) {
           $scope.automatic.voucherId = '0'
          if(name==''||money==''||money=='0'||money==0||name==null||money==null){
               $mdDialog.show(
                  $mdDialog.alert()
                      .clickOutsideToClose(true)
                      .title('发生错误，错误信息如下：')
                      .textContent("账号或金额不能为空！")
                      .ok('确定')
              );
          }else {
                 $http.get(HOST_URL + "/user/voucherList?name="+name+"&money="+money*100).success(function (responseData) {
                      $scope.voucherId = responseData
                    }).error(function (responseData) {
                      $mdDialog.show(
                          $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title('发生错误，错误信息如下：')
                                .textContent(responseData.error)
                                .ok('确定')
                     );
                 });
             }
        }
        $scope.update = function() {
            automatic_editService.Automatic(token,$scope.automatic.planId,$scope.automatic.name,$scope.automatic.money,$scope.automatic.voucherId);
        };
    })
    .factory('automatic_editService', function ($http, $mdDialog) {
        return {
            Automatic: function (token,planId,name,money,voucherId) {
                return $http.get(HOST_URL + "/plan/automatic?token=" + token+"&planId="+planId+"&name="+name+"&money="+money*100+"&voucherId="+voucherId).success(function (responseData) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent(responseData.message)
                            .ok('确定')
                    );
                }).error(function (responseData) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent(responseData.error)
                            .ok('确定')
                    );
                });
            }
        }
    });