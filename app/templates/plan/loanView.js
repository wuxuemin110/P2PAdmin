'use strict';

angular.module('myApp.loanView', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/plan/loanView', {
            templateUrl: 'templates/plan/loanView.html',
            controller: 'loanViewCtrl'
        });
    }])
    .controller('loanViewCtrl', function ($http,$scope, $rootScope, $mdDialog,investorCashCtrlService,bannerListService,$filter) {
        var role = $rootScope.role = parseInt(localStorage.getItem('role'));
        $scope.loanView = {};
        // 检测登录
        var userId = localStorage.userId;
        var token = localStorage.token;
        if (token == undefined) {
            alert("您尚未登录！");
            self.location = "/manageSystem/#/login";
        }
          var tokenData={
			
		}
         tokenData.token=token;
         // function
      $scope.showConfirm = function (loan) {
            $mdDialog.show(
                $mdDialog.confirm()
                    .clickOutsideToClose(true)
                    .title('您确定要删除吗？')
                    .ok('确定')
                    .cancel('取消')
            ).then(function () {
                $scope.deleteUI(loan);
            }, function () {

            });
        };
        $scope.deleteUI = function (loan) {
     	// console.log(loan);
            $http.get(HOST_URL + "/back/loan/"+loan.id+"/delete", {
                    	params:tokenData
                    },
            {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).success(function (responseData) {
            	
            		if(responseData.resultCode == "0") {
            		$mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent(responseData.resultMsg)
                            .ok('确定')
                    ).finally(function() {
							window.location.reload();
						}); 	
                }
            		else {
						bannerListService.alertInfo(responseData);
					}

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
        //查看借款计划
        $scope.viewUI = function(loan){
        $rootScope.loan=loan;
//      console.log(loan);
        self.location = "/manageSystem/#/plan/loanDetail/"+loan.id;
        };
       //编辑借款计划
      $scope.editUI = function(loan){
         $rootScope.loan=loan;
         self.location = "/manageSystem/#/plan/loanEdit/"+loan.id;  
      };

        $scope.viewAutomatic = function(loan){
            $rootScope.loan=loan;
            self.location = "/manageSystem/#/plan/loan_automatic_detail";
        };
        $scope.editAutomatic = function(loan){
            $rootScope.loan=loan;
            self.location = "/manageSystem/#/plan/loan_automatic_edit";
        };
         // 查询条件
        $scope.cashData = {
            token: token,
            page: 1,
            limit: 20,
            keyword: "",
            startDate:"",
            endDate:"",
        };
        $scope.selectPage = function (page) {
            $scope.cashData['page'] = page;
            var data = angular.copy($scope.cashData);
//          console.log(data);

            data.startDate=$filter('date')(data.startDate, "yyyyMMddHHmmss");
            data.endDate=$filter('date')(data.endDate, "yyyyMMdd");
            if(data.endDate!=""){
                data.endDate +="235959";
            }
            investorCashCtrlService.selectPage("/back/loan/list", data).then(function () {
               var tmpObject = investorCashCtrlService.getResult();
//      console.log(tmpObject);
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