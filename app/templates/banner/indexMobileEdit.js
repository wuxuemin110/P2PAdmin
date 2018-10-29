
angular.module('myApp.indexMobileEdit', ['ngRoute']).directive('fileModel', ['$parse', function($parse) {
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
		$routeProvider.when('/banner/indexMobileEdit', {
			templateUrl: 'templates/banner/indexMobileEdit.html',
			controller: 'indexMobileEditCtrl'
		});
	}])

	.controller('indexMobileEditCtrl', function($scope, $location, $mdDialog, indexMobileEditService, bannerListService) {
		$scope.tradeRecord = {};
		$scope.userAccount = {};
		$scope.path = indexMobileEditService.getPath();
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
			indexMobileEditService.uploadFileToUrl(file,token);
		};
		// 获取图片新闻
		indexMobileEditService.synTradeRecords(token, id).success(function() {
			$scope.tradeRecord = indexMobileEditService.getTradeRecords();
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
				outSite:$scope.tradeRecord.outSite
				
			};
            imgnews.imgId=$("#imageId").val();
//			console.log(imgnews);
			imgnews.token = token;
			//			 imgnews.createTime=new Date(imgnews.createTime);
			indexMobileEditService.edit(imgnews);
		};

	})

	.factory('indexMobileEditService', function($http, $location, $mdDialog, bannerListService) {
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
				$http.post(HOST_URL + "/banner/mobile/save", $.param(imgnews), {
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
					$location.url("/banner/banner_list?inex="+2)
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
				$http.post(HOST_URL + "/banner/file/upload?token=" + token, fd, {
						transformRequest: angular.identity,
						headers: {
							'Content-Type': undefined
						}
					})
					.success(function(responseData) {
						if(responseData.resultCode == "0") {
//							console.log(responseData)
							var dataId = responseData.resultData.id;
							$("#imageId").val(dataId);
							
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
					"token": token,
				};
				return $http.post(HOST_URL + "/banner/" + id,

					$.param(tokenData), {
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					}
				).success(function(responseData) {
//					console.log(responseData);
					if(responseData.resultCode == "0") {
						tradeRecords = responseData.resultData;
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