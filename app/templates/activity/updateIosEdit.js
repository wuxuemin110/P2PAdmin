
angular.module('myApp.updateIosEdit', ['ngRoute']).directive('fileModel', ['$parse', function($parse) {
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
		$routeProvider.when('/activity/updateIosEdit', {
			templateUrl: 'templates/activity/updateIosEdit.html',
			controller: 'updateIosEditCtrl'
		});
	}])

	.controller('updateIosEditCtrl', function($scope, $location, $mdDialog, $filter,updateIos, bannerListService) {
		$scope.tradeRecord = {};
		$scope.userAccount = {};
		$scope.path = updateIos.getPath();
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
            updateIos.uploadFileToUrl(file,token);
		};
		// 获取图片新闻
        updateIos.synTradeRecords(token, id).success(function() {
			$scope.tradeRecord = updateIos.getTradeRecords();
			console.log(id )
            // $scope.tradeRecord.type = $scope.tradeRecord.type + '';
			// var status=$scope.tradeRecord.status+'';
			// var outSite = $scope.tradeRecord.outSite+'';
//			if($scope.tradeRecord.status==0){
//				status="true";
//			}
//			else{
//				status="false";
//			}
// 			$scope.tradeRecord.outSite =outSite;
// 			$scope.tradeRecord.status=status;
//			console.log($scope.tradeRecord);
		});

		// 保存按钮
		$scope.edit = function() {

			var imgnews = {
				// id:$scope.tradeRecord.id,
				// imgId:$scope.tradeRecord.imgId,
				// app:$scope.tradeRecord.app,
				version:$scope.tradeRecord.version,
                forceUpdate:$scope.tradeRecord.forceUpdate,
				url:$scope.tradeRecord.url,
                detail:$scope.tradeRecord.detail
				// outSite:$scope.tradeRecord.outSite
				
			};
			// console.log($scope.tradeRecord.id);

			 imgnews.id="iOS";
            var str1= $("#myTime").val();
            var reg1 = /\/| |:/g;
            imgnews.updatedTime= str1.replace(reg1,'');
            // var str2= $("#myTime1").val();
            // var reg2 = /\/| |:/g;
            // imgnews.endTime= str2.replace(reg2,'');
            // if($("#imageId").val()==''){
            //     imgnews.imgId=$scope.tradeRecord.imgId;
            // }else{
            //     imgnews.imgId=$("#imageId").val();
            // }
            // imgnews.imgId=$("#imageId").val();
		// console.log(imgnews);
			imgnews.token = token;
			//			 imgnews.createTime=new Date(imgnews.createTime);
            updateIos.edit(imgnews);
		};

	})

	.factory('updateIos', function($http, $location, $mdDialog, $filter,bannerListService) {
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
				$http.post(HOST_URL + "/update/check/update", $.param(imgnews), {
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
                        $location.url("/activity/update_list")
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
// 			//上传图片
// 			uploadFileToUrl: function(file, token) {
// 				var fd = new FormData();
// 				fd.append('file', file);
// 				$http.post(HOST_URL + "/openscreen/pic/upload?token=" + token, fd, {
// 						transformRequest: angular.identity,
// 						headers: {
// 							'Content-Type': undefined
// 						}
// 					})
// 					.success(function(responseData) {
// 						if(responseData.resultCode == "0") {
// //							console.log(responseData)
// 							var dataId = responseData.resultData.id;
// 							$("#imageId").val(dataId);
// 							console.log($("#imageId").val());
// 							$mdDialog.show(
// 							$mdDialog.alert().clickOutsideToClose(true)
// 							.title('提示')
// 							.textContent("上传成功")
// 							.ok('确定')
// 						);
// 						}
// 						else {
// 						bannerListService.alertInfo(responseData);
// 					}
//
//
// 						// $("#imageName").val(data.fileName);
// 					});
// 			},

			// 同步 TradeRecords
			synTradeRecords: function(token, id) {
				var tokenData = {
					"token": token,

				};
				return $http.get(HOST_URL + "/update/check/query/"+id,

					{params:tokenData}, {
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					}
				).success(function(responseData) {
//					console.log(responseData);
					if(responseData.resultCode == "0") {
						tradeRecords = responseData.resultData;
                        tradeRecords.updatedTime = $filter("newDate")(tradeRecords.updatedTime, "yyyy/MM/dd HH:mm:ss");
                        // tradeRecords.endTime = $filter("newDate")(tradeRecords.endTime, "yyyy/MM/dd HH:mm:ss");
                        console.log(tradeRecords);
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