'use strict';

angular.module('myApp.openScreen_add', ['ngRoute']).directive('fileModel', ['$parse', function($parse) {
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
		$routeProvider.when('/activity/openScreen_add', {
			templateUrl: 'templates/activity/openScreen_add.html',
			controller: 'openScreen_addCtrl'
		});
	}])

	.controller('openScreen_addCtrl', function($scope, $mdDialog,  IndexService, $location,openScreen_addCtrlService) {
		$scope.userAccount = {};
		$scope.value = new Date();
		 $scope.isActive = true; 
		$scope.imgnews = {
			level:0
		};
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


			openScreen_addCtrlService.uploadFileToUrl1(file, token);
		};
		// PC端保存
		$scope.saveImgnews = function() {
			//			console.log($("#imageId").val());
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
            if($scope.imgnews.type == undefined) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent("请添加标题")
                        .ok('确定')
                );
                return;
            }
			if($scope.imgnews.type == undefined) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent("请添加分辨率")
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


            if($("#myTime").val() == "") {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent("请输入开始时间")
                        .ok('确定')
                );
                return;
            }
            if($("#myTime1").val() == "") {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent("请输入结束时间")
                        .ok('确定')
                );
                return;
            }

			$scope.imgnews = {
				app:app,
				token: token,
				type: $scope.imgnews.type,
                millisecond: $scope.imgnews.millisecond,
				url: $scope.imgnews.url,
				title: $scope.imgnews.title,
			 // imgId: $scope.imgnews.imgId,
                startTime: $scope.imgnews.startTime,
                endTime: $scope.imgnews.endTime,
                level:$scope.imgnews.level
			}
			var data = angular.copy($scope.imgnews);
			//			console.log(data);
            var str1= $("#myTime").val();
            var reg1 = /\/| |:/g;
            data.startTime= str1.replace(reg1,'');
            var str2= $("#myTime1").val();
            var reg2 = /\/| |:/g;
            data.endTime= str2.replace(reg2,'');
			data.imgId = $("#imageId").val();
				console.log(data);
			openScreen_addCtrlService.saveImgnews(data);
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
			if($scope.imgnews.type == undefined) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent("请添加分辨率")
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
            if($("#myTime2").val() == "") {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent("请输入开始时间")
                        .ok('确定')
                );
                return;
            }
            if($("#myTime3").val() == "") {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent("请输入结束时间")
                        .ok('确定')
                );
                return;
            }
            if($scope.imgnews.title == undefined) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent("请输入标题")
                        .ok('确定')
                );
                return;
            }
			$scope.imgnews = {
				app:"iOS",
				token: token,
                title: $scope.imgnews.title,
				type: $scope.imgnews.type,
                millisecond: $scope.imgnews.millisecond,
				url: $scope.imgnews.url,
				level:$scope.imgnews.level
				// status: $scope.imgnews.status,
				// outSite: $scope.imgnews.outSite

			}
			var data = angular.copy($scope.imgnews);
            var str1= $("#myTime2").val();
            var reg1 = /\/| |:/g;
            data.startTime= str1.replace(reg1,'');
            var str2= $("#myTime3").val();
            var reg2 = /\/| |:/g;
            data.endTime= str2.replace(reg2,'');
            data.imgId = $("#imageId").val();
            console.log(data);
			// data.imgId = $("#imageId").val();
			// 		console.log(data);
			openScreen_addCtrlService.saveImgnews1(data);
		}

	})

	.factory('openScreen_addCtrlService', function($http, $mdDialog, $location) {
		return {

			//上传图片
			uploadFileToUrl1: function(file, token) {
				var fd = new FormData();
				fd.append('file', file);
				$http.post(HOST_URL + "/openscreen/pic/upload?token=" + token, fd, {
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
							console.log(imgId);
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

			//保存android按钮
			saveImgnews: function(data) {
				// console.log(data);
				$http.post(HOST_URL + "/openscreen/mobile/save",
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

							$location.path('/activity/openScreen_list');
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
				$http.post(HOST_URL + "/openscreen/mobile/save",
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
								$location.path('/activity/openScreen_list')
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