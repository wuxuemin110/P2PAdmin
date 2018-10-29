'use strict';

angular.module('myApp.userView', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/user/userView', {
            templateUrl: 'templates/user/userView.html',
            controller: 'userViewCtrl'
        });
    }])

    .controller('userViewCtrl', function ($scope, $rootScope, $http, $mdDialog, userViewService, riskService, layoutService,investorCashCtrlService,bannerListService) {
        $scope.tradeRecord = {};
        $scope.userAccount = {};
        $scope.keywords = {};
        // 检测登录
        var userId = localStorage.userId;
        var token = localStorage.token;
       
        if (token == undefined) {
            // alert("您尚未登录！");
            self.location = "/manageSystem/#/login";
            return 0;
        }
        /**根据条件查询用户**/
        $scope.searchKeyword = "";
        $scope.searchUser = function (keyword) {
            $scope.yonghu['keyword']=$scope.searchKeyword,
            $scope.selectPage(1);

            // var data="?keyword="+$scope.searchKeyword+"&orders='desc'&filters='id'&limit=10&page=+1&token="+token
            // $http.get(HOST_URL + "/user/list"+data).success(function (responseData) {
            //     if(responseData.resultCode=="0"){
            //           $scope.registerList=responseData.resultData;
            //             console.log($scope.registerList);
            //
            //
            //     }
            // });

        };

        /**查询用户列表 - 分页**/

        $scope.yonghu = {

            token: token,
            page: 1,
            limit: 20,
            filter:'id',
            order: "desc",
            // keyword: angular.copy($scope.keywords)
        };
        $scope.selectPage = function (page) {
            if (page <= 1) {
                page = 1;
            } else if (page >= $scope.totalPages) {
                page = $scope.totalPages;
            }
            $scope.yonghu['page'] = page;
            var data = angular.copy($scope.yonghu);
            investorCashCtrlService.selectPage("/user/list", data).then(function () {
                var tmpObject = investorCashCtrlService.getResult();
                $scope.itemList = tmpObject.itemList;
                $scope.nowPage = tmpObject.nowPage;
                $scope.sumCount=tmpObject.sumCount;
                $scope.pages = tmpObject.pages;
                $scope.isShowDot = tmpObject.isShowDot;
                $scope.totalPages = tmpObject.totalPages;
                $scope.startIndex = tmpObject.startIndex;

                console.log($scope.itemList)
            });
        };
        $scope.searchUser(1);
        // $scope.selectPage(1);
        //退出登录提示框
        $scope.logout=function(){
           var confirm = $mdDialog.confirm()
               .title('温馨提示：')
               .content('您确定要退出吗?')
               .cancel('确定')
               .ok('取消');
            $mdDialog.show(confirm).then(function () {
                //ok 取消
            }, function () { 
                //cancle 确定
                self.location = "/manageSystem/#/login";
            });
        }
        $scope.viewUI = function(x){
            $rootScope.x=x;
            self.location = "/manageSystem/#/user/userEdit/"+x.id;
        };
$scope.showConfirm=function(x){
    $mdDialog.show(
        $mdDialog.confirm()
            .clickOutsideToClose(true)
            .title('您确定要删除吗？')
            .ok('确定')
            .cancel('取消')
    ).then(function () {
        $scope.deleteUser(x);
    }, function () {

    });
}
        /**删除用户**/
        $scope.deleteUser = function (x) {
            var data={
                token:token,
               userId:x.id
            }

            $http.post(
                HOST_URL + "/user/delete",
                $.param(data),
                {
                    headers:{
                        'Content-Type':'application/x-www-form-urlencoded'
                    }
                }

            ).success(function (responseData){
                if(responseData.resultCode=='0'){
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent('删除成功')
                            .ok('确定')
                    ).finally(function() {
                        window.location.reload();
                    });
                }else{
                    bannerListService.alertInfo(responseData);
                }

            }).error(function (responseData) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent(responseData['resultMsg'])
                        .ok('确定')
                );
            });
        };

        /**********************************************************/
        // 判断登录
        var userName = localStorage.userName;
        var role = localStorage.role;

        if (token == undefined) {
            alert("您尚未登录！");
            self.location = "/manageSystem/#/login";
        }
        // else {
        //     layoutService.synUserAccount(userId, token).success(function () {
        //         $scope.userAccount = layoutService.getUserAccount();
        //     });
        // }
        //
        $rootScope.url = {
            'login': '/manageSystem/#/login',
            'register': '/manageSystem/#/register',
            'about': '/manageSystem/#/about'
        };
        if (userId != undefined && token != undefined && userName != undefined) {
            $rootScope.url.login = '/manageSystem/#/user/userView';
            $rootScope.url.register = '/manageSystem/#/logout';
            $rootScope.userName = userName;
            $rootScope.log = "退出登录";
        } else {
            $rootScope.url.login = '/manageSystem/#/login';
            $rootScope.url.register = '/manageSystem/#/register';
            $rootScope.userName = "立即登录";
            $rootScope.log = "立即注册";
        }
        $rootScope.is_borrower = role == 200;

    })

    .factory('userViewService', function ($http, $mdDialog) {
        var registerList;
        return {
            getRegisterList: function () {
                return registerList;
            },

            // 同步 TradeRecords
            synRegisterList: function (userId, token) {

              // return $http.get(HOST_URL + "/user/" + userId + "/user/list?keyword="+$searchKeyword+"&orders="+orders+"&filters="+filters+"&limit=10&page=+1&token="+token).success(function (responseData) {
                return $http.get(HOST_URL + "/user/" + userId + "/user/list?token=" + token).success(function (responseData) {
                	// console.log(123);
                	// console.log(responseData);
                    if(responseData.resultCode == "0") {
                    registerList = responseData.resultData;
                   }
                	else if(responseData.resultCode=="2"){
                    $location.path('/manageSystem/#/login');

                }
                }).error(function (responseData) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent(responseData['resultMsg'])
                            .ok('确定')
                    );
                });
            }
        }
    });

