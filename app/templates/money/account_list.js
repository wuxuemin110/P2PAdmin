'use strict';

angular.module('myApp.account_list', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/money/account_list', {
            templateUrl: 'templates/money/account_list.html',
            controller: 'account_listCtrl'
        });
    }])
    .controller('account_listCtrl', function ($http,$scope, $rootScope, $mdDialog,investorCashCtrlService,$filter) {
        // var role = $rootScope.role = parseInt(localStorage.getItem('role'));
        // $scope.plan_view = {};
        //
		
        // 检测登录
        var userId = localStorage.userId;
        var token = localStorage.token;
      
        if (token == undefined) {
            alert("您尚未登录！");
            self.location = "/manageSystem/#/login";
        }

        $http.get(HOST_URL+"/statistics/channel/list?token="+token+"&adminId="+userId).success(function(responseData) {
            if(responseData.resultCode=="0"){
                $scope.roleOptions=responseData.resultData;
                 console.log($scope.roleOptions)
                // for(var i=0;i<$scope.roleOptions.length;i++){
                //     console.log($scope.roleOptions[i])
                // }
            }
        });

        $scope.keyword = '';
        $scope.searchInvestor = function (keyword) {
            $scope.cashData['keyword']=$scope.keyword;
            $scope.selectPage(1);
        }

        // 查询条件
        $scope.cashData = {
            adminId:userId,
            token: token,
            page: 1,
            limit: 20,
            startDate:'',
            endDate:''
        };
        $scope.selectPage = function (page) {
            if (page <= 1) {
                page = 1;
            } else if (page >= $scope.totalPages) {
                page = $scope.totalPages;
            }
            $scope.cashData['page'] = page;
            var data = angular.copy($scope.cashData);
            // console.log(data);
            data.startDate=$filter('date')(data.startDate, "yyyyMMddHHmmss");
            data.endDate=$filter('date')(data.endDate, "yyyyMMdd");
            if(data.endDate!=""&&data.endDate!=undefined&&data.endDate!=null) {
                data.endDate += "235959";
            }
            console.log(data);
            investorCashCtrlService.selectPage("/user/account/list", data).then(function () {
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

        $scope.cashData1={
            token:token
        }

        $scope.gotoExport=function(){

            $scope.cashData1.keyword= $("#kws").val();
            $scope.cashData1.channel= $("#channelNum").val();
            $scope.cashData1['startDate']=$scope.cashData.startDate;
            $scope.cashData1['endDate']=$scope.cashData.endDate;

            var data1= angular.copy($scope.cashData1);
            data1.startDate=$filter('date')(data1.startDate, "yyyyMMddHHmmss");
            data1.endDate=$filter('date')(data1.endDate, "yyyyMMdd");
            if(data1.endDate!=""&&data1.endDate!=undefined&&data1.endDate!=null) {
                data1.endDate += "235959";
            }
            console.log(data1);
            window.open(HOST_URL + "/user/account/list/export?"+"adminId="+userId+"&keyword="+data1.keyword+"&channel="+data1.channel+"&startDate="+data1.startDate+"&endDate="+data1.endDate+"&token=" + token );
            // window.open(HOST_URL + "user/" + userId + "/investment/" + planId + "/pdf?token=" + token);
        }

    });