'use strict';

angular.module('myApp.partners_add', ['ngRoute']).directive('fileModel', ['$parse', function($parse) {
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
		$routeProvider.when('/activity/partners_add', {
			templateUrl: 'templates/activity/partners_add.html',
			controller: 'partners_addCtrl'
		});
	}])

	.controller('partners_addCtrl', function($scope, $mdDialog, partners_addCtrlService, IndexService, $location) {
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
			//console.dir(file);
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


			partners_addCtrlService.uploadFileToUrl1(file, token);
		};
		// PC端保存
		$scope.saveImgnews = function() {
			//			console.log($("#imageId").val());
			if($("#picUrl").val()== "") {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent("请添加图片")
					.ok('确定')
				);
				return;
			}

			if($scope.imgnews.name == undefined) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent("请添加标题")
					.ok('确定')
				);
				return;
			}
			// if($scope.imgnews.url == undefined) {
			// 	$mdDialog.show(
			// 		$mdDialog.alert()
			// 		.clickOutsideToClose(true)
			// 		.title('提示')
			// 		.textContent("请添加访问地址")
			// 		.ok('确定')
			// 	);
			// 	return;
			// }
			if($scope.imgnews.orderNum == undefined) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent("请输入排序")
					.ok('确定')
				);
				return;
			}

            // if($("#myTime").val() == "") {
            //     $mdDialog.show(
            //         $mdDialog.alert()
            //             .clickOutsideToClose(true)
            //             .title('提示')
            //             .textContent("请输入开始时间")
            //             .ok('确定')
            //     );
            //     return;
            // }
            // if($("#myTime1").val() == "") {
            //     $mdDialog.show(
            //         $mdDialog.alert()
            //             .clickOutsideToClose(true)
            //             .title('提示')
            //             .textContent("请输入结束时间")
            //             .ok('确定')
            //     );
            //     return;
            // }
			if($scope.imgnews.website == undefined) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent("请输入跳转的页面")
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
                orderNum: $scope.imgnews.orderNum,
                name: $scope.imgnews.name,
				// url: $scope.imgnews.url,
				status: $scope.imgnews.status,
                website: $scope.imgnews.website
                // startDate: $scope.imgnews.startDate,
                // endDate: $scope.imgnews.endDate

			}
			var data = angular.copy($scope.imgnews);
			//			console.log(data);
            // var str1= $("#myTime").val();
            // var reg1 = /\/| |:/g;
            // data.startDate= str1.replace(reg1,'');
            // var str2= $("#myTime1").val();
            // var reg2 = /\/| |:/g;
            // data.endDate= str2.replace(reg2,'');
            data.url = $("#picUrl").val();
				console.log(data);
            partners_addCtrlService.saveImgnews(data);
		}

		// 手机端保存
		// $scope.saveImgnews1 = function() {
		// 	if($("#imageId").val() == "") {
		// 		$mdDialog.show(
		// 			$mdDialog.alert()
		// 			.clickOutsideToClose(true)
		// 			.title('提示')
		// 			.textContent("请添加图片")
		// 			.ok('确定')
		// 		);
		// 		return;
		// 	}
		// 	if($scope.imgnews.title == undefined) {
		// 		$mdDialog.show(
		// 			$mdDialog.alert()
		// 			.clickOutsideToClose(true)
		// 			.title('提示')
		// 			.textContent("请添加标题")
		// 			.ok('确定')
		// 		);
		// 		return;
		// 	}
		// 	if($scope.imgnews.url == undefined) {
		// 		$mdDialog.show(
		// 			$mdDialog.alert()
		// 			.clickOutsideToClose(true)
		// 			.title('提示')
		// 			.textContent("请添加访问地址")
		// 			.ok('确定')
		// 		);
		// 		return;
		// 	}
		// 	if($scope.imgnews.outSite == undefined) {
		// 		$mdDialog.show(
		// 			$mdDialog.alert()
		// 			.clickOutsideToClose(true)
		// 			.title('提示')
		// 			.textContent("请选择是否在新页面打开")
		// 			.ok('确定')
		// 		);
		// 		return;
		// 	}
		// 	if($scope.imgnews.seqNum == undefined) {
		// 		$mdDialog.show(
		// 			$mdDialog.alert()
		// 			.clickOutsideToClose(true)
		// 			.title('提示')
		// 			.textContent("请输入排序")
		// 			.ok('确定')
		// 		);
		// 		return;
		// 	}
         //    if($("#myTime2").val() == "") {
         //        $mdDialog.show(
         //            $mdDialog.alert()
         //                .clickOutsideToClose(true)
         //                .title('提示')
         //                .textContent("请输入开始时间")
         //                .ok('确定')
         //        );
         //        return;
         //    }
         //    if($("#myTime3").val() == "") {
         //        $mdDialog.show(
         //            $mdDialog.alert()
         //                .clickOutsideToClose(true)
         //                .title('提示')
         //                .textContent("请输入结束时间")
         //                .ok('确定')
         //        );
         //        return;
         //    }
		// 	if($scope.imgnews.status == undefined) {
		// 		$mdDialog.show(
		// 			$mdDialog.alert()
		// 			.clickOutsideToClose(true)
		// 			.title('提示')
		// 			.textContent("请选择状态")
		// 			.ok('确定')
		// 		);
		// 		return;
		// 	}
		// 	// var imgnews = $scope.imgnews.imagename;
		// 	// if(imgnews==undefined){
		// 	//     console.log($("#imageId").val())
		// 	//     $mdDialog.show(
		// 	//         $mdDialog.alert()
		// 	//             .clickOutsideToClose(true)
		// 	//             .title('提示')
		// 	//             .textContent("图片未上传")
		// 	//             .ok('确定')
		// 	//     );
		// 	//     return ;
		// 	// }
		// 	$scope.imgnews = {
		// 		token: token,
		// 		seqNum: $scope.imgnews.seqNum,
		// 		title: $scope.imgnews.title,
		// 		url: $scope.imgnews.url,
		// 		status: $scope.imgnews.status,
		// 		outSite: $scope.imgnews.outSite
        //
		// 	}
		// 	var data = angular.copy($scope.imgnews);
         //    var str1= $("#myTime2").val();
         //    var reg1 = /\/| |:/g;
         //    data.startDate= str1.replace(reg1,'');
         //    var str2= $("#myTime3").val();
         //    var reg2 = /\/| |:/g;
         //    data.endDate= str2.replace(reg2,'');
         //    data.imgId = $("#imageId").val();
         //    console.log(data);
		// 	// data.imgId = $("#imageId").val();
		// 	// 		console.log(data);
		// 	activity_addCtrlService.saveImgnews1(data);
		// }

	})

	.factory('partners_addCtrlService', function($http, $mdDialog, $location) {
		return {

			//上传图片
			uploadFileToUrl1: function(file, token) {
				var fd = new FormData();
				fd.append('file', file);
				$http.post(HOST_URL + "/partners/pic/upload?token=" + token, fd, {
						transformRequest: angular.identity,
						headers: {
							'Content-Type': undefined
						}
					})
					.success(function(responseData) {
						if(responseData.resultCode == "0") {
							// console.log(responseData)
							var url = responseData.resultData;
							$("#picUrl").val(url);
							// console.log(url);
						}

						$mdDialog.show(
							$mdDialog.alert().clickOutsideToClose(true)
							.title('提示')
							.textContent("上传成功")
							.ok('确定')
						);
						// $("#imageName").val(data.fileName);
					});
			},

			//保存按钮
			saveImgnews: function(data) {
				// console.log(data);
				$http.post(HOST_URL + "/partners/save",
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

							$location.path('/activity/partners_list');
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
			}
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