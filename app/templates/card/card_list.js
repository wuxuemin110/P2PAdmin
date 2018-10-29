'use strict';

angular.module('myApp.card_list', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/card/card_list', {
            templateUrl: 'templates/card/card_list.html',
            controller: 'card_listCtrl'
        });
    }])
    .controller('card_listCtrl', function ($http,$scope, $rootScope, $mdDialog,investorCashCtrlService) {
        // var role = $rootScope.role = parseInt(localStorage.getItem('role'));
        // $scope.plan_view = {};
        //

        // 检测登录
        var userId = localStorage.userId;
        var token = localStorage.token;
        if (token == undefined) {
            alert("您尚未登录！");
            self.location = "/manageSystem/#/login";
        }

         //  var tokenData={
		//
		// }
         // tokenData.token=token;
       //编辑银行卡
      $scope.editCard = function(plan){
      	 console.log(plan);
         $rootScope.plan=plan;
          // console.log($rootScope.plan.id);
         self.location = "/manageSystem/#/card/card_edit/"+plan.id;
         var data={
             token:token
         }
          $http.get(
              HOST_URL + "/user/card/"+plan.id,
              {
                  params:data
              },
              {
                  headers: {
                      'Content-Type': 'application/x-www-form-urlencoded'
                  }
              }).success(function (responseData) {
              if(responseData.resultCode == "0") {
                  // console.log(responseData);

              }
              else {
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
                      .title('提示')
                      .textContent(responseData['resultMsg'])
                      .ok('确定')
              );
          });
      };






        // 查询条件
        $scope.keyword = '';
        $scope.searchRecharge = function () {
            $scope.cashData['keyword']=$scope.keyword;
            $scope.selectPage(1);
        }
        $scope.cashData = {
            token: token,
            page: 1,
            limit: 20,
           // userId:userId
            keyword:"",
        };
        $scope.selectPage = function (page) {
            $scope.cashData['page'] = page;
            var data = angular.copy($scope.cashData);
            investorCashCtrlService.selectPage("/user/card/list", data).then(function () {
               var tmpObject = investorCashCtrlService.getResult();
                $scope.itemList = tmpObject.itemList;
                $scope.nowPage = tmpObject.nowPage;
                $scope.pages = tmpObject.pages;
                $scope.sumCount=tmpObject.sumCount;
                $scope.isShowDot = tmpObject.isShowDot;
                $scope.totalPages = tmpObject.totalPages;
                $scope.startIndex = tmpObject.startIndex;
            });
        };
        $scope.selectPage(1);
    });