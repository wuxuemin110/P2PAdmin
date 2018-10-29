'use strict';

angular.module('myApp.indeximg_edit', ['ngRoute']).directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
			
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/news/indeximg_edit', {
            templateUrl: 'templates/news/indeximg_edit.html',
            controller: 'indeximg_editCtrl'
        });
    }])

    .controller('indeximg_editCtrl', function ($scope,$location,$mdDialog, Indeximg_editService, IndexService) {
        $scope.tradeRecord = {};
        $scope.userAccount = {};
		$scope.path=Indeximg_editService.getPath();
		var id = 0;
		if($location.url()!=null){
			id=$location.url().split("=")[1];
		}
        // 检测登录
        var userId = localStorage.userId;
        var token = localStorage.token;
        if (token == undefined) {
            alert("您尚未登录！");
            self.location = "/manageSystem/#/login";
            return 0;
        }
		
		//上传按钮
		$scope.uploadFile = function(){
			var file = $scope.myFile;
			//console.dir(file);
			if(file==undefined){
				 $mdDialog.show(
                       $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent("请选择图片")
                            .ok('确定')
                    );
				 return false;
			}
			Indeximg_editService.uploadFileToUrl(file,userId,token);
		};
        // 获取图片新闻
        Indeximg_editService.synTradeRecords(userId, token,id).success(function () {
            $scope.tradeRecord = Indeximg_editService.getTradeRecords();
        });

		 // 保存按钮
        $scope.edit=function(){
			var imgnews = $scope.tradeRecord;
			imgnews.imagename=$("#imageName").val();
			 imgnews.createTime=new Date(imgnews.createTime);
			Indeximg_editService.edit(userId, token,imgnews);
        };
		
    })

    .factory('Indeximg_editService', function ($http,$location, $mdDialog) {
		var downloadPath=HOST_URL + "/news/img/downloadPic?fileName=";
        var tradeRecords;
        return {
            getTradeRecords: function () {
                return tradeRecords;
            },
			getPath: function () {
                return downloadPath;
            },
			//执行修改
			edit:function(userId,token,imgnews){
				$http.post(HOST_URL + "/news/" + userId + "/img/edit?token=" + token, imgnews,{
                      headers: {
                          'Content-Type': 'application/json'
                      }
                 })
				.success(function(data){
					 $mdDialog.show(
                       $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent("修改成功")
                            .ok('确定')
                    );
					$location.url("/news/indeximg_view")
				}).error(function (responseData) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent(responseData.error)
                            .ok('确定')
                    );
                });
			},
			//上传图片
			uploadFileToUrl:function(file,userId,token){
				var fd = new FormData();
				fd.append('file', file);
				$http.post(HOST_URL + "/news/" + userId + "/img/upload?token=" + token, fd, {
					transformRequest: angular.identity,
					headers: {'Content-Type': undefined}
				})
				.success(function(data){
					 $mdDialog.show(
                       $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent("上传成功")
                            .ok('确定')
                    );
					$("#imageName").val(data.fileName);
				});
			},
           
            // 同步 TradeRecords
            synTradeRecords: function (userId, token,id) {
                return $http.get(HOST_URL + "/news/" + userId + "/img/getNewsById?token=" + token+"&id="+id).success(function (responseData) {
                    tradeRecords = responseData;
                }).error(function (responseData) {
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