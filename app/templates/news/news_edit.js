'use strict';

angular.module('myApp.news_edit', ['ngRoute']).directive('fileModel', ['$parse', function($parse) {
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
		$routeProvider.when('/news/news_edit', {
			templateUrl: 'templates/news/news_edit.html',
			controller: 'news_editCtrl'
		});
	}])
	.controller('news_editCtrl', function($scope, $location, IndexService, $http, $routeParams, $mdDialog, bannerListService, news_editService) {
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

		//编辑按钮
		// $scope.edit = function(){
		// 	var news = $scope.news;
		// 	news.coverImage=$("#imageName").val();//把图片塞进来
		// 	news.createdTime=$("#exampleInput").val();
		// 	//这里需要转型，不然400错误
		// 	news.supmemu=parseInt($scope.news.supmemu);
		// 	news.content=um.getContent();//设置内容
		// 	//console.dir(news);
		// 	news_editService.edit(news,userId,token);
		// };

		// 获取新闻
		var tokenData = {
			token: token
		}
		news_editService.getNewsByid(tokenData, $routeParams.id).success(function() {
			$scope.news = news_editService.getNews();
			um.addListener("ready", function() {
				um.setContent($scope.news.content); //设置内容
			})
		});
		// 获取新闻详情
		//      $scope.cashData={
		//          token:token
		//      }
		//      var data=angular.copy($scope.cashData);
		//      $scope.newsDetail=function(){
		//          $http.get(HOST_URL + "/news/"+ $routeParams.id,
		//              {
		//                  params:data
		//              },
		//              {
		//                  headers: {
		//                      'Content-Type': 'application/x-www-form-urlencoded'
		//                  }
		//              }).success(function (responseData) {
		//                  if(responseData.resultCode=="0"){
		//                          $scope.news=responseData.resultData;
		//                          console.log($scope.news);
		//                          um.setContent($scope.news.content);
		//
		//                  }
		//                  else {
		//						bannerListService.alertInfo(responseData);
		//					}
		//
		//          })
		//      }
		//      $scope.newsDetail();
		// 上传图片
		$scope.uploadFile = function() {
			var file = $scope.myFile;
			//console.dir(file);
			if(file == undefined||file ==null) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent("请上传图片")
					.ok('确定')
				);
				return false;
			}
            //上传图片
                var fd = new FormData();
                fd.append('file', file);
                $http.post(HOST_URL + "/news/file/upload?token=" + token, fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                }).success(function(responseData) {
                    if(responseData.resultCode == "0") {
                        //						console.log(responseData)
                        var imgId = responseData.resultData.id;
                        $("#imageId").val(imgId);

                        $mdDialog.show(
                            $mdDialog.alert().clickOutsideToClose(true)
                                .title('提示')
                                .textContent("上传成功")
                                .ok('确定')
                        );
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

            // news_editService.uploadFileToUrl1(file, token);
            // console.log(file,token);
		};
		// 保存按钮

		$scope.edit = function() {
			var news = $scope.news;

			if(news.title == "") {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent("请添加标题")
					.ok('确定')
				);
				return;
			}
			if(news.subTitle == "") {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent("请添加子标题")
					.ok('确定')
				);
				return;
			}
			if($("#imageName").val() == "") {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent("请添加图片")
					.ok('确定')
				);
				return;
			}
			if(news.level == "") {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent("请添加排序")
					.ok('确定')
				);
				return;
			}

			if(news.keywords == "") {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent("请添加关键字")
					.ok('确定')
				);
				return;
			}

			if(um.getContent() != null && um.getContent().trim() != "") {
				news.content = um.getContent();
			} else {
				news.content = "";
			}
			if(news.content == "") {
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
				title: news.title,
				subTitle: news.subTitle,
				keywords: news.keywords,
				level: news.level,
				id: $routeParams.id,
				content: news.content
			}
			var data = angular.copy($scope.cashData)
			data.imgId = $("#imageId").val();
			// console.log(data)
			$http.post(HOST_URL + "/news/save",
				$.param(data), {
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).success(function(responseData) {
				if(responseData.resultCode == "0") {
					// console.log(responseData)
					$mdDialog.show(
						$mdDialog.alert().clickOutsideToClose(true)
						.title('提示')
						.textContent(responseData['resultMsg'])
						.ok('确定')
					).finally(function() {
						$location.path('/news/news_view');
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

	.factory('news_editService', function($http, $mdDialog, bannerListService) {
		var news;
		return {
			getNews: function() {
				return news;
			},
			// //上传图片
			// uploadFileToUrl1: function(file, token) {
			// 	console.log(11111);
			// 	var fd = new FormData();
			// 	fd.append('file', file);
			// 	$http.post(HOST_URL + "/news/file/upload?token=" + token, fd, {
			// 		transformRequest: angular.identity,
			// 		headers: {
			// 			'Content-Type': undefined
			// 		}
			// 	}).success(function(responseData) {
			// 		if(responseData.resultCode == "0") {
			// 			//						console.log(responseData)
			// 			var imgId = responseData.resultData.id;
			// 			$("#imageId").val(imgId);
            //
			// 			$mdDialog.show(
			// 				$mdDialog.alert().clickOutsideToClose(true)
			// 				.title('提示')
			// 				.textContent("上传成功")
			// 				.ok('确定')
			// 			);
			// 		} else {
			// 			bannerListService.alertInfo(responseData);
			// 		}
			// 	}).error(function(responseData) {
			// 		$mdDialog.show(
			// 			$mdDialog.alert()
			// 			.clickOutsideToClose(true)
			// 			.title('提示')
			// 			.textContent(responseData['resultMsg'])
			// 			.ok('确定')
			// 		);
			// 	});
			// },
			// 获取新闻
			getNewsByid: function(data, id) {
				return $http.get(HOST_URL + "/news/" + id, {
					params: data
				}, {
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).success(function(responseData) {

					if(responseData.resultCode == "0") {
						news = responseData.resultData;

					} else {
						bannerListService.alertInfo(responseData);
					}

				}).error(function(responseData) {
					$mdDialog.show(
						$mdDialog.alert()
						.clickOutsideToClose(true)
						.title('提示')
						.textContent(responseData.error)
						.ok('确定')
					);
				});
			}
		}

	});
// .factory('news_editService', function ($http, $mdDialog) {
//     var count = 5;
//     var news;
// var fileName;
//
//     return {
//         getNews: function () {
//             return news;
//         },
//
// 	getFileName: function () {
//             return fileName;
//         },
// 	//上传图片
// 	uploadFileToUrl:function(file,userId,token){
// 		var fd = new FormData();
// 		fd.append('file', file);
// 		$http.post(HOST_URL + "/news/" + userId + "/upload?token=" + token, fd, {
// 			transformRequest: angular.identity,
// 			headers: {'Content-Type': undefined}
// 		})
// 		.success(function(data){
// 			$mdDialog.show(
// 				$mdDialog.alert().
// 					clickOutsideToClose(true)
//                         .title('提示')
//                         .textContent("上传成功")
//                         .ok('确定'));
// 			$("#imageName").val(data.fileName);
// 		});
// 	},
// 	//编辑
// 	edit:function(news,userId,token){
// 		$http.post(HOST_URL + "/news/" + userId + "/edit?token=" + token, news,{
//                     headers: {
//                         'Content-Type': 'application/json'
//                     }
//                 }
//             )
// 		.success(function(data){
// 			 $mdDialog.show(
//                     $mdDialog.alert()
//                         .clickOutsideToClose(true)
//                         .title('提示')
//                         .textContent("修改成功")
//                         .ok('确定')
//                 );
// 			window.location.href="#/news/news_view";
// 		})
// 		.error(function (responseData) {
//                 $mdDialog.show(
//                     $mdDialog.alert()
//                         .clickOutsideToClose(true)
//                         .title('提示')
//                         .textContent(responseData.error)
//                         .ok('确定')
//                 );
//             });
// 	},
//         // 获取新闻
//         getNewsByid: function (userId, token,id) {
//             return $http.get(HOST_URL + "/news/" + userId + "/getNewsById?token=" + token+"&id="+id).success(function (responseData) {
//                 news = responseData;
//             }).error(function (responseData) {
//                 $mdDialog.show(
//                     $mdDialog.alert()
//                         .clickOutsideToClose(true)
//                         .title('提示')
//                         .textContent(responseData.error)
//                         .ok('确定')
//                 );
//             });
//         }
//     }
// });