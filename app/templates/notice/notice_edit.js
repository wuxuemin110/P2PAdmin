'use strict';

angular.module('myApp.notice_edit', ['ngRoute']).directive('fileModel', ['$parse', function($parse) {
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
		$routeProvider.when('/notice/notice_edit', {
			templateUrl: 'templates/notice/notice_edit.html',
			controller: 'notice_editCtrl'
		});
	}])
	.controller('notice_editCtrl', function($scope, $location, IndexService, $http, $routeParams, $mdDialog, bannerListService, news_editService1) {
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
		news_editService1.getNewsByid(tokenData, $routeParams.id).success(function() {
			$scope.notice = news_editService1.getNews();
					// console.log($scope.news);
			//			 $("#supmemuSel option[value='"+$scope.news.supmemu+"']").attr("selected",true);
            um.addListener("ready", function() {
            	um.setContent($scope.notice.content); //设置内容
            })
			//			 $scope.value = new Date($scope.news.createdTime);//设置时间
		});

		// 保存按钮

		$scope.edit = function() {
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

			if(notice.signature == "") {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent("请添加署名")
					.ok('确定')
				);
				return;
			}

			if(um.getContent() != null && um.getContent().trim() != "") {
                notice.content = um.getContent();
			} else {
                notice.content = "";
			}
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
                signature: notice.signature,
				level: notice.level,
				id: $routeParams.id,
				content: notice.content
			}
			var data = angular.copy($scope.cashData)
			// data.imgId = $("#imageId").val();
			// console.log(data)
			$http.post(HOST_URL + "/notice/save",
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
						$location.path('/notice/notice_view');
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

	.factory('news_editService1', function($http, $mdDialog, bannerListService) {
		var news;
		return {
			getNews: function() {
				return news;
			},

			// 获取公告
			getNewsByid: function(data, id) {
				return $http.get(HOST_URL + "/notice/" + id, {
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
