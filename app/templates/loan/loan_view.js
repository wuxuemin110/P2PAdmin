'use strict';

angular.module('myApp.loan_view', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/loan/loan_view', {
            templateUrl: 'templates/loan/loan_view.html',
            controller: 'Loan_viewCtrl'
        });
    }])

    .controller('Loan_viewCtrl', function ($scope, $http, $mdDialog, IndexService, riskService) {
        // 检测登录
        var userId = localStorage.userId;
        var token = localStorage.token;
        if (token == undefined) {
            alert("您尚未登录！");
            self.location = "/manageSystem/#/login";
            return 0;
        }
        $scope.borrowerList = [];
        
        $scope.keyword = '';
        
        $scope.searchBorrower = function(keyword){
            /**根据条件查询借款人**/
         /*   $http.get(HOST_URL + "/borrower/list?token=" + token+"&keyword="+keyword).success(function (responseData) {
                console.log(responseData);
                $scope.borrowerList = responseData;
                $scope.selectPage(1);
            });*/
            $scope.selectPage(1);
        }
        
        /**查询全部借款人列表**/
       /* $http.get(HOST_URL + "/borrower/list?token=" + token).success(function (responseData) {
            $scope.borrowerList = responseData;
            $scope.selectPage(1);
            console.log($scope.itemList);
        });
        $scope.selectPage = function (page) {
            if($scope.borrowerList==null||$scope.borrowerList.length==0){
                $scope.itemList = [];
                $scope.nowPage = 0;
                $scope.pages = 0;
                $scope.isShowDot = false;
                $scope.totalPages = 0;
                $scope.startIndex = 0;
            }else{
                var tmpObject = IndexService.selectPages(page, $scope.borrowerList, 5);
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
            riskService.selectPage("/borrower/list", "/borrower/list/total", data).then(function () {
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
        
        /**查看详情**/
        $scope.viewDetail = function(x){
            self.location='/manageSystem/#/loan/loan_peopledetail?userId='+x.id;
            
        }
        /**修改资料**/
        $scope.editDetail = function(x){
            self.location='/manageSystem/#/loan/loan_edit?userId='+x.id;
            
        }
    
    })
;