'use strict';

angular.module('myApp.investor', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/investor/investor', {
            templateUrl: 'templates/investor/investor.html',
            controller: 'InvestorCtrl'
        });
    }])
    .controller('InvestorCtrl', function($scope, $http, $rootScope, $location, $mdDialog, IndexService, riskService, investorCashCtrlService, $filter) {
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
        $scope.searchInvestor = function(keyword) {
            $scope.cashData['keyword'] = $scope.keyword;
            // $scope.cashData['beginTime']=$scope.beginTime ;
            // $scope.cashData['endTime']=$scope.endTime ;
            $scope.selectPage(1);
        }

        /**查询全部用户投资人**/
        /*        $http.get(HOST_URL + "/investor/list?token=" + token).success(function (responseData) {
                    $scope.investorList = responseData;
                    $scope.selectPage(1);
                });*/

        $http.get(HOST_URL + "/statistics/channel/list?token="+token+"&adminId="+userId).success(function(responseData) {
            if (responseData.resultCode == "0") {
                $scope.roleOptions = responseData.resultData;
                //  console.log($scope.roleOptions.length)
                // for(var i=0;i<$scope.roleOptions.length;i++){
                //     console.log($scope.roleOptions[i])
                // }
            }
        });

        /**查询全部用户投资人 分页**/
        $scope.cashData = {
            token: token,
            adminId:userId,
            page: 1,
            limit: 20,
            beginTime: "",
            endTime: "",
            // refereesRealName:'',
            refereesPhone: '',

        };
        $scope.selectPage = function(page) {
            if (page <= 1) {
                page = 1;
            } else if (page >= $scope.totalPages) {
                page = $scope.totalPages;
            }
            $scope.cashData['page'] = page;

            var data = angular.copy($scope.cashData);

            data.beginTime = $filter('date')(data.beginTime, "yyyyMMddHHmmss");
            data.endTime = $filter('date')(data.endTime, "yyyyMMdd");
            if (data.endTime != "") {
                data.endTime += "235959";
            }


            // console.log(data)
            // var str= $("#myTime").val()
            // var reg = /\/| |:/g;
            // data.beginTime=str.replace(reg,'');
            // var str1= $("#myTime1").val()
            // var reg1 = /\/| |:/g;
            // data.endTime= str1.replace(reg1,'');

            investorCashCtrlService.selectPage("/investor/list", data).then(function() { // "/investor/list/total",
                var tmpObject = investorCashCtrlService.getResult();
                $scope.itemList = tmpObject.itemList;
                
                // console.log($scope.itemList.sex );
                $scope.nowPage = tmpObject.nowPage;
                $scope.pages = tmpObject.pages;
                $scope.sumCount = tmpObject.sumCount;
                $scope.isShowDot = tmpObject.isShowDot;
                $scope.totalPages = tmpObject.totalPages;
                $scope.startIndex = tmpObject.startIndex;
            });
        };
        $scope.searchInvestor(1);
        // $scope.selectPage(1);
        $scope.viewDetail = function(x) {
            localStorage.setItem('Plan_recommendUser', x.recommendUser);
            localStorage.setItem('Plan_userId', x.userId);
            self.location = '/manageSystem/#/investor/investor_view/' + x.userId;
        }

        $scope.editDetail = function(x) {
            // self.location='/#/investor/investor_edit?userId='+x.userId;
            self.location = '/manageSystem/#/investor/investor_edit/' + x.id;
        }

        $scope.cashData1 = {
            token: token
        }

        $scope.gotoExport = function() {

            $scope.cashData1.keyword = $("#kws").val();
            $scope.cashData1.channel = $("#channelNum").val();
            $scope.cashData1['beginTime'] = $scope.cashData.beginTime;
            $scope.cashData1['endTime'] = $scope.cashData.endTime;
            // $scope.cashData1['refereesRealName']=$scope.cashData.refereesRealName;
            $scope.cashData1['refereesPhone'] = $scope.cashData.refereesPhone;
            var data1 = angular.copy($scope.cashData1);
            // data.startDate=$filter('date')(data.startDate, "yyyyMMddHHmmss");
            // data.endDate=$filter('date')(data.endDate, "yyyyMMddHHmmss");

            // var str= $("#myTime").val();
            // var reg = /\/| |:/g;
            // data1.beginTime=str.replace(reg,'');
            // var str1= $("#myTime1").val();
            // var reg1 = /\/| |:/g;
            // data1.endTime= str1.replace(reg1,'');

            data1.beginTime = $filter('date')(data1.beginTime, "yyyyMMddHHmmss");
            data1.endTime = $filter('date')(data1.endTime, "yyyyMMdd");
            if (data1.endTime != "") {
                data1.endTime += "235959";
            }

            // var str2= $("#Time").val();
            // var reg2 = /\/| |:/g;
            // data1.checkStartTime=str2.replace(reg2,'');
            // var str3= $("#Time1").val();
            // var reg3 = /\/| |:/g;
            // data1.checkEndTime=str3.replace(reg3,'');
            // if(data.startDate==""||data.endDate==""){
            //     $mdDialog.show(
            //         $mdDialog.alert()
            //             .clickOutsideToClose(true)
            //             .title('提示')
            //             .textContent("请输入时间")
            //             .ok('确定')
            //     );
            //     return;
            // }
            console.log(data1);
            window.open(HOST_URL + "/investor/list/export?"+"adminId="+userId+"&beginTime=" + data1.beginTime + "&endTime=" + data1.endTime + "&keyword=" + data1.keyword + "&refereesPhone=" + data1.refereesPhone + "&channel=" + data1.channel + "&token=" + token);
            // window.open(HOST_URL + "user/" + userId + "/investment/" + planId + "/pdf?token=" + token);
        }

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