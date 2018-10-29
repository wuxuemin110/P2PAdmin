'use strict';

angular.module('myApp.plan_view', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/plan/plan_view', {
            templateUrl: 'templates/plan/plan_view.html',
            controller: 'plan_viewCtrl'
        });
    }])
    .controller('plan_viewCtrl', function ($http,$scope, $rootScope, $mdDialog,investorCashCtrlService,bannerListService,$filter) {
        var role = $rootScope.role = parseInt(localStorage.getItem('role'));
        $scope.plan_view = {};
      
		
        // 检测登录
        var userId = localStorage.userId;
        var token = localStorage.token;
        if (token == undefined) {
            alert("您尚未登录！");
            self.location = "/manageSystem/#/login";
        }

        $scope.showConfirm=function(plan){
            $mdDialog.show(
                $mdDialog.confirm()
                    .clickOutsideToClose(true)
                    .title("您确定要删除吗？")
                    .ok("确定")
                    .cancel("取消")
            ).then(function() {
                $scope.deleteUI(plan);
            },function(){
            })
        }


          var tokenData={
			
		}
         tokenData.token=token;
        //删除投资计划
        $scope.deleteUI = function (plan) {
//      	console.log(plan.planId,tokenData.token);
            $http.get(HOST_URL + "/back/plan/"+plan.planId+"/delete",
            {
                    	params:tokenData
                    },
            {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }
            ).success(function (responseData) {
                if(responseData.resultCode == "0") {
            		$mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent(responseData.resultMsg)
                            .ok('确定')
                    ).finally(function(){
                        window.location.reload();
                    });

                 $scope.selectPage(1);  	
                }else{
                    bannerListService.alertInfo(responseData)
                }
            		// else if(responseData.resultCode == "1"){
            		// 	$mdDialog.show(
                     //    $mdDialog.alert()
                     //        .clickOutsideToClose(true)
                     //        .title('提示')
                     //        .textContent(responseData.resultMsg)
                     //        .ok('确定')
                    // );
            		// }

                }).error(function (responseData) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('发生错误，错误信息如下：')
                            .textContent(responseData.resultMsg)
                            .ok('确定')
                    );
                });
           
        };
        //查看投资计划
        $scope.viewUI = function(plan){
        $rootScope.plan=plan;
        self.location = "/manageSystem/#/plan/plan_detail/"+plan.planId;
        };
       //编辑投资计划
      $scope.editUI = function(plan){
      	// console.log(plan);
         $rootScope.plan=plan;
         self.location = "/manageSystem/#/plan/plan_edit/"+plan.planId;  
      };

        $scope.viewAutomatic = function(plan){
            $rootScope.plan=plan;
            self.location = "/manageSystem/#/plan/automatic_detail";
        };
        $scope.editAutomatic = function(plan){
            $rootScope.plan=plan;
            self.location = "/manageSystem/#/plan/automatic_edit";
        };
        // 查询条件
        $scope.cashData = {
            token: token,
            page: 1,
            limit: 20,
            keyword: "",
            purchaseTime1:"",
            purchaseTime2:"",
            showTime1:"",
            showTime2:"",
        };
        $scope.selectPage = function (page) {
            $scope.cashData['page'] = page;
            var data = angular.copy($scope.cashData);
            data.purchaseTime1=$filter('date')(data.purchaseTime1, "yyyyMMddHHmmss");
            data.purchaseTime2=$filter('date')(data.purchaseTime2, "yyyyMMdd");
            if(data.purchaseTime2!=""){
                data.purchaseTime2 +="235959";
            }
            data.showTime1=$filter('date')(data.showTime1, "yyyyMMddHHmmss");
            data.showTime2=$filter('date')(data.showTime2, "yyyyMMdd");
            if(data.showTime2!=""){
                data.showTime2 +="235959";
            }
            investorCashCtrlService.selectPage("/back/plan/list", data).then(function () {
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