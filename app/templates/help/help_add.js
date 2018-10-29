'use strict';

angular.module('myApp.help_add', ['ngRoute']).directive('fileModel', ['$parse', function($parse) {
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
		$routeProvider.when('/help/help_add', {
			templateUrl: 'templates/help/help_add.html',
			controller: 'help_addCtrl'
		});
	}])
	.controller('help_addCtrl', function($scope, $location, IndexService, $http, $routeParams, $mdDialog,  bannerListService,news_editService) {
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
		$scope.tradeRecord = {};
		$scope.userAccount = {};
		$scope.notice = {
			title: '',
			subtitle: '',
			keywords: '',
			level: '',
		}

		// 保存按钮

		$scope.edit1 = function() {

			var notice = $scope.notice;
			

			if(notice.title == "") {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent("请添加标题")
					.ok('确定')
				);
				return;
			}
			if(notice.subtitle == "") {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent("请添加子标题")
					.ok('确定')
				);
				return;
			}

			if(notice.level == "") {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent("请添加排序")
					.ok('确定')
				);
				return;
			}

			if(notice.keywords == "") {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent("请添加关键字")
					.ok('确定')
				);
				return;
			}

			// if(um.getContent() != null && um.getContent().trim() != "") {
             //    notice.content = um.getContent();
			// } else {
             //    notice.content = "";
			// }
			if(notice.content == "") {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent("请添加内容")
					.ok('确定')
				);
				return;
			}
			$scope.cashData = {
				token: token,
				title: notice.title,
				subtitle: notice.subtitle,
				keywords: notice.keywords,
				level: notice.level,
				// id:$routeParams.id,
				content: notice.content
			}
			var data = angular.copy($scope.cashData)
			// data.imgId = $("#imageName").val();
			//          console.log(data)
			$http.post(HOST_URL + "/help/save",
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
						$location.path('/help/help_view');
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

	// .factory('Indeximg_addService2', function($http, $mdDialog, ) {
	// 	return {
    //
	// 	}
	// });