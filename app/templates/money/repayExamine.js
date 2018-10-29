'use strict';

angular.module('myApp.repayExamine', ['ngRoute'])

	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/money/repayExamine/:id', {
			templateUrl: 'templates/money/repayExamine.html',
			controller: 'repayExamineCtrl'
		});
	}])

	.controller('repayExamineCtrl', function($http, $filter, $mdDialog, $scope, $rootScope, $routeParams, bannerListService) {

		$scope.repayData = {};
		//      $scope.planCarLoan = {};
		//      $scope.carLoan = {};
		// 检测登录
		var userId = localStorage.userId;
		var token = localStorage.token;
	$scope.repayData={
		token:token,
		managerId:userId
	}
	var data=angular.copy($scope.repayData)
		if(token == undefined) {
			alert("您尚未登录！");
			self.location = "/manageSystem/#/login";
		}
		//   $scope.getWithdrawData = function () {
		$http.get(HOST_URL + "/invest/repay/details/" + $routeParams.id,{
                    	params:data
                    },{
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }
		).success(function(responseData) {
			if(responseData.resultCode == "0") {
				$scope.repayData = responseData.resultData;
				// console.log($scope.repayData.corpus);
				 $scope.repayData.total=$scope.repayData.corpus+$scope.repayData.interest+$scope.repayData.raisingInterest;
			// 	 console.log($scope.total);
			// console.log($("#totalMoney").val())	;
                // $("#totalMoney").val()=$scope.total;
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
		//还款
		$scope.examineSuccess = function() {
            // tokenData.remark=$scope.withdrawData.remark;
			$http.post(HOST_URL + "/invest/repay/" + $routeParams.id + "/recheck",
                    	$.param(data)
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
                            .textContent(responseData['resultMsg'])
                            .ok('确定')
                    );
					 self.location = "/manageSystem/#/investor/repay_list";
				}
				else {
                    bannerListService.alertInfo(responseData);
				}


			}).error(function(responseData) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent(responseData['resultMsg'])
					.ok('确定')
				);
			});

		};

		//审核失败
		// $scope.examineFail = function() {
         //    tokenData.remark=$scope.withdrawData.remark;
		// 	$http.post(HOST_URL + "/user/withdraw/" + $routeParams.id + "/fail",
         //            	$.param(tokenData)
		// 	,{
         //                headers: {
         //                    'Content-Type': 'application/x-www-form-urlencoded'
         //                }
         //            }
        //
		// 	).success(function(responseData) {
		// 		if(responseData.resultCode == "0") {
		// 			$mdDialog.show(
		// 			$mdDialog.alert()
		// 			.clickOutsideToClose(true)
		// 			.title('提示')
		// 			.textContent("提交成功")
		// 			.ok('确定')
		// 		).finally(function() {
		// 			self.location = "/#/money/investor_cash";
		// 		  });
		//
		// 		}
		// 		else if(responseData.resultCode == "2"){
		// 			self.location = "/#/login";
         //            return 0;
		// 		}
		// 	}).error(function(responseData) {
		// 		$mdDialog.show(
		// 			$mdDialog.alert()
		// 			.clickOutsideToClose(true)
		// 			.title('提示')
		// 			.textContent(responseData.resultMsg)
		// 			.ok('确定')
		// 		);
		// 	});
        //
		// };

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