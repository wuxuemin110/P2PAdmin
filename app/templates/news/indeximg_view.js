// 'use strict';
//
// angular.module('myApp.indeximg_view', ['ngRoute'])
//
//     .config(['$routeProvider', function ($routeProvider) {
//         $routeProvider.when('/news/indeximg_view', {
//             templateUrl: 'templates/news/indeximg_view.html',
//             controller: 'indeximg_viewCtrl'
//         });
//     }])
//
//     .controller('indeximg_viewCtrl', function ($scope,$location, Indeximg_viewService, IndexService,investorCashCtrlService) {
//         $scope.tradeRecord = {};
//         $scope.userAccount = {};
//         var type = "index";
//         // 检测登录
//         var userId = localStorage.userId;
//         var token = localStorage.token;
//         if (token == undefined) {
//             alert("您尚未登录！");
//             self.location = "/#/login";
//             return 0;
//         }
//
// 		$scope.delNews=function(id){
// 			Indeximg_viewService.delNews(userId, token,id);
// 		}
//
// 		$scope.gotoEdit=function(id){
// 			$location.url("/news/indeximg_edit?id="+id);
// 		}
// //      // 获取交易流水
// //      Indeximg_viewService.synTradeRecords(userId, token).success(function () {
// //          $scope.tradeRecords = Indeximg_viewService.getTradeRecords();
// //          $scope.selectPage(1, $scope.tradeRecords);
// //      });
// //      $scope.selectPage = function (page) {
// //          var tmpObject = IndexService.selectPages(page, $scope.tradeRecords,5);
// //          $scope.itemList = tmpObject.itemList;
// //          $scope.nowPage = tmpObject.nowPage;
// //          $scope.pages = tmpObject.pages;
// //          $scope.isShowDot = tmpObject.isShowDot;
// //          $scope.totalPages = tmpObject.totalPages;
// //          $scope.startIndex = tmpObject.startIndex;
// //      }
// // 查询条件
//  $scope.setType = function (input) {
//             // 设置状态
//             $scope.bannerData['type'] = input;
//             $scope.selectPage(1);
//         };
//         $scope.bannerData = {
//             token: token,
//             page: 1,
//             limit: 5,
//             type:type
//         };
//
//         $scope.selectPage = function (page) {
//         	 if (page <= 1) {
//                 page = 1;
//             } else if (page >= $scope.totalPages) {
//                 page = $scope.totalPages;
//             }
//             $scope.bannerData['page'] = page;
//             var data = angular.copy($scope.bannerData);
//             console.log(data);
//             investorCashCtrlService.selectPage("/banner/list", data).then(function () {
//                 var tmpObject = investorCashCtrlService.getResult();
//               console.log(tmpObject);
//                 $scope.itemList = tmpObject.itemList;
//                 $scope.nowPage = tmpObject.nowPage;
//                 $scope.pages = tmpObject.pages;
//                 $scope.isShowDot = tmpObject.isShowDot;
//                 $scope.totalPages = tmpObject.totalPages;
//                 $scope.startIndex = tmpObject.startIndex;
//             });
//         };
//
//         $scope.setType("index");
//     })
//
//     .factory('Indeximg_viewService', function ($http, $mdDialog) {
//         var tradeRecords;
//         return {
//             getTradeRecords: function () {
//                 return tradeRecords;
//             },
// 			//删除新闻
// 			delNews:function(userId, token,id){
// 			 return $http.get(HOST_URL + "/news/" + userId + "/img/deletenews?token=" + token+"&delid="+id).success(function (responseData) {
//                     $mdDialog.show(
//                         $mdDialog.alert()
//                             .clickOutsideToClose(true)
//                             .title('提示')
//                             .textContent("删除成功")
//                             .ok('确定')
//                     );
// 					$("#"+id+"_tr").remove();
//                 }).error(function (responseData) {
//                     $mdDialog.show(
//                         $mdDialog.alert()
//                             .clickOutsideToClose(true)
//                             .title('提示')
//                             .textContent(responseData.error)
//                             .ok('确定')
//                     );
//                 });
// 			},
//             // 同步 TradeRecords
//             synTradeRecords: function (userId, token) {
//                 return $http.get(HOST_URL + "/news/" + userId + "/img/news?token=" + token).success(function (responseData) {
//                     tradeRecords = responseData;
//                 }).error(function (responseData) {
//                     $mdDialog.show(
//                         $mdDialog.alert()
//                             .clickOutsideToClose(true)
//                             .title('提示')
//                             .textContent(responseData.error)
//                             .ok('确定')
//                     );
//                 });
//             }
//         }
//     });