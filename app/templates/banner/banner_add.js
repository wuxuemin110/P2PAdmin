'use strict';

angular.module('myApp.banner_add', ['ngRoute']).directive('fileModel', ['$parse', function($parse) {
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
		$routeProvider.when('/banner/banner_add', {
			templateUrl: 'templates/banner/banner_add.html',
			controller: 'banner_addCtrl'
		});
	}])

	.controller('banner_addCtrl', function($scope, $mdDialog, banner_addCtrlService, IndexService, $location) {
		$scope.userAccount = {};
		$scope.value = new Date();
		 $scope.isActive = true; 
		$scope.imgnews = {}
		// 检测登录
		var userId = localStorage.userId;
		var token = localStorage.token;
		if(token == undefined) {
			alert("您尚未登录！");
			self.location = "/manageSystem/#/login";
			return 0;
		}
		//保存按钮

		//上传按钮
		$scope.uploadFile = function() {
			var file = $scope.myFile;
			console.dir(file);
			if(file == undefined) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent("请上传图片")
					.ok('确定')
				);
				return;
			}


			banner_addCtrlService.uploadFileToUrl(file, token);
		};
		// PC端保存
		$scope.saveImgnews = function() {
					console.log($("#imageId").val());
			if($("#imageId").val() == "") {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent("请添加图片")
					.ok('确定')
				);
				return;
			}

			if($scope.imgnews.title == undefined) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent("请添加标题")
					.ok('确定')
				);
				return;
			}
			if($scope.imgnews.url == undefined) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent("请添加访问地址")
					.ok('确定')
				);
				return;
			}
			if($scope.imgnews.seqNum == undefined) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent("请输入排序")
					.ok('确定')
				);
				return;
			}
			if($scope.imgnews.outSite == undefined) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent("请选择是否在新页面打开")
					.ok('确定')
				);
				return;
			}

			if($scope.imgnews.status == undefined) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent("请选择状态")
					.ok('确定')
				);
				return;
			}
			// var imgnews = $scope.imgnews.imagename;
			// if(imgnews==undefined){
			//     console.log($("#imageId").val())
			//     $mdDialog.show(
			//         $mdDialog.alert()
			//             .clickOutsideToClose(true)
			//             .title('提示')
			//             .textContent("图片未上传")
			//             .ok('确定')
			//     );
			//     return ;
			// }
			// var imgnews = $scope.imgnews.imagename;
			// if($("#imageName").val()==""){
			//
			// 	$mdDialog.show(
			//        $mdDialog.alert()
			//            .clickOutsideToClose(true)
			//             .title('提示')
			//             .textContent("图片未上传")
			//           .ok('确定')
			//    );
			// 	return false;
			// }
			// $scope.imgnews
			// // if(!imgnews){
			// // 	$mdDialog.show(
			// //        $mdDialog.alert()
			// //            .clickOutsideToClose(true)
			// //             .title('提示')
			// //             .textContent("请输入链接路径！")
			// //           .ok('确定')
			// //    );
			// // 	return;
			// // }
			// $scope.imgnews.imagename=$("#imageName").val();
			// $scope.imgnews.title=$("#exampleInput").val();
			$scope.imgnews = {
				token: token,
				seqNum: $scope.imgnews.seqNum,
				title: $scope.imgnews.title,
				url: $scope.imgnews.url,
				status: $scope.imgnews.status,
				outSite: $scope.imgnews.outSite,

			}
			var data = angular.copy($scope.imgnews);
			//			console.log(data);
			data.imgId = $("#imageId").val();
			//			console.log(data);
			banner_addCtrlService.saveImgnews(data);
		}

		// 手机端保存
		$scope.saveImgnews1 = function() {
			if($("#imageId").val() == "") {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent("请添加图片")
					.ok('确定')
				);
				return;
			}
			if($scope.imgnews.title == undefined) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent("请添加标题")
					.ok('确定')
				);
				return;
			}
			if($scope.imgnews.url == undefined) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent("请添加访问地址")
					.ok('确定')
				);
				return;
			}
			if($scope.imgnews.outSite == undefined) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent("请选择是否在新页面打开")
					.ok('确定')
				);
				return;
			}
			if($scope.imgnews.seqNum == undefined) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent("请输入排序")
					.ok('确定')
				);
				return;
			}
			if($scope.imgnews.status == undefined) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent("请选择状态")
					.ok('确定')
				);
				return;
			}
			// var imgnews = $scope.imgnews.imagename;
			// if(imgnews==undefined){
			//     console.log($("#imageId").val())
			//     $mdDialog.show(
			//         $mdDialog.alert()
			//             .clickOutsideToClose(true)
			//             .title('提示')
			//             .textContent("图片未上传")
			//             .ok('确定')
			//     );
			//     return ;
			// }
			$scope.imgnews = {
				token: token,
				seqNum: $scope.imgnews.seqNum,
				title: $scope.imgnews.title,
				url: $scope.imgnews.url,
				status: $scope.imgnews.status,
				outSite: $scope.imgnews.outSite,

			}
			var data = angular.copy($scope.imgnews);
			data.imgId = $("#imageId").val();
			//			console.log(data);
			banner_addCtrlService.saveImgnews1(data);
		}

	})

	.factory('banner_addCtrlService', function($http, $mdDialog, $location) {
		return {

			//上传图片
			uploadFileToUrl: function(file, token) {
				var fd = new FormData();
				fd.append('file', file);
				$http.post(HOST_URL + "/banner/file/upload?token=" + token, fd, {
						transformRequest: angular.identity,
						headers: {
							'Content-Type': undefined
						}
					})
					.success(function(responseData) {
						if(responseData.resultCode == "0") {
							// console.log(responseData)
							var imgId = responseData.resultData.id;
							$("#imageId").val(imgId);
							// console.log(imgId);
                            $mdDialog.show(
                                $mdDialog.alert().clickOutsideToClose(true)
                                    .title('提示')
                                    .textContent(responseData['resultMsg'])
                                    .ok('确定')
                            );
						}else{
                            $mdDialog.show(
                                $mdDialog.alert().clickOutsideToClose(true)
                                    .title('提示')
                                    .textContent(responseData['resultMsg'])
                                    .ok('确定')
                            );
						}


						// $("#imageName").val(data.fileName);
					});
			},

			//保存PC按钮
			saveImgnews: function(data) {
				// console.log(data);
				$http.post(HOST_URL + "/banner/pc/save",
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

							$location.path('/banner/banner_list');
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
			saveImgnews1: function(data) {
				$http.post(HOST_URL + "/banner/mobile/save",
						$.param(data), {
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded'
							}
						}
					)
					.success(function(responseData) {
						if(responseData.resultCode == "0") {

							$mdDialog.show(
								$mdDialog.alert()
								.clickOutsideToClose(true)
								.title('提示')
								.textContent("保存成功")
								.ok('确定')
							).finally(function() {
								$location.path('/banner/banner_list')
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

		}
	});