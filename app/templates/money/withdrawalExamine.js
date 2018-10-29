'use strict';

angular.module('myApp.withdrawalExamine', ['ngRoute'])

	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/money/withdrawalExamine/:id', {
			templateUrl: 'templates/money/withdrawalExamine.html',
			controller: 'withdrawalExamineCtrl'
		});
	}])

	.controller('withdrawalExamineCtrl', function($http, $filter, $mdDialog, $scope, $rootScope, $routeParams, withdrawalExamineCtrl) {
		console.log($routeParams)
		$scope.withdrawData = {};
		//      $scope.planCarLoan = {};
		//      $scope.carLoan = {};
		// 检测登录
		var userId = localStorage.userId;
		var token = localStorage.token;
		var tokenData={
			
		}
		tokenData.managerId=userId;
		tokenData.token=token;

		//console.log(tokenData)
		if(token == undefined) {
			alert("您尚未登录！");
			self.location = "/manageSystem/#/login";
		}
		//   $scope.getWithdrawData = function () {
		$http.get(HOST_URL + "/user/withdraw/" + $routeParams.id,{
                    	params:tokenData
                    },{
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }
		).success(function(responseData) {
			if(responseData.resultCode == "0") {
				$scope.withdrawData = responseData.resultData;
//				console.log($scope.withdrawData);
			}

		}).error(function(responseData) {
			$mdDialog.show(
				$mdDialog.alert()
				.clickOutsideToClose(true)
				.title('发生错误，错误信息如下：')
				.textContent(responseData.resultMsg)
				.ok('确定')
			);
		});
		//审核成功
		$scope.examineSuccess = function() {
            tokenData.remark=$scope.withdrawData.remark;
			$http.post(HOST_URL + "/user/withdraw/" + $routeParams.id + "/success",
                    	$.param(tokenData)
			,{
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }

			).success(function(responseData) {
				if(responseData.resultCode == "0") {
					self.location = "/manageSystem/#/money/investor_cash";
				}
				else if(responseData.resultCode == "2"){
					self.location = "/manageSystem/#/login";
                    return 0;
				}
			}).error(function(responseData) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent(responseData.resultMsg)
					.ok('确定')
				);
			});

		};

		//审核失败
		$scope.examineFail = function() {
            tokenData.remark=$scope.withdrawData.remark;
			$http.post(HOST_URL + "/user/withdraw/" + $routeParams.id + "/fail",
                    	$.param(tokenData)
			,{
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }

			).success(function(responseData) {
				if(responseData.resultCode == "0") {
					$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent("提交成功")
					.ok('确定')
				).finally(function() {
					self.location = "/manageSystem/#/money/investor_cash";
				  });
					
				}
				else if(responseData.resultCode == "2"){
					self.location = "/manageSystem/#/login";
                    return 0;
				}else{
					$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent(responseData.resultMsg)
					.ok('确定')
				);
				}

			}).error(function(responseData) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent(responseData.resultMsg)
					.ok('确定')
				);
			});

		};

	})

	.factory('withdrawalExamineCtrl', function($http, $mdDialog) {

		return {
			alertError: function(message) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('发生错误，错误信息如下：')
					.textContent(message)
					.ok('确定')
				);
			},
			alertInfo: function(message) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent(message)
					.ok('确定')
				);
			},
		}
	});