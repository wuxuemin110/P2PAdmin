'use strict';

angular.module('myApp.investor_add', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/investor/investor_add', {
            templateUrl: 'templates/investor/investor_add.html',
            controller: 'Investor_addCtrl'
        });
    }])
    
    .controller('Investor_addCtrl', function ($scope, $http, $mdDialog) {
     // 检测登录
        var userId = localStorage.userId;
        var token = localStorage.token;
        if (token == undefined) {
            alert("您尚未登录！");
            self.location = "/manageSystem/#/login";
            return 0;
        }
    
        $scope.intentionCustomer = {};
        //添加潜在投资人
        $scope.addIntentionCustomer = function(){
           $http.post(HOST_URL+"/investor/addIntentionCustomer?token="+token, $scope.intentionCustomer).success(function(){
                $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent('保存成功')
                            .ok('确定')
                    );
               $scope.intentionCustomer = {};//清空表单
                
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
        
        /**取消操作，回到列表**/
        $scope.cancel = function(){
            self.location='/manageSystem/#/investor/investor_potential';
        }

    })
;