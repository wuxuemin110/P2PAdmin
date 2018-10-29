'use strict';

angular.module('myApp.offline', ['ngRoute']).directive('fileModel', ['$parse', function($parse) {
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
		$routeProvider.when('/money/offline', {
			templateUrl: 'templates/money/offline.html',
			controller: 'offlineCtrl'
		});
	}])
	.controller('offlineCtrl', function($scope, $location, IndexService, $http, $routeParams, $mdDialog,  bannerListService) {
		var id = 0;
		if($location.url() != null) {
			id = $location.url().split("=")[1];
		}
		// 检测登录
		var userId = localStorage.userId;
		var token = localStorage.token;
		if(token == undefined) {
			alert("您尚未登录！");
			self.location = "/manageSystem/#/login";
			return 0;
		}
		// $scope.tradeRecord = {};
		$scope.userAccount = {};
		$scope.offline = {
			token:token,
			name: '',
			phone: '',
			money: '',

		}

		// 保存按钮

		$scope.edit1 = function() {

			var offline = $scope.offline;
			

			if(offline.name == "") {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent("请添加姓名")
					.ok('确定')
				);
				return;
			}
			if(offline.money == "") {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent("请添加金额")
					.ok('确定')
				);
				return;
			}

			if(offline.phone == "") {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent("请添加手机号码")
					.ok('确定')
				);
				return;
			}
            //
			// $scope.cashData = {
			// 	token: token,
			// 	title: notice.title,
			// 	subtitle: notice.subtitle,
			// 	keywords: notice.keywords,
			// 	level: notice.level,
			// 	// id:$routeParams.id,
			// 	content: notice.content
			// }
            // $scope.offline.money*=100;
			var data = angular.copy($scope.offline)
			data.money = parseInt(data.money *100)
			console.log(data.money)
			$http.post(HOST_URL + "/user/recharge/offline",
				$.param(data), {
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).success(function(responseData) {
				if(responseData.resultCode == "0") {

					$mdDialog.show(
						$mdDialog.alert().clickOutsideToClose(true)
						.title('提示')
						.textContent(responseData['resultMsg'])
						.ok('确定')
					).finally(function() {
						$location.path('/money/recharge_list');
					});
				} else {
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

		}

	})

	// .factory('Indeximg_addService2', function($http, $mdDialog, bannerListService) {
	// 	return {
    //
	// 	}
	// });