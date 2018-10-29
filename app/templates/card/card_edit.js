'use strict';

angular.module('myApp.card_edit', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/card/card_edit/:id', {
            templateUrl: 'templates/card/card_edit.html',
            controller: 'card_editCtrl'
        }); 
    }])

    .controller('card_editCtrl', function ($scope,$http, $rootScope, investorCashCtrlService,$routeParams,$mdDialog,$location) {
        $scope.card_edit = {};
        // 检测登录
        var userId = localStorage.userId;
        var token = localStorage.token;
        if (token == undefined) {
            alert("您尚未登录！");
            self.location = "/manageSystem/#/login";
        }
		var userId = localStorage.userId;
$scope.update=function(){

    var data={
        token:token,
        bankCode:$scope.plan.bankCode,
        cardNumber:$scope.plan.cardNumber,
        province:$scope.plan.province,
        city:$scope.plan.city,
        district:$scope.plan.district,
        subbranch:$scope.plan.subbranch,
        id:$rootScope.plan.id,
		managerId:userId

    }
    $http.post(HOST_URL + "/investor/card/update",
        $.param(data), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    ).success(function(responseData) {
        if(responseData.resultCode=="0"){
            // console.log(responseData);
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('提示')
                    .textContent("修改成功")
                    .ok('确定')
            );
            self.location = "/manageSystem/#/card/card_list";
        }else {
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('提示')
                    .textContent(responseData['resultMsg'])
                    .ok('确定')
            );
        }
    }).error(function(responseData) {
        $mdDialog.show(
            $mdDialog.alert()
                .clickOutsideToClose(true)
                .title('提示')
                .textContent("修改失败")
                .ok('确定')
        );
    });

}



    });