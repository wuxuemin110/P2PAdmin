'use strict';

angular.module('myApp.activityEdit', ['ngRoute']).directive('fileModel', ['$parse', function($parse) {
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
		$routeProvider.when('/activity/activityEdit', {
			templateUrl: 'templates/activity/activityEdit.html',
			controller: 'activityEditCtrl'
		});
	}])

	.controller('activityEditCtrl', function($scope, $location, $mdDialog, indexEditService1,$filter, bannerListService) {
		$scope.tradeRecord = {};
		$scope.userAccount = {};
		$scope.path = indexEditService1.getPath();
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
		//		$scope.orgTypes = ['是','否'];
		//      $scope.viewModel = {};   //一定要先声明这个对象，否则赋值会报错
		//      $scope.viewModel.orgType = $scope.orgTypes[0];
		//上传按钮
		$scope.uploadFile = function() {
			var file = $scope.myFile;
			//console.dir(file);
			if(file == undefined) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent("请选择图片")
					.ok('确定')
				);
				return false;
			}
			indexEditService1.uploadFileToUrl(file,token);
		};
		// 获取图片新闻
		indexEditService1.synTradeRecords(token, id).success(function() {
			$scope.tradeRecord = indexEditService1.getTradeRecords();
		console.log($scope.tradeRecord);
			var status=$scope.tradeRecord.status+'';
			var outSite = $scope.tradeRecord.outSite+'';
//			if($scope.tradeRecord.status==0){
//				status="true";
//			}
//			else{
//				status="false";
//			}
			$scope.tradeRecord.outSite =outSite;
			$scope.tradeRecord.status=status;
//			console.log($scope.tradeRecord);
		});

		// 保存按钮
		$scope.edit = function() {

			var imgnews = {
				id:$scope.tradeRecord.id,
				seqNum:$scope.tradeRecord.seqNum,
				title:$scope.tradeRecord.title,
				url:$scope.tradeRecord.url,
				status:$scope.tradeRecord.status,
				outSite:$scope.tradeRecord.outSite,
				startDate:'',
				endDate:""

			};
            // imgnews.startDate=$filter('date')($scope.tradeRecord.startTime, "yyyyMMddHHmmss");
            // imgnews.endDate=$filter('date')($scope.tradeRecord.endTime, "yyyyMMddHHmmss");
            var str1= $("#myTime").val();
            var reg1 = /\/| |:/g;
            imgnews.startDate= str1.replace(reg1,'');
            var str2= $("#myTime1").val();
            var reg2 = /\/| |:/g;
            imgnews.endDate= str2.replace(reg2,'');
//			console.log($scope.tradeRecord);
//			imgnews.imagename = $("#imageName").val();
            console.log($("#imageId").val());
            imgnews.imgId=$("#imageId").val();

		console.log(imgnews);
			imgnews.token = token;
			//			 imgnews.createTime=new Date(imgnews.createTime);
			indexEditService1.edit(imgnews);
		};

	})

	.factory('indexEditService1', function($http, $location, $mdDialog,$filter, bannerListService) {
		var downloadPath = HOST_URL + "/news/img/downloadPic?fileName=";
		var tradeRecords;
		return {
			getTradeRecords: function() {
				return tradeRecords;
			},
			getPath: function() {
				return downloadPath;
			},
			//执行修改
			edit: function(imgnews) {
//				console.log(imgnews);
				$http.post(HOST_URL + "/activity/pc/save", $.param(imgnews), {
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).success(function(responseData) {
					if(responseData.resultCode == "0") {
					$mdDialog.show(
						$mdDialog.alert()
						.clickOutsideToClose(true)
						.title('提示')
						.textContent("修改成功")
						.ok('确定')
					);
					$location.url("/activity/activity_list")
					}
					else {
						bannerListService.alertInfo(responseData);
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
			},
			//上传图片

			uploadFileToUrl: function(file, token) {
				var fd = new FormData();
				fd.append('file', file);
				console.log(fd);
				$http.post(HOST_URL + "/activity/pic/upload?token=" + token, fd, {
						transformRequest: angular.identity,
						headers: {
							'Content-Type': undefined
						}
					})
					.success(function(responseData) {
						if(responseData.resultCode == "0") {
							// console.log(responseData)
							var dataId = responseData.resultData.id;
							$("#imageId").val(dataId);
							console.log($("#imageId").val());
							$mdDialog.show(
							$mdDialog.alert().clickOutsideToClose(true)
							.title('提示')
							.textContent("上传成功")
							.ok('确定')
						);
						}
						else {
						bannerListService.alertInfo(responseData);
					}

						
						// $("#imageName").val(data.fileName);
					});
			},

			// 同步 TradeRecords
			synTradeRecords: function(token, id) {
				var tokenData = {
					"token": token
				};
				return $http.get(HOST_URL + "/activity/" + id,

					{params:tokenData}, {
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					}
				).success(function(responseData) {
//					console.log(responseData);
					if(responseData.resultCode == "0") {
						tradeRecords = responseData.resultData;
						console.log(tradeRecords);
                        // var startTime = $scope.plan_edit.startTime + "";
                      tradeRecords.startTime = $filter("newDate")(tradeRecords.startTime, "yyyy/MM/dd HH:mm:ss");
                        tradeRecords.endTime = $filter("newDate")(tradeRecords.endTime, "yyyy/MM/dd HH:mm:ss");
                        // $scope.startTime = startTime;
					} else {
						bannerListService.alertInfo(responseData);
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
			}
		}
	});