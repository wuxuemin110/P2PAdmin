'use strict';

angular.module('myApp.propel_list', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/activity/propel_list', {
            templateUrl: 'templates/activity/propel_list.html',
            controller: 'propel_listCtrl'
        });
    }])
    .controller('propel_listCtrl', function ($http,$scope, $rootScope, $mdDialog,investorCashCtrlService,bannerListService,$filter) {
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
            $http.post(HOST_URL + "/sys/getui/delete/"+loan.id,
                    	$.param(tokenData),

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


       //编辑推动详情
      $scope.editUI = function(loan){
         $rootScope.loan=loan;
         self.location = "/manageSystem/#/activity/propelEdit/"+loan.id;
      };

         // 查询条件
        $scope.cashData = {
            token: token,
            page: 1,
            limit: 20,
           type:'',
            investment:'',
            realname:'',
            registered:''
        };
        $scope.selectPage = function (page) {
            $scope.cashData['page'] = page;
            var data = angular.copy($scope.cashData);
            investorCashCtrlService.selectPage("/sys/getui/list", data).then(function () {
               var tmpObject = investorCashCtrlService.getResult();
                $scope.itemList = tmpObject.itemList;
                // console.log($scope.itemList.personalInfo );
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