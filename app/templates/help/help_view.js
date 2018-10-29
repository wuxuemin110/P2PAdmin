'use strict';

angular.module('myApp.help_view', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/help/help_view', {
            templateUrl: 'templates/help/help_view.html',
            controller: 'HelpViewCtrl'
        });
    }])

    .controller('HelpViewCtrl', function ($scope,$location,$mdDialog, $http,IndexService,riskService,investorCashCtrlService,$routeParams,bannerListService) {
        $scope.news = {};
        $scope.userAccount = {};
		$scope.title="";
        // 检测登录
        var userId = localStorage.userId;
        var token = localStorage.token;
        if (token == undefined) {
            alert("您尚未登录！");
            self.location = "/manageSystem/#/login";
            return 0;
        }

        // 获取新闻列表
        // $scope.news={
        //     token:token,
        //     page:1,
        //     limit:10
        // }
        // var data=angular.copy($scope.news);
        // console.log(data);
        // NewsService.synNews(data).success(function () {
        //
        //     $scope.news = NewsService.getNews();
        //     $scope.selectPage(1);
        // });
		//查询新闻
         // $scope.keyword=""
		// $scope.query=function(keyword) {
         //    $scope.cashData['keyword'] = $scope.keyword;
         //    $scope.selectPage(1);
        // }
		// 	var title = $("#queryContent").val();
		// 	$scope.title=encodeURI(encodeURI(title));
		// 	// 带条件获取新闻列表
		// 	/*NewsService.queryNews(userId, token,title).success(function () {
		// 		$scope.news = NewsService.getNews();
		// 		$scope.selectPage();
		// 	});*/
		// 	$scope.selectPage(1);
		// }

		//删除新闻
		// $scope.deleteNews=function(a){
		// 	NewsService.delNews(userId, token,a).success(function (flag) {
		// 		if(flag){
		// 			$("#"+a+"_td").parent().remove();
		// 			self.location="#/news/news_view";
		// 			$mdDialog.show(
         //                $mdDialog.alert()
         //                    .clickOutsideToClose(true)
         //                    .title('提示')
         //                    .textContent("删除成功")
         //                    .ok('确定')
         //            );
		//
		// 		}else{
		// 			$mdDialog.show(
         //                $mdDialog.alert()
         //                    .clickOutsideToClose(true)
         //                    .title('提示')
         //                    .textContent("删除失败")
         //                    .ok('确定')
         //            );
		// 		}
		// 	});
		// };
		//跳转到编辑新闻页面
		$scope.gotoedit=function(id){
			$location.url("help/help_edit?id="+id);
		};
		// 查询条件
        $scope.cashData = {
            page: 1,
            limit: 20,
            token:token
			 // keyword:""
        };

		 $scope.selectPage = function (page) {
             if (page <= 1) {
                 page = 1;
             } else if (page >= $scope.totalPages) {
                 page = $scope.totalPages;
             }
			 $scope.cashData['page']=page;
			// $scope.cashData['title']=$scope.title
             var data = angular.copy($scope.cashData);
             investorCashCtrlService.selectPage("/help/list", data).then(function () {
                var tmpObject = investorCashCtrlService.getResult();
                 $scope.itemList = tmpObject.itemList;
//               console.log($scope.itemList);
                $scope.nowPage = tmpObject.nowPage;
                $scope.pages = tmpObject.pages;
                $scope.sumCount=tmpObject.sumCount;
                $scope.isShowDot = tmpObject.isShowDot;
                $scope.totalPages = tmpObject.totalPages;
                $scope.startIndex = tmpObject.startIndex;
            });
        };
        $scope.selectPage(1);

$scope.showConfirm=function(notice){
    $mdDialog.show(
        $mdDialog.confirm()
            .clickOutsideToClose(true)
            .title('您确定要删除吗？')
            .ok('确定')
            .cancel('取消')
    ).then(function () {
        $scope.deleteNews(notice);
    }, function () {

    });

}

        // 删除

        $scope.cashData1={
            token:token
        }

        var data=angular.copy($scope.cashData1)
        $scope.deleteNews=function(help){

            $http.get(HOST_URL + "/help/"+help.id+"/delete",
                {
                    params:data
                },
                {

                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function(responseData){
                if(responseData.resultCode=="0"){
                    // console.log(responseData)
                    $mdDialog.show(
                        $mdDialog.alert().clickOutsideToClose(true)
                            .title('提示')
                            .textContent(responseData['resultMsg'])
                            .ok('确定')
                    ).finally(function() {
							window.location.reload();
						});
                }else{
                    bannerListService.alertInfo(responseData);
                    // $mdDialog.show(
                    //     $mdDialog.alert().clickOutsideToClose(true)
                    //         .title('提示')
                    //         .textContent(responseData['resultMsg'])
                    //         .ok('确定')
                    // );
                }
            }).error(function(responseData){
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

