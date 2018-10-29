'use strict';

angular.module('myApp.update_add', ['ngRoute']).directive('fileModel', ['$parse', function($parse) {
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
		$routeProvider.when('/activity/update_add', {
			templateUrl: 'templates/activity/update_add.html',
			controller: 'update_addCtrl'
		});
	}])

	.controller('update_addCtrl', function($scope, $mdDialog,  IndexService, $location,update_addCtrlService,bannerListService,$http) {
		$scope.userAccount = {};
		$scope.value = new Date();
		 $scope.isActive = true; 
		$scope.imgnews = {};
        var app = "android";
		// 检测登录
		var userId = localStorage.userId;
		var token = localStorage.token;
		if(token == undefined) {
			alert("您尚未登录！");
			self.location = "/manageSystem/#/login";
			return 0;
		}



        $scope.setType = function (input) {
            // 设置状态
            $scope.imgnews['app'] = input;
            // if(input=="android"){
            //     $scope.saveImgnews(1);
            // }else{
            //     $scope.saveImgnews1(1);
            // }

        };


		//上传按钮
		// $scope.uploadFile = function() {
		// 	var file = $scope.myFile;
		// 	//console.dir(file);
		// 	if(file == undefined) {
		// 		$mdDialog.show(
		// 			$mdDialog.alert()
		// 			.clickOutsideToClose(true)
		// 			.title('提示')
		// 			.textContent("请上传图片")
		// 			.ok('确定')
		// 		);
		// 		return;
		// 	}
        //
        //
         //    update_addCtrlService.uploadFileToUrl1(file, token);
		// };
		// android端保存
		$scope.saveImgnews = function() {
					console.log($scope.imgnews);
			if($('#imageName').val()=='') {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent("请上传文件")
					.ok('确定')
				);
				return;
			}
            if($scope.imgnews.version == undefined) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent("请添加版本")
                        .ok('确定')
                );
                return;
            }
			if($scope.imgnews.detail == undefined) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent("请添加更新详情")
					.ok('确定')
				);
				return;
			}
            // if($scope.imgnews.url == undefined) {
            //     $mdDialog.show(
            //         $mdDialog.alert()
            //             .clickOutsideToClose(true)
            //             .title('提示')
            //             .textContent("请添加更新地址")
            //             .ok('确定')
            //     );
            //     return;
            // }
			if($scope.imgnews.forceUpdate == undefined) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent("需要强制更新的版本号，以英文逗号隔开")
					.ok('确定')
				);
				return;
			}


            if($("#myTime").val() == "") {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent("请输入更新时间")
                        .ok('确定')
                );
                return;
            }
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

			$scope.imgnews = {
				id:app,
				token: token,
				version: $scope.imgnews.version,
                forceUpdate: $scope.imgnews.forceUpdate,
				url: $scope.imgnews.url,
				detail: $scope.imgnews.detail,
			 // imgId: $scope.imgnews.imgId,
                updatedTime: $scope.imgnews.updatedTime
                // endTime: $scope.imgnews.endTime

			}
			var data = angular.copy($scope.imgnews);
			//			console.log(data);
            var str1= $("#myTime").val();
            var reg1 = /\/| |:/g;
            data.updatedTime= str1.replace(reg1,'');
            console.log($('#imageName').val());
            data.url=$('#imageName').val();
            // var str2= $("#myTime1").val();
            // var reg2 = /\/| |:/g;
            // data.endTime= str2.replace(reg2,'');
			// data.imgId = $("#imageId").val();
			// 	console.log(data);
            update_addCtrlService.saveImgnews(data);
		}

		// ios端保存
		$scope.saveImgnews1 = function() {
			// if($("#imageId").val() == "") {
			// 	$mdDialog.show(
			// 		$mdDialog.alert()
			// 		.clickOutsideToClose(true)
			// 		.title('提示')
			// 		.textContent("请添加图片")
			// 		.ok('确定')
			// 	);
			// 	return;
			// }
			if($scope.imgnews.version == undefined) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent("请添加版本")
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
            if($("#myTime1").val() == "") {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent("请输入更新时间")
                        .ok('确定')
                );
                return;
            }

            if($scope.imgnews.forceUpdate == undefined) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent("请输入需要强制更新的版本号，以英文逗号隔开")
                        .ok('确定')
                );
                return;
            }
            if($scope.imgnews.detail == undefined) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent("请输入更新详情")
                        .ok('确定')
                );
                return;
            }
			$scope.imgnews = {
				id:"iOS",
				token: token,
                version: $scope.imgnews.version,
				detail: $scope.imgnews.detail,
                forceUpdate: $scope.imgnews.forceUpdate,
				url: $scope.imgnews.url,
                updatedTime: $scope.imgnews.updatedTime
				// outSite: $scope.imgnews.outSite

			}
			var data = angular.copy($scope.imgnews);
            var str1= $("#myTime1").val();
            var reg1 = /\/| |:/g;
            data.updatedTime= str1.replace(reg1,'');
            // var str2= $("#myTime3").val();
            // var reg2 = /\/| |:/g;
            // data.endTime= str2.replace(reg2,'');
            // data.imgId = $("#imageId").val();
            // console.log(data);
			// data.imgId = $("#imageId").val();
			// 		console.log(data);
            update_addCtrlService.saveImgnews1(data);
		};

	$scope.uploadFile=function(){
        var form = new FormData();

        // form.append('token',token);
        var file = document.getElementById("fileUpload").files[0];
        // console.log(file);
        form.append('file', file);
        // form.append('scheduledTime','data.scheduledTime');
        // form.append('scheduledTime','data.scheduledTime');
        console.log(form);
        // var form = new FormData();
        // var file = document.getElementById("fileUpload").files[0];
        // form.append('file', file);


        $http.post(HOST_URL + "/update/check/upload?token="+token,form,
            // $.param(data),
            {
                transformRequest: angular.identity,
                headers: {
                    // 'Content-Type': 'application/x-www-form-urlencoded'
                    'Content-Type': undefined
                }
                // transformRequest: angular.identity
            }
        ).success(function(responseData) {
            if(responseData.resultCode == "0") {
            	console.log(responseData.resultData);
            	var url=responseData.resultData;
            	$('#imageName').val(url);


                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent("文件上传成功")
                        .ok('确定')
                )} else {
                bannerListService.alertInfo(responseData);
            }

        }).error(function(responseData) {
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('发生错误，错误信息如下：')
                    .textContent("添加失败")
                    .ok('确定')
            );
        });






	}
	})

	.factory('update_addCtrlService', function($http, $mdDialog, $location) {
		return {

			//上传图片
			// uploadFileToUrl1: function(file, token) {
			// 	var fd = new FormData();
			// 	fd.append('file', file);
			// 	$http.post(HOST_URL + "/openscreen/pic/upload?token=" + token, fd, {
			// 			transformRequest: angular.identity,
			// 			headers: {
			// 				'Content-Type': undefined
			// 			}
			// 		})
			// 		.success(function(responseData) {
			// 			if(responseData.resultCode == "0") {
			// 				// console.log(responseData)
			// 				var imgId = responseData.resultData.id;
			// 				$("#imageId").val(imgId);
			// 				console.log(imgId);
			// 			}
            //
			// 			$mdDialog.show(
			// 				$mdDialog.alert().clickOutsideToClose(true)
			// 				.title('提示')
			// 				.textContent("上传成功")
			// 				.ok('确定')
			// 			);
			// 			// $("#imageName").val(data.fileName);
			// 		});
			// },

			//保存android按钮
			saveImgnews: function(data) {
				// console.log(data);
				$http.post(HOST_URL + "/update/check/add",
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

							$location.path('/activity/update_list');
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
			//保存ios按钮
			saveImgnews1: function(data) {
				$http.post(HOST_URL + "/update/check/add",
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
								$location.path('/activity/update_list')
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