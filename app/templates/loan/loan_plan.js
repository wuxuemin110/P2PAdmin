'use strict';

angular.module('myApp.loan_plan', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/loan/loan_plan', {
            templateUrl: 'templates/loan/loan_plan.html',
            controller: 'Loan_planCtrl'
        });
    }])

    .controller('Loan_planCtrl', function ($scope, $http, $location, $mdDialog, IndexService, riskService) {
        // 检测登录
        var userId = localStorage.userId;
        var token = localStorage.token;
        if (token == undefined) {
            alert("您尚未登录！");
            self.location = "/manageSystem/#/login";
            return 0;
        }
        /**用传过来的用户ID去查询该借款人的信息**/
        $http.get(HOST_URL + '/borrower/'+$location.search().userId+'?token='+token).success(function(data){
            $scope.borrower=data;
        });
        /**查询还款列表**/
        /*$http.get(HOST_URL + '/borrower/repaymentList?loanId='+$location.search().loanId).success(function(data){
            $scope.repaymentList = data;
            $scope.selectPage(1);
        });*/
        /**查看借款人还款计划的分页**/
        /*$scope.selectPage = function (page) {
            if($scope.repaymentList==null||$scope.repaymentList.length==0){
                $scope.itemList = [];
                $scope.nowPage = 0;
                $scope.pages = 0;
                $scope.isShowDot = false;
                $scope.totalPages = 0;
                $scope.startIndex = 0;
            }else{
                var tmpObject = IndexService.selectPages(page, $scope.repaymentList, 5);
                $scope.itemList = tmpObject.itemList;
                $scope.nowPage = tmpObject.nowPage;
                $scope.pages = tmpObject.pages;
                $scope.isShowDot = tmpObject.isShowDot;
                $scope.totalPages = tmpObject.totalPages;
                $scope.startIndex = tmpObject.startIndex;
            }
        }*/
        
        $scope.loanId = $location.search().loanId;
        $scope.selectPage = function (page) {
            $scope.tabCurrentPage = page;
            if($scope.loanId!=undefined){
                var data = {
                token: token,
                page: page,
                limit: 10,
                filter: "id",
                order: "desc",
                loanId: $scope.loanId 
                };
                riskService.selectPage('/borrower/repaymentList', '/borrower/repaymentList/total', data).then(function () {
                    var tmpObject = riskService.getResult();
                    $scope.itemList = tmpObject.itemList;
                    $scope.nowPage = tmpObject.nowPage;
                    $scope.pages = tmpObject.pages;
                    $scope.isShowDot = tmpObject.isShowDot;
                    $scope.totalPages = tmpObject.totalPages;
                    $scope.startIndex = tmpObject.startIndex;
                   
                });
            }else if($scope.userId!=undefined){
                var data = {
                token: token,
                page: page,
                limit: 10,
                filter: "id",
                order: "desc",
                userId: $scope.userId
                };
                riskService.selectPage('/borrower/'+$scope.userId+'/repayment', '/borrower/'+$scope.userId+'/repayment/total', data).then(function () {
                    var tmpObject = riskService.getResult();
                    $scope.itemList = tmpObject.itemList;
                    $scope.nowPage = tmpObject.nowPage;
                    $scope.pages = tmpObject.pages;
                    $scope.isShowDot = tmpObject.isShowDot;
                    $scope.totalPages = tmpObject.totalPages;
                    $scope.startIndex = tmpObject.startIndex;
                   
                });
                
            }else{
                $scope.itemList = [];
                $scope.nowPage = 0;
                $scope.pages = 0;
                $scope.isShowDot = false;
                $scope.totalPages = 0;
                $scope.startIndex = 0;
            }
            
        };
        $scope.selectPage(1);
    
    
        /**根据条件查询**/
        $scope.keyword='';
        $scope.searchRepayment = function (keyword) {
            if(keyword==''){
                return;
            }
            /**根据条件查询投资人**/
            $http.get(HOST_URL + "/borrower/list?token=" + token+"&keyword="+keyword).success(function (responseData) {
                if(responseData!=null&&responseData.length){
                    $scope.borrower = responseData[0];
                }else{
                    $scope.borrower = {}
                }
               
            }).then(function(){
                $scope.loanId=undefined;
                $scope.userId=$scope.borrower.id;
                $scope.selectPage(1);
                
              
            });
        }
        
    
        
    })
;