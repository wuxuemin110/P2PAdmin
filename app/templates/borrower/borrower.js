'use strict';

angular.module('myApp.borrower', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/borrower/borrower', {
            templateUrl: 'templates/borrower/borrower.html',
            controller: 'BorrowerCtrl'
        });
    }])
    .controller('BorrowerCtrl', function ($scope, $http, $rootScope, $location, $mdDialog, IndexService, riskService,investorCashCtrlService) {
        // 检测登录
        var userId = localStorage.userId;
        var token = localStorage.token;
        if (token == undefined) {
            alert("您尚未登录！");
            self.location = "/manageSystem/#/login";
            return 0;
        }
        /**根据条件查询投资人**/
        $scope.keyword = '';
        $scope.searchInvestor = function (keyword) {
        $scope.cashData['keyword']=$scope.keyword;
            $scope.selectPage(1);
        }
        
        /**查询全部用户投资人**/
/*        $http.get(HOST_URL + "/investor/list?token=" + token).success(function (responseData) {
            $scope.investorList = responseData;
            $scope.selectPage(1);
        });*/
    
        /**查询全部用户投资人 分页**/
        $scope.cashData= {
            token: token,
            page:1,
            limit:20

        };
        $scope.selectPage = function (page) {
            if (page <= 1) {
                page = 1;
            } else if (page >= $scope.totalPages) {
                page = $scope.totalPages;
            }
          $scope.cashData['page'] = page;
           var data = angular.copy($scope.cashData);
            investorCashCtrlService.selectPage("/back/borrower/list", data).then(function () {// "/investor/list/total",
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
        // $scope.selectPage(1);
        // $scope.viewDetail = function(x){
        //     localStorage.setItem('Plan_recommendUser',x.recommendUser);
        //     localStorage.setItem('Plan_userId',x.userId);
        //     self.location='/#/investor/investor_view/'+x.userId;
        // }
        
        // $scope.editDetail = function(x){
        //     // self.location='/#/investor/investor_edit?userId='+x.userId;
        //     self.location='/#/investor/investor_edit/'+x.userId;
        // }

    /*
        $scope.synPlans = InvestorService.synMainPlans().then(function () {
            $scope.mainPlans = InvestorService.getMainPlans();
            $scope.selectPage(1);

            $scope.synRankingList = InvestorService.synRankingList().then(function () {
                $scope.rankingList = InvestorService.getRankigList();

            });
        });

        $scope.selectPage = function (page) {

            if (page <= 1) {
                page = 1;
            } else if (page >= $scope.totalPages) {
                page = $scope.totalPages;
            }
            InvestorService.synBottomPlans(page).then(function () {

                $scope.tmpScope = InvestorService.getBottomPlans();
                $scope.bottomPlans = $scope.tmpScope.bottomPlans;

                $scope.totalPages = $scope.tmpScope.totalPages;
                $scope.pages = $scope.tmpScope.pages;
                $scope.nowPage = $scope.tmpScope.nowPage;
                $scope.isShowDot = $scope.tmpScope.isShowDot;
                $scope.startIndex = (page - 1) * 5 + 1;

            });
        }
*/
    });
/*
    .factory('InvestorService', function ($http) {
        var mainPlanList;
        var bottomPlanList;
        var tmpScope = {};
        var rankingList;
        return {
            getPlans: function () {
                return plans;
            },
            getMainPlans: function () {
                return mainPlanList;
            },
            getBottomPlans: function () {
                return tmpScope;
            },
            // 同步计划
            synMainPlans: function () {
                return $http.get(HOST_URL + "/plans?order=desc&limit=5").success(function (responseData) {
                    mainPlanList = responseData;
                }).error(function () {
                    // 无响应
                });
            },
            // 同步历史计划
            synBottomPlans: function (page) {
                return $http.get(HOST_URL + "/plans?order=desc&limit=5&page=" + page).success(function (responseData) {

                    bottomPlanList = responseData;
                    tmpScope.bottomPlans = bottomPlanList;
                    tmpScope.totalPages = Math.ceil(bottomPlanList[0].planCount / 5);
                    tmpScope.nowPage = page;
                    tmpScope.pages = [];
                    if (tmpScope.nowPage > 3 && tmpScope.totalPages > 7) {
                        if (tmpScope.nowPage + 3 < tmpScope.totalPages) {
                            for (var i = 0; i < 7; i++) {
                                tmpScope.pages[i] = {};
                                tmpScope.pages[i].showNumber = tmpScope.nowPage - 3 + i;
                                tmpScope.isShowDot = true;
                            }
                        } else if (tmpScope.nowPage + 3 >= tmpScope.totalPages) {
                            for (var i = 6; i >= 0; i--) {
                                tmpScope.pages[6 - i] = {};
                                tmpScope.pages[6 - i].showNumber = tmpScope.totalPages - i;
                                tmpScope.isShowDot = false;
                            }
                        }
                    } else if (tmpScope.nowPage <= 3 && tmpScope.totalPages > 8) {
                        for (var i = 0; i <= 6; i++) {
                            tmpScope.pages[i] = {};
                            tmpScope.pages[i].showNumber = i + 1;
                            tmpScope.isShowDot = true;
                        }
                    } else {
                        for (var i = 0; i < tmpScope.totalPages; i++) {
                            tmpScope.pages[i] = {};
                            tmpScope.pages[i].showNumber = i + 1;
                            tmpScope.isShowDot = false;
                        }
                    }

                }).error(function () {
                    // 无响应
                });
            },
            synRankingList: function () {
                return $http.get(HOST_URL + "/user/investor/rankings").success(function (responseData) {
                    rankingList = responseData;
                }).error(function () {

                });
            },
            getRankigList: function () {
                return rankingList;
            }
        }
    })
;*/