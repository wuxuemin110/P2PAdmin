'use strict';

angular.module('myApp.investor_view', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/investor/investor_view/:id', {
            templateUrl: 'templates/investor/investor_view.html',
            controller: 'Investor_viewCtrl'
        });
    }])
    .controller('Investor_viewCtrl', function ($scope, $http, $location, riskService,investorCashCtrlService,$filter,$routeParams) {
        $scope.planId;
         // 检测登录
        var userId = localStorage.userId;
        var token = localStorage.token;
        if (token == undefined) {
            alert("您尚未登录！");
            self.location = "/manageSystem/#/login";
            return 0;
        }


        $scope.Plan_recommendUser = localStorage.Plan_recommendUser
        $scope.Plan_userId = localStorage.Plan_userId
        /**用传过来的用户ID去查询该投资人的信息**/
        $scope.cashData={
            token:token
        }
        // $scope.cashData['userId']=$location.search().userId;
        var data=angular.copy($scope.cashData);
        $http.get(HOST_URL + '/user/'+$routeParams.id+'/info',
            {
                params:data ,
            } ,
            {
                headers:{
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        ).success(function(responseData){
            if(responseData.resultCode=="0"){
               $scope.investor= responseData.resultData;
            }
        });
        /**会员投资**/
/*        $http.get(HOST_URL + '/investor/'+$location.search().userId+'/investment?token='+token).success(function(data){
            $scope.investmentList = data;
            $scope.selectPage(1);
        });*/
        
        /**会员流水**/
       /* $http.get(HOST_URL + '/investor/'+$location.search().userId+'/tradeRecord').success(function(data){
            //alert(JSON.stringify(data));
            $scope.tradeRecordList = data;
            $scope.selectPage1(1);
        });*/
    
        /**会员投资的分页**/
/*         $scope.selectPage = function (page) {
            if($scope.investmentList==null||$scope.investmentList.length==0){
                $scope.itemList = [];
                $scope.nowPage = 0;
                $scope.pages = 0;
                $scope.isShowDot = false;
                $scope.totalPages = 0;
                $scope.startIndex = 0;
            }else{
                var tmpObject = IndexService.selectPages(page, $scope.investmentList, 5);
                $scope.itemList = tmpObject.itemList;
                $scope.nowPage = tmpObject.nowPage;
                $scope.pages = tmpObject.pages;
                $scope.isShowDot = tmpObject.isShowDot;
                $scope.totalPages = tmpObject.totalPages;
                $scope.startIndex = tmpObject.startIndex;
            }
        }*/
        $scope.userId = $location.search().userId;
        $scope.selectPage = function (page) {
            $scope.tabCurrentPage = page;
            if (page <= 1) {
                page = 1;
            } else if (page >= $scope.totalPages) {
                page = $scope.totalPages;
            }


                $scope.cashData= {
                     adminId:userId,
                token: token,
                page: 1,
                limit: 15,
               userId:$routeParams.id
                };
                $scope.cashData['planId'] = $scope.planId;
                $scope.cashData['page'] = page;
                var data = angular.copy($scope.cashData);
                // riskService.selectPage('/investor/'+$scope.userId+'/investment',  data).then(function () {
                investorCashCtrlService.selectPage('/planInvestment/list',  data).then(function () {
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
        $scope.selectPage(1);
        $scope.tabCurrentPage = 1;
        $scope.clickTab = function(){
             $scope.selectPage($scope.tabCurrentPage);
        }
        
        /**会员流水的分页**/
      /*  $scope.selectPage1 = function (page) {
            if($scope.tradeRecordList==null||$scope.tradeRecordList.length==0){
                $scope.itemList1 = [];
                $scope.nowPage1 = 0;
                $scope.pages1 = 0;
                $scope.isShowDot1 = false;
                $scope.totalPages1 = 0;
                $scope.startIndex1 = 0;
            }else{
                var tmpObject = IndexService.selectPages(page, $scope.tradeRecordList, 5);
                $scope.itemList1 = tmpObject.itemList;
                $scope.nowPage1 = tmpObject.nowPage;
                $scope.pages1 = tmpObject.pages;
                $scope.isShowDot1 = tmpObject.isShowDot;
                $scope.totalPages1 = tmpObject.totalPages;
                $scope.startIndex1 = tmpObject.startIndex;
            }
        }*/
      // 流水记录tab页
        $scope.selectPage1 = function (page) {
            $scope.tabCurrentPage1 = page;
            if (page <= 1) {
                page = 1;
            } else if (page >= $scope.totalPages1) {
                page = $scope.totalPages1;
            }

                $scope.cashData1 = {
                token: token,
                page: 1,
                limit: 15,
//              startDate:'',
//              endDate:'',
               userId:$routeParams.id
                };

                $scope.cashData1['page'] = page;
//              $scope.cashData1['startDate']=$scope.startDate;
//              $scope.cashData1['endDate']=$scope.endDate;
              var data = angular.copy($scope.cashData1);
//              data.startDate=$filter('date')(data.startDate, "yyyyMMddHHmmss");
//              data.endDate=$filter('date')(data.endDate, "yyyyMMddHHmmss");
                investorCashCtrlService.selectPage('/user/account/tradeRecord/list', data).then(function () {
                    var tmpObject1 = investorCashCtrlService.getResult();
                    $scope.itemList1 = tmpObject1.itemList;
                    $scope.nowPage1 = tmpObject1.nowPage;
                    $scope.pages1 = tmpObject1.pages;
                    $scope.sumCount1=tmpObject1.sumCount;
                    $scope.isShowDot1 = tmpObject1.isShowDot;
                    $scope.totalPages1 = tmpObject1.totalPages;
                    $scope.startIndex1 = tmpObject1.startIndex;
                });
            
        };
        $scope.tabCurrentPage1 = 1;
        $scope.clickTab1 = function(){
            $scope.searchInvestorDetail ($scope.tabCurrentPage1);
        };
        // 还款记录tab页
        $scope.selectPage2 = function (page) {
            $scope.tabCurrentPage2 = page;
            if (page <= 1) {
                page = 1;
            } else if (page >= $scope.totalPages2) {
                page = $scope.totalPages2;
            }

            $scope.cashData2 = {
                 adminId:userId,
                token: token,
                page: 1,
                limit: 15,
//              startDate:'',
//              endDate:'',
                userId:$routeParams.id
            };

            $scope.cashData2['page'] = page;
//              $scope.cashData1['startDate']=$scope.startDate;
//              $scope.cashData1['endDate']=$scope.endDate;
            var data = angular.copy($scope.cashData2);
//              data.startDate=$filter('date')(data.startDate, "yyyyMMddHHmmss");
//              data.endDate=$filter('date')(data.endDate, "yyyyMMddHHmmss");
            investorCashCtrlService.selectPage('/invest/repay/list', data).then(function () {
                var tmpObject2 = investorCashCtrlService.getResult();
                $scope.itemList2 = tmpObject2.itemList;
                $scope.nowPage2 = tmpObject2.nowPage;
                $scope.pages2 = tmpObject2.pages;
                $scope.sumCount2=tmpObject2.sumCount;
                $scope.isShowDot2 = tmpObject2.isShowDot;
                $scope.totalPages2 = tmpObject2.totalPages;
                $scope.startIndex2 = tmpObject2.startIndex;
            });

        };
        $scope.tabCurrentPage2 = 1;
        $scope.clickTab2 = function(){
            $scope.selectPage2($scope.tabCurrentPage2);

        };
        // 充值记录
        $scope.selectPage3 = function (page) {
            $scope.tabCurrentPage3 = page;
            if (page <= 1) {
                page = 1;
            } else if (page >= $scope.totalPages3) {
                page = $scope.totalPages3;
            }

            $scope.cashData3 = {
                adminId:userId,
                token: token,
                page: 1,
                limit: 15,
//              startDate:'',
//              endDate:'',
                userId:$routeParams.id
            };

            $scope.cashData3['page'] = page;
            var data = angular.copy($scope.cashData3);
            investorCashCtrlService.selectPage('/user/recharge/list', data).then(function () {
                var tmpObject3 = investorCashCtrlService.getResult();
                $scope.itemList3 = tmpObject3.itemList;
                $scope.nowPage3 = tmpObject3.nowPage;
                $scope.pages3 = tmpObject3.pages;
                $scope.sumCount3=tmpObject3.sumCount;
                $scope.isShowDot3 = tmpObject3.isShowDot;
                $scope.totalPages3 = tmpObject3.totalPages;
                $scope.startIndex3 = tmpObject3.startIndex;
            });

        };
        $scope.tabCurrentPage3 = 1;
        $scope.clickTab3 = function(){
            $scope.selectPage3($scope.tabCurrentPage3);

        };
        // 提现记录
        $scope.selectPage4 = function (page) {
            $scope.tabCurrentPage4= page;
            if (page <= 1) {
                page = 1;
            } else if (page >= $scope.totalPages4) {
                page = $scope.totalPages4;
            }

            $scope.cashData4 = {
                 adminId:userId,
                token: token,
                page: 1,
                limit: 15,
//              startDate:'',
//              endDate:'',
                userId:$routeParams.id
            };

            $scope.cashData4['page'] = page;
            var data = angular.copy($scope.cashData4);
            investorCashCtrlService.selectPage('/user/withdraw/list', data).then(function () {
                var tmpObject4 = investorCashCtrlService.getResult();
                $scope.itemList4 = tmpObject4.itemList;
                $scope.nowPage4 = tmpObject4.nowPage;
                $scope.pages4 = tmpObject4.pages;
                $scope.sumCount4=tmpObject4.sumCount;
                $scope.isShowDot4 = tmpObject4.isShowDot;
                $scope.totalPages4 = tmpObject4.totalPages;
                $scope.startIndex4 = tmpObject4.startIndex;
            });

        };
        $scope.tabCurrentPage4= 1;
        $scope.clickTab4 = function(){
            $scope.selectPage4($scope.tabCurrentPage4);

        };
        // 银行卡记录
        $scope.selectPage5 = function (page) {
            $scope.tabCurrentPage5= page;
            if (page <= 1) {
                page = 1;
            } else if (page >= $scope.totalPages5) {
                page = $scope.totalPages5;
            }

            $scope.cashData5 = {
                 adminId:userId,
                token: token,
                page: 1,
                limit: 15,
//              startDate:'',
//              endDate:'',
                userId:$routeParams.id
            };

            $scope.cashData5['page'] = page;
            var data = angular.copy($scope.cashData5);
            investorCashCtrlService.selectPage('/user/card/list', data).then(function () {
                var tmpObject5 = investorCashCtrlService.getResult();
                $scope.itemList5 = tmpObject5.itemList;
                $scope.nowPage5 = tmpObject5.nowPage;
                $scope.pages5 = tmpObject5.pages;
                $scope.sumCount5=tmpObject5.sumCount;
                $scope.isShowDot5 = tmpObject5.isShowDot;
                $scope.totalPages5 = tmpObject5.totalPages;
                $scope.startIndex5 = tmpObject5.startIndex;
            });

        };
        $scope.tabCurrentPage5= 1;
        $scope.clickTab5 = function(){
            $scope.selectPage5($scope.tabCurrentPage5);

        };
        /**根据条件查询**/
         // $scope.keyword='';
        $scope.searchInvestorDetail = function () {
            // $scope.cashData1['keyword']=$scope.keyword;
            $scope.selectPage1($scope.tabCurrentPage1);
        };

    })

    .factory('Investor_viewService', function ($http) {
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
                return $http.get(HOST_URL + "/user/investor_view/rankings").success(function (responseData) {
                    rankingList = responseData;
                }).error(function () {

                });
            },
            getRankigList: function () {
                return rankingList;
            }
        }
    })
;