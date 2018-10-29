'use strict';

angular.module('myApp.investor_potential', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/investor/investor_potential', {
            templateUrl: 'templates/investor/investor_potential.html',
            controller: 'Investor_potentialCtrl'
        });
    }])
    .controller('Investor_potentialCtrl', function ($scope, $http, $mdDialog, IndexService, riskService) {
        // 检测登录
        var userId = localStorage.userId;
        var token = localStorage.token;
        if (token == undefined) {
            alert("您尚未登录！");
            self.location = "/manageSystem/#/login";
            return 0;
        }
        
        $scope.intentionCustomerList = [];
         /**查询全部潜在投资人列表**/
       /* $http.get(HOST_URL + "/investor/getIntentionCustomerList?token=" + token).success(function (responseData) {
            $scope.intentionCustomerList = responseData;
            $scope.selectPage(1);
        });*/
        $scope.keyword = '';
        /**根据条件查询**/
        $scope.searchIntentionCustomer = function(){
            $scope.selectPage(1);
           /* $http.get(HOST_URL + "/investor/getIntentionCustomerList?token=" + token+"&keyword="+$scope.keyword).success(function (responseData) {
                $scope.intentionCustomerList = responseData;
                $scope.selectPage(1);
            });*/
            
        }
    
        /**分页**/
/*        $scope.selectPage = function (page) {
            if($scope.intentionCustomerList==null||$scope.intentionCustomerList.length==0){
                $scope.itemList = [];
                $scope.nowPage = 0;
                $scope.pages = 0;
                $scope.isShowDot = false;
                $scope.totalPages = 0;
                $scope.startIndex = 0;
            }else{
                var tmpObject = IndexService.selectPages(page, $scope.intentionCustomerList, 5);
                $scope.itemList = tmpObject.itemList;
                $scope.nowPage = tmpObject.nowPage;
                $scope.pages = tmpObject.pages;
                $scope.isShowDot = tmpObject.isShowDot;
                $scope.totalPages = tmpObject.totalPages;
                $scope.startIndex = tmpObject.startIndex;
            }
        }*/
        $scope.selectPage = function (page) {
            var data = {
                token: token,
                page: page,
                limit: 10,
                filter: "id",
                order: "desc",
                keyword: angular.copy($scope.keyword)
            };
            riskService.selectPage("/investor/getIntentionCustomerList", data).then(function () {//去掉了total，分页需要改成这个服务investorCashCtrlService
                var tmpObject = riskService.getResult();
                $scope.itemList = tmpObject.itemList;
                $scope.nowPage = tmpObject.nowPage;
                $scope.pages = tmpObject.pages;
                $scope.isShowDot = tmpObject.isShowDot;
                $scope.totalPages = tmpObject.totalPages;
                $scope.startIndex = tmpObject.startIndex;
            });
        };
        $scope.selectPage(1);
    

    })

;