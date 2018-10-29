'use strict';

angular.module('myApp.userAdd', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/user/userAdd', {
            templateUrl: 'templates/user/userAdd.html',
            controller: 'userAddCtrl'
        });
    }])

    .controller('userAddCtrl', function ($scope, $http, $mdDialog, userAddService, IndexService) {
       
        $scope.tradeRecord = {};
        $scope.userAccount = {};
        $scope.user={};
        // var tokenData={};
        // 检测登录
        var userId = localStorage.userId;
        var token = localStorage.token;
       // tokenData.token =token;
       // console.log(tokenData);

        if (token == undefined) {
            alert("您尚未登录！");
            self.location = "/manageSystem/#/login";
            return 0;
        }

       // var data = {
       //     name:$scope.user.name,
       //      realName: $scope.user.realName,
       //     password: $scope.user.password,
       //      token:token
       //
       //  };
       //
        $scope.saveRegister = function (){
            var data = {
                name:$scope.user.name,
                realName: $scope.user.realName,
                password: $scope.user.password,
                token:token,
                role:$scope.user.role,
                idCard:$scope.user.idCard,
                phone:$scope.user.phone

            };
            $http.post(
                HOST_URL+"/user/addUser",
            $.param(data),
                {
                    headers: {
                          'Content-Type': 'application/x-www-form-urlencoded'
                     }
                }

            ).success(function(responseData){

                if(responseData.resultCode=="0"){

                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent('保存成功')
                            .ok('确定')
                    );
                    self.location = "/manageSystem/#/user/userView";

                }else {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent(responseData['resultMsg'])
                            .ok('确定')
                    );
                }
            }).error(function(responseData){
                $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent(responseData['resultMsg'])
                            .ok('确定')
                    );
                
            });
        }

        // 获取交易流水
        userAddService.synTradeRecords(userId, token).success(function () {
            $scope.tradeRecords = userAddService.getTradeRecords();
            $scope.selectPage(1, $scope.tradeRecords);
        });
        $scope.selectPage = function (page) {
            var tmpObject = IndexService.selectPages(page, $scope.tradeRecords);
            $scope.itemList = tmpObject.itemList;
            $scope.nowPage = tmpObject.nowPage;
            $scope.pages = tmpObject.pages;
            $scope.isShowDot = tmpObject.isShowDot;
            $scope.totalPages = tmpObject.totalPages;
            $scope.startIndex = tmpObject.startIndex;
        }
        
        //初始化“选择用户身份”的下拉
        $http.get(HOST_URL+"/user/getRoleOptions?token="+token).success(function(responseData) {
                        if(responseData.resultCode=="0"){
                            $scope.roleOptions=responseData.resultData;
                        }
                    });
    
    })

    .factory('userAddService', function ($http, $mdDialog) {
        var count = 5;
        var tradeRecords;
        return {
            getTradeRecords: function () {
                return tradeRecords;
            },
            getPages: function () {
                var items = [];
                var pages = tradeRecords.length / count;
                var ends = tradeRecords.length % count;
                if (ends != 0) {
                    pages++;
                }
                for (var i = 0; i < parseInt(pages); i++) {
                    items[i] = i;
                }
                return items;
            },
            // 同步 TradeRecords
            synTradeRecords: function (userId, token) {
                return $http.get(HOST_URL + "/user/" + userId + "/tradeRecords?token=" + token).success(function (responseData) {
                    tradeRecords = responseData;
                }).error(function (responseData) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent(message)
                            .ok('确定')
                    );
                });
            }
                
        }
    });