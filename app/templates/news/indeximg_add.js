// 'use strict';
//
// angular.module('myApp.indeximg_add', ['ngRoute']).directive('fileModel', ['$parse', function
// ($parse) {
//     return {
//         restrict: 'A',
//         link: function(scope, element, attrs) {
//
//             var model = $parse(attrs.fileModel);
//             var modelSetter = model.assign;
//             element.bind('change', function(){
//                 scope.$apply(function(){
//                     modelSetter(scope, element[0].files[0]);
//                 });
//             });
//         }
//     };
// }])
//
//     .config(['$routeProvider', function ($routeProvider) {
//         $routeProvider.when('/news/indeximg_add', {
//             templateUrl: 'templates/news/indeximg_add.html',
//             controller: 'Indeximg_addCtrl'
//         });
//     }])
//
//     .controller('Indeximg_addCtrl', function ($scope,$mdDialog, Indeximg_addService, IndexService)
// {
//         $scope.userAccount = {};
// 		$scope.value=new Date();
//         // 检测登录
//         var userId = localStorage.userId;
//         var token = localStorage.token;
//         if (token == undefined) {
//             alert("您尚未登录！");
//             self.location = "/#/login";
//             return 0;
//         }
// 		//保存按钮
// 		$scope.saveImgnews=function(){
// 			var imgnews = $scope.imgnews;
// 			if($("#imageName").val()==""){
// 				$mdDialog.show(
//                     $mdDialog.alert()
//                         .clickOutsideToClose(true)
//                          .title('提示')
//                          .textContent("图片未上传")
//                        .ok('确定')
//                 );
// 				return false;
// 			}
// 			$scope.imgnews
// 			if(!imgnews){
// 				$mdDialog.show(
//                     $mdDialog.alert()
//                         .clickOutsideToClose(true)
//                          .title('提示')
//                          .textContent("请输入链接路径！")
//                        .ok('确定')
//                 );
// 				return;
// 			}
// 			imgnews.imagename=$("#imageName").val();
// 			imgnews.createdTime=$("#exampleInput").val();
// 			Indeximg_addService.saveImgnews(userId,token,imgnews)
// 		}
//
// 		//上传按钮
// 		$scope.uploadFile = function(){
// 			var file = $scope.myFile;
// 			//console.dir(file);
// 			if(file==undefined){
// 				$mdDialog.show(
//                         $mdDialog.alert()
//                             .clickOutsideToClose(true)
//                             .title('提示')
//                             .textContent("请选择图片")
//                             .ok('确定')
//                     );
// 			}
// 			Indeximg_addService.uploadFileToUrl(file,userId,token);
// 		};
//
//     })
//
//     .factory('Indeximg_addService', function ($http, $mdDialog) {
//         return {
//             //保存按钮
//             saveImgnews: function (userId,token,news) {
//                $http.post(HOST_URL + "/news/" + userId + "/img/addNews?token=" + token, news,{
//                         headers: {
//                             'Content-Type': 'application/json'
//                         }
//                     }
//                 )
// 				.success(function(data){
// 					 $mdDialog.show(
//                         $mdDialog.alert()
//                             .clickOutsideToClose(true)
//                             .title('提示')
//                             .textContent("保存成功")
//                             .ok('确定')
//                     );
// 					window.location.href="#/news/indeximg_view";
// 				}).error(function(data){
// 					 $mdDialog.show(
//                         $mdDialog.alert()
//                             .clickOutsideToClose(true)
//                             .title('提示')
//                             .textContent(data.error)
//                             .ok('确定')
//                     );
// 				});
//             },
// 			//上传图片
// 			uploadFileToUrl:function(file,userId,token){
// 				var fd = new FormData();
// 				fd.append('file', file);
// 				$http.post(HOST_URL + "/news/" + userId + "/img/upload?token=" +
// token, fd, {
// 					transformRequest: angular.identity,
// 					headers: {'Content-Type': undefined}
// 				})
// 				.success(function(data){
// 					$mdDialog.show(
// 						$mdDialog.alert().clickOutsideToClose(true)
//                             .title('提示')
//                             .textContent("上传成功")
//                             .ok('确定')
// 					);
// 					$("#imageName").val(data.fileName);
// 				});
// 			},
//         }
//     });