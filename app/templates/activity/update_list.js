'use strict';

angular.module('myApp.update_list', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/activity/update_list', {
            templateUrl: 'templates/activity/update_list.html',
            controller: 'update_listCtrl'
        });
    }])

    .controller('update_listCtrl', function ($scope,$location,  IndexService,investorCashCtrlService,bannerListService,update_listCtrlService,$mdDialog,$filter) {
        $scope.tradeRecord = {};
        $scope.userAccount = {};
        var id = "android";
        $scope.isActive = true;
        // 检测登录
        var userId = localStorage.userId;
        var token = localStorage.token;
        if (token == undefined) {
            alert("您尚未登录！");
            self.location = "/manageSystem/#/login";
            return 0;
        }

        $scope.showConfirm=function(id){
            $mdDialog.show(
                $mdDialog.confirm()
                    .clickOutsideToClose(true)
                    .title('您确定要删除吗？')
                    .ok('确定')
                    .cancel('取消')
            ).then(function () {
                update_listCtrlService.delNews(token,id);
            }, function () {

            });

        };

        $scope.gotoEdit=function(id){
            console.log(id)
            if(id=="android"){
                $location.url("/activity/updateEdit?id="+id);
            }
            else if(id=="iOS"){
                $location.url("/activity/updateIosEdit?id="+id);
            }

        };

// 查询条件
        $scope.setType = function (input) {
            // 设置状态
            $scope.bannerData['id'] = input;
            if(input=="android"){
                $scope.selectPage(1);
            }else{
                $scope.selectPage1(1);
            }

        };
        $scope.bannerData = {
            token: token,
            page: 1,
            limit:5,
            // id:id
            // startDate:"",
            // endDate:"",
            // type:""
        };

        $scope.selectPage = function (page) {
            if (page <= 1) {
                page = 1;
            } else if (page >= $scope.totalPages) {
                page = $scope.totalPages;
            }
            $scope.bannerData['page'] = page;
            var data = angular.copy($scope.bannerData);
            console.log(data);
            // data.startDate=$filter('date')(data.startDate, "yyyyMMddHHmmss");
            // data.endDate=$filter('date')(data.endDate, "yyyyMMdd");
            // if(data.endDate!=""){
            //     data.endDate +="235959";
            // }
//          console.log(data);
            investorCashCtrlService.selectPage("/update/check/query/all", data).then(function () {
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
        $scope.selectPage1 = function (page) {
            if (page <= 1) {
                page = 1;
            } else if (page >= $scope.totalPages1) {
                page = $scope.totalPages1;
            }
            $scope.bannerData['page'] = page;
            var data = angular.copy($scope.bannerData);
          console.log(data);
            investorCashCtrlService.selectPage("/update/check/query/all", data).then(function () {
                var tmpObject = investorCashCtrlService.getResult();
//        console.log(tmpObject);
                $scope.itemList1 = tmpObject.itemList;
                $scope.nowPage1 = tmpObject.nowPage;
                $scope.pages1 = tmpObject.pages;
                $scope.sumCount=tmpObject.sumCount;
                $scope.isShowDot1 = tmpObject.isShowDot;
                $scope.totalPages1 = tmpObject.totalPages;
                $scope.startIndex1 = tmpObject.startIndex;
            });
        };

        $scope.setType("android");
    })

    .factory('update_listCtrlService', function ($http, $mdDialog,bannerListService) {
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
                return $http.post(HOST_URL + "/update/check/del/"+id,
                    $.param(tokenData), {
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