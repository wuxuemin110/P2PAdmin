'use strict';

angular.module('myApp.partners_list', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/activity/partners_list', {
            templateUrl: 'templates/activity/partners_list.html',
            controller: 'partners_listCtrl'
        });
    }])

    .controller('partners_listCtrl', function ($scope,$location,  IndexService,investorCashCtrlService,bannerListService,$mdDialog,$filter,partners_listCtrlService) {
        $scope.tradeRecord = {};
        $scope.userAccount = {};
        var type = "index";
        $scope.isActive = true; 
        // 检测登录
        var userId = localStorage.userId;
        var token = localStorage.token;
        if (token == undefined) {
            alert("您尚未登录！");
            self.location = "/manageSystem/#/login";
            return 0;
        }

		// $scope.delNews=function(id){

		// }
        $scope.showConfirm=function(id){
            $mdDialog.show(
                $mdDialog.confirm()
                    .clickOutsideToClose(true)
                    .title('您确定要删除吗？')
                    .ok('确定')
                    .cancel('取消')
            ).then(function () {
                partners_listCtrlService.delNews(token,id);
            }, function () {

            });

        }

		$scope.gotoEdit=function(id){

				$location.url("/activity/partnersEdit?id="+id);

		}
//      // 获取交易流水
//      Indeximg_viewService.synTradeRecords(userId, token).success(function () {
//          $scope.tradeRecords = Indeximg_viewService.getTradeRecords();
//          $scope.selectPage(1, $scope.tradeRecords);
//      });
//      $scope.selectPage = function (page) {
//          var tmpObject = IndexService.selectPages(page, $scope.tradeRecords,5);
//          $scope.itemList = tmpObject.itemList;
//          $scope.nowPage = tmpObject.nowPage;
//          $scope.pages = tmpObject.pages;
//          $scope.isShowDot = tmpObject.isShowDot;
//          $scope.totalPages = tmpObject.totalPages;
//          $scope.startIndex = tmpObject.startIndex;
//      }
// 查询条件
        $scope.name="";
 $scope.searchInvestor = function (name) {
            // 设置状态
            $scope.bannerData['name'] = $scope.name;
     $scope.selectPage(1)
            // if(input=="index"){
            // 	 $scope.selectPage(1);
            // }else{
            // $scope.selectPage1(1);
            // }
            
        };
        $scope.bannerData = {
            token: token,
            page: 1,
            limit:5
            // type:type,
            // startDate:"",
            // endDate:""
        };

        $scope.selectPage = function (page) {
        	 if (page <= 1) {
                page = 1;
            } else if (page >= $scope.totalPages) {
                page = $scope.totalPages;
            }
            $scope.bannerData['page'] = page;
            var data = angular.copy($scope.bannerData);
            // data.startDate=$filter('date')(data.startDate, "yyyyMMddHHmmss");
            // data.endDate=$filter('date')(data.endDate, "yyyyMMdd");
            // if(data.endDate!=""){
            //     data.endDate +="235959";
            // }
         console.log(data);
            investorCashCtrlService.selectPage("/partners/select/list", data).then(function () {
                var tmpObject = investorCashCtrlService.getResult();
         
                $scope.itemList = tmpObject.itemList;
                $scope.nowPage = tmpObject.nowPage;
                $scope.pages = tmpObject.pages;
                $scope.sumCount=tmpObject.sumCount;
                $scope.isShowDot = tmpObject.isShowDot;
                $scope.totalPages = tmpObject.totalPages;
                $scope.startIndex = tmpObject.startIndex;
            });
        };
        $scope.searchInvestor(1);
    })

    .factory('partners_listCtrlService', function ($http, $mdDialog,bannerListService) {
        var tradeRecords;
        return {
            getTradeRecords: function () {
                return tradeRecords;
            },
			//删除新闻
			delNews:function( token,id){
				var tokenData = {
			"token": token,
		      };
			 return $http.post(HOST_URL + "/partners/delete/"+id,

				$.param(tokenData) ,
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}
			 ).success(function (responseData) {
			 	if(responseData.resultCode=="0"){
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent("删除成功")
                            .ok('确定')
                    ).finally(function() {
							window.location.reload();
						});
//					$("#"+id+"_tr").remove();
					}
			 	else {
						bannerListService.alertInfo(responseData);
					}
                }).error(function (responseData) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent(responseData.resultMsg)
                            .ok('确定')
                    );
                });
			},
            // 同步 TradeRecords
            synTradeRecords: function (userId, token) {
                return $http.get(HOST_URL + "/news/" + userId + "/img/news?token=" + token).success(function (responseData) {
                    tradeRecords = responseData;
                }).error(function (responseData) {
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
    }).factory('bannerListService', function ($http, $mdDialog) {
    	
    	 //统一返回错误提示
        return {
            alertInfo: function (responseData) {
            	if(responseData.resultCode=='1'){

            		$mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent(responseData['resultMsg'])
                        .ok('确定')

                ).finally(function(){
                        if(responseData.resultMsg=="您已在其他地点登录或登录已过期！"){
                            // console.log(responseData.resultMsg)
                            self.location = "/manageSystem/#/login";
                        }
                    });
                return
            	}
            	else if(responseData.resultCode=='2'){
            		sessionStorage.clear();
                    self.location = "/manageSystem/#/login";
                    return
            	}
               
            }
        }
    })