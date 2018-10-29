'use strict';

angular.module('myApp.voucherCash', ['ngRoute']).directive('fileModel', ['$parse', function($parse) {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {

				var model = $parse(attrs.fileModel);
				var modelSetter = model.assign;
				element.bind('change', function() {
					scope.$apply(function() {
						modelSetter(scope, element[0].files[0]);
					});
				});
			}
		};
	}])

	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/pocket/voucherCash', {
			templateUrl: 'templates/pocket/voucherCash.html',
			controller: 'voucherCashCtrl'
		});
	}])

	.controller('voucherCashCtrl', function($scope, $mdDialog, activity_addCtrlService3, IndexService, $location) {
		$scope.userAccount = {};
		$scope.value = new Date();
		 $scope.isActive = true; 
		$scope.imgnews = {};
		// 检测登录
		var userId = localStorage.userId;
		var token = localStorage.token;
		if(token == undefined) {
			alert("您尚未登录！");
			self.location = "/manageSystem/#/login";
			return 0;
		}

		// 保存
		$scope.saveImgnews = function() {


			if($scope.imgnews.phone == undefined) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent("请添加联系方式")
					.ok('确定')
				);
				return;
			}
			if($scope.imgnews.realName == undefined) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent("请添加真实姓名")
					.ok('确定')
				);
				return;
			}
			if($scope.imgnews.money == undefined) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent("请输入金额")
					.ok('确定')
				);
				return;
			}

			$scope.imgnews = {
				token: token,
                phone: $scope.imgnews.phone,
                realName: $scope.imgnews.realName,
                money: $scope.imgnews.money

			};
            var reg = /^1[3|4|5|7|8][0-9]{9}$/;
            if( reg.test($scope.imgnews.phone)!=true){
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent("请输入正确的手机号码！")
                        .ok('确定')
                );
                return;
            }


			var data = angular.copy($scope.imgnews);
           /* data.money*=100;
            data.money=data.money.toFixed(0)*/
            data.money = parseInt(data.money *100)
            console.log(data.money)
			activity_addCtrlService3.saveImgnews(data);
		}

	})

	.factory('activity_addCtrlService3', function($http, $mdDialog, $location) {
		return {

			//保存按钮
			saveImgnews: function(data) {
				// console.log(data);
				$http.post(HOST_URL + "/sys/voucher/issue/cash",
					$.param(data), {
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					}).success(function(responseData) {
					if(responseData.resultCode == "0") {
						$mdDialog.show(
							$mdDialog.alert()
							.clickOutsideToClose(true)
							.title('提示')
							.textContent("保存成功")
							.ok('确定')
						).finally(function() {
							window.location.reload()
							//$location.path('/pocket/voucherCash');
						});
					} else {
						$mdDialog.show(
							$mdDialog.alert()
							.clickOutsideToClose(true)
							.title('提示')
							.textContent(responseData['resultMsg'])
							.ok('确定')
						);
					}

					// window.location.href="#/news/indeximg_view";
				}).error(function(responseData) {
					$mdDialog.show(
						$mdDialog.alert()
						.clickOutsideToClose(true)
						.title('提示')
						.textContent(responseData['resultMsg'])
						.ok('确定')
					);
				});
			},
			//保存app按钮
			// saveImgnews1: function(data) {
			// 	$http.post(HOST_URL + "/activity/mobile/save",
			// 			$.param(data), {
			// 				headers: {
			// 					'Content-Type': 'application/x-www-form-urlencoded'
			// 				}
			// 			}
			// 		)
			// 		.success(function(responseData) {
			// 			if(responseData.resultCode == "0") {
            //
			// 				$mdDialog.show(
			// 					$mdDialog.alert()
			// 					.clickOutsideToClose(true)
			// 					.title('提示')
			// 					.textContent("保存成功")
			// 					.ok('确定')
			// 				).finally(function() {
			// 					$location.path('/activity/activity_list')
			// 				});
			// 			} else {
			// 				$mdDialog.show(
			// 					$mdDialog.alert()
			// 					.clickOutsideToClose(true)
			// 					.title('提示')
			// 					.textContent(responseData['resultMsg'])
			// 					.ok('确定')
			// 				);
			// 			}
            //
			// 			// window.location.href="#/news/indeximg_view";
			// 		}).error(function(responseData) {
			// 			$mdDialog.show(
			// 				$mdDialog.alert()
			// 				.clickOutsideToClose(true)
			// 				.title('提示')
			// 				.textContent(responseData['resultMsg'])
			// 				.ok('确定')
			// 			);
			// 		});
			// },

		}
	});