'use strict';

angular.module('myApp.userEdit', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/user/userEdit/:id', {
            templateUrl: 'templates/user/userEdit.html',
            controller: 'userEditCtrl'
        });
    }])

    .controller('userEditCtrl', function ($scope, $http, $location,$mdDialog,$routeParams,userEditService, IndexService ) {
        $scope.tradeRecords = {};
        $scope.userAccount = {};
        // 检测登录
        var userId = localStorage.userId;
        var token = localStorage.token;
        var name=localStorage.name;
        // console.log(name)
        if (token == undefined) {
            alert("您尚未登录！");
            self.location = "/manageSystem/#/login";
            return 0;
        }

        $scope.user = {};
        // $scope.user.id = $location.$$search.userId;
        // $scope.user.role= $location.$$search.role;
        //初始化“选择用户身份”的下拉

        $http.get(HOST_URL+"/user/getRoleOptions?token="+token)
            .success(function(responseData) {
                $scope.roleOptions = responseData.resultData;
                // console.log( $scope.roleOptions);
            });

        // 获取交易流水
        userEditService.synTradeRecords($routeParams.id, token).success(function () {
            $scope.tradeRecords = userEditService.getTradeRecords();
            $scope.tradeRecords.role= $scope.tradeRecords.role+"";
        });
        // var data={
        //         token:token,
        //         phone:$scope.tradeRecords.phone,
        //
        //     }
        // console.log($scope.tradeRecords)
        // var data=angular.copy($scope.cashData);
        // console.log(data)
        $scope.updateUser = function(tradeRecords){
            // console.log(tradeRecords.phone)
            var data={
                phone:tradeRecords.phone,
                name:tradeRecords.name,
                realName:tradeRecords.realName,
                idCard:tradeRecords.idCard,
                password:tradeRecords.password,
                token:token,
                role: $scope.tradeRecords.role,
                userId:$routeParams.id
            }
            // console.log(data);
            $http.post(HOST_URL+"/user/update",
                $.param(data),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            ).success(function(responseData){
        if(responseData.resultCode == "0"){
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('提示')
                    .textContent(responseData['resultMsg'])
                    .ok('确定')
            ).finally(function() {

                $location.path('/user/userView');
            });
        }else{
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



    })

    .factory('userEditService', function ($http, $mdDialog) {
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
                return $http.get(HOST_URL + "/user/userinfo/updateinfo?token=" + token+"&userId=" + userId).success(function (responseData) {
                    tradeRecords = responseData.resultData;

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