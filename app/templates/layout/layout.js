'use strict';

angular.module('myApp.layout', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/layout/layout', {
            templateUrl: 'templates/layout/layout.html',
            controller: 'LayoutCtrl'
        });
    }])

    .controller('LayoutCtrl', function ($location, $scope, $rootScope, layoutService, $route,$mdDialog,bannerListService) {
        // 判断登录
        var userId = localStorage.userId;
        $scope.userId = userId
        var token = localStorage.token;
        var userName = localStorage.userName;
        var role = $rootScope.role = parseInt(localStorage.getItem('role'));
        
        if (token == undefined) {
            //alert("您尚未登录！");
            self.location = "/manageSystem/#/login";
            return
        }
        // else {
        //     layoutService.synUserAccount(userId, token).success(function () {
        //         $scope.userAccount = layoutService.getUserAccount();
        //     });
        // }
        //
        $rootScope.url = {
            'login': '/manageSystem/#/login',
            'register': '/manageSystem/#/register',
            'about': '/manageSystem/#/about'
        };
        $scope.TiaoZhuan = function (a) {
            var url = $location.path();
            if(a==url){
                // console.log('ss');
                //$route.reload();
            }
            $location.path(a);
            
        };
         $scope.logout = function () {
            $mdDialog.show(
                $mdDialog.confirm()
                    .clickOutsideToClose(true)
                    .title('您确定要退出吗？')
                    .ok('确定')
                    .cancel('取消')
            ).then(function () {
                localStorage.clear();
              
                self.location = "/manageSystem/#/login";
               
            }, function () {

            });
        };
        if (userId != undefined && token != undefined && userName != undefined) {
            $rootScope.url.login = '/manageSystem/#/user/index';
            $rootScope.url.register = '/manageSystem/#/logout';
            $rootScope.userName = userName;
            $rootScope.log = "退出登录";
        } else {
            $rootScope.url.login = '/manageSystem/#/login';
            $rootScope.url.register = '/manageSystem/#/register';
            $rootScope.userName = "立即登录";
            $rootScope.log = "立即注册";
        }
        $rootScope.is_borrower = role == 200;
    })

    .factory('layoutService', function ($http, $mdDialog,bannerListService) {
        var user;
        var userInfo;
        var userAccount;
        var userRealPlans;
        var userExpPlans;
        var bankCards;

        return {
            getUser: function () {
                return user;
            },
            getUserInfo: function () {
                return userInfo;
            },
            getUserAccount: function () {
                return userAccount;
            },
            getUserRealPlans: function () {
                return userRealPlans;
            },
            getBankCards: function () {
                return bankCards;
            },


            // 同步用户
            synUser: function (token) {
                return $http.get(HOST_URL + "/user?token=" + token).success(function (responseData) {
                    if(responseData.resultCode=="0"){
                       user=responseData;

                 }else {
                        bannerListService.alertInfo(responseData);
                    }
                    // console.log(user);
                }).error(function (responseData) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('发生错误')
                            .textContent(userInviteService)
                            .ok('确定')
                    );
                });
            },
            // 同步用户账户
            // synUserAccount: function (userId, token) {
            //     return $http.get(HOST_URL + "/user/" + userId + "/account?token=" + token).success(function (responseData) {
            //     	if(responseData.resultCode == "0") {
            //         userAccount = responseData.resultData;
            //        }else {
				// 		bannerListService.alertInfo(responseData);
				// 	}
            //     }).error(function (responseData) {
            //         $mdDialog.show(
            //             $mdDialog.alert()
            //                 .clickOutsideToClose(true)
            //                 .title('发生错误')
            //                 .textContent(responseData['resultMsg'])
            //                 .ok('确定')
            //         );
            //     });
            // },
            // 同步用户已投资计划
            synUserRealPlans: function () {

            },
            // 同步用户已投资体验计划
            synUserExpPlans: function () {

            },
            // 充值
            recharge: function () {
            },
            // 提现
            withdraw: function () {
            },
            // 修改用户密码
            updatePassword: function () {
            },
            // 修改用户交易密码
            updateAccountPassword: function () {
            },
//          addBankCard: function (userId, token, userCard) {
//              return $http.post(
//                  HOST_URL + "/user/" + userId + "/account/card?token=" + token,
//                  userCard,
//                  {
//                      headers: {
//                          'Content-Type': 'application/json'
//                      }
//                  }
//              ).success(function (responseData) {
//              }).error(function (responseData) {
//                  $mdDialog.show(
//                      $mdDialog.alert()
//                          .clickOutsideToClose(true)
//                          .title('发生错误')
//                          .textContent(responseData['resultMsg'])
//                          .ok('确定')
//                  );
//              });
//          }
        }
    });