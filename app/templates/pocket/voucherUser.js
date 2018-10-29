'use strict';

angular.module('myApp.voucherUser', ['ngRoute']).directive('fileModel', ['$parse', function($parse) {
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
		$routeProvider.when('/pocket/voucherUser', {
			templateUrl: 'templates/pocket/voucherUser.html',
			controller: 'voucherUserCtrl'
		});
	}])

	.controller('voucherUserCtrl', function($scope, $mdDialog, activity_addCtrlService2, IndexService, $location) {
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

		// 保存按钮
		$scope.saveImgnews = function() {
            // 判断手机号
            if($scope.imgnews.phones== undefined) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent("请添加手机号码")
                        .ok('确定')
                );
                return;
            }
            var data1=$scope.imgnews.phones.replace(/[\r\n]/g,",").split(",");
        console.log(data1);

            for(var i=0;i<data1.length;i++){
            	// console.log(data1[i]);
                var reg = /^1[3|4|5|7|8][0-9]{9}$/;
                if( reg.test(data1[i])!=true){
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent("请输入正确的手机号码！")
                            .ok('确定')
                    );
                    return;
                }
			}

            var dataa =JSON.stringify(data1).replace(/\[|]|"/g,"");
            console.log(dataa);
            if($scope.imgnews.type == undefined) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent("请添加红包类型")
                        .ok('确定')
                );
                return;
            }
			if($scope.imgnews.itemType == undefined) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent("请添加券类型")
					.ok('确定')
				);
				return;
			}
			if($scope.imgnews.value == undefined) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent("请输入券值")
					.ok('确定')
				);
				return;
			}
            if($scope.imgnews.name == undefined) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent("请输入券名称")
                        .ok('确定')
                );
                return;
            }
            if($scope.imgnews.restricta == undefined) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent("请输入使用条件(天)")
                        .ok('确定')
                );
                return;
            }

            if($scope.imgnews.condition == undefined) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent("请输入使用条件(金额)")
                        .ok('确定')
                );
                return;
            }
            if($("#myTime").val() == "") {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent("请输入生效时间")
                        .ok('确定')
                );
                return;
            }
            if($("#myTime1").val() == "") {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent("请输入失效时间")
                        .ok('确定')
                );
                return;
            }

		var imgnews = {
				token: token,
                phones: dataa,
                type: $scope.imgnews.type,
			    itemType: $scope.imgnews.itemType,
                value:$scope.imgnews.value,
                name: $scope.imgnews.name,
                condition: $scope.imgnews.condition,
                restricta: $scope.imgnews.restricta,
                beginTime: $scope.imgnews.beginTime,
                endTime: $scope.imgnews.endTime

			};

			var data = angular.copy(imgnews);
            if( $scope.imgnews.type==0){
                data.value*=100;
            }else{
                data.value *=10;
            }
            data.condition *=100;
			//			console.log(data);
            var str1= $("#myTime").val();
            var reg1 = /\/| |:/g;
            data.beginTime= str1.replace(reg1,'');
            var str2= $("#myTime1").val();
            var reg2 = /\/| |:/g;
            data.endTime= str2.replace(reg2,'');








			activity_addCtrlService2.saveImgnews(data);
		}


	})

	.factory('activity_addCtrlService2', function($http, $mdDialog, $location) {
		return {

			//保存PC按钮
			saveImgnews: function(data) {
				console.log(data);
				$http.post(HOST_URL + "/sys/voucher/issue",
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
							.textContent(responseData['resultMsg'])
							.ok('确定')
						).finally(function() {

							$location.path('/pocket/voucherUser');
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
			// //保存app按钮
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
			// }

		}
	});