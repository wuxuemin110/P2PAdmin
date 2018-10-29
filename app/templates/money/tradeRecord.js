'use strict';

angular.module('myApp.tradeRecord', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/money/tradeRecord', {
            templateUrl: 'templates/money/tradeRecord.html',
            controller: 'tradeRecordCtrl'
        });
    }])

    .controller('tradeRecordCtrl', function ($scope, $http, $mdDialog, riskService,investorCashCtrlService,$filter) {
        var token = localStorage.token;
        var userId=localStorage.userId;
        // $scope.keyword = '';
        if(token == undefined) {
			alert("您尚未登录！");
			self.location = "/manageSystem/#/login";
		}

        	$scope.keyword=""

        $scope.searchRecharge = function (keyword) {
            $scope.cashData['keyword']=$scope.keyword;
            // $scope.cashData['startDate']=$scope.startDate;
            // $scope.cashData['endDate']=$scope.endDate;
            // $scope.cashData['status'] = input;
            $scope.selectPage(1);
        }
        $scope.cashData = {
            // status:status,
            adminId:userId,
            token: token,
            page: 1,
            limit: 20,
             startDate:"",
            endDate:"",
            // purchaseTime: null
            // keyword: ""
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
            // data.startDate=$filter('date')(data.startDate, "yyyyMMddHHmmss");
            // data.endDate=$filter('date')(data.endDate, "yyyyMMddHHmmss");
            // var str= $("#myTime").val()
            // var reg = /\/| |:/g;
            // data.startDate=str.replace(reg,'');
            // var str1= $("#myTime1").val()
            // var reg1 = /\/| |:/g;
            // data.endDate= str1.replace(reg1,'');

            data.startDate=$filter('date')(data.startDate, "yyyyMMddHHmmss");
            data.endDate=$filter('date')(data.endDate, "yyyyMMdd");
            if(data.endDate!=""){
                data.endDate +="235959";
            }

            investorCashCtrlService.selectPage("/user/account/tradeRecord/list",data).then(function () {
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
        $scope.searchRecharge(1);

        $scope.cashData1={
            token: token,
        }
        $scope.gotoExport=function(){
            $scope.cashData1['keyword']=$("#keyword").val();
            $scope.cashData1['startDate']=$scope.cashData.startDate;
            $scope.cashData1['endDate']=$scope.cashData.endDate;
            $scope.cashData1['state'] = $("#state").val();
            $scope.cashData1['type'] = $("#type").val();
            var data1= angular.copy($scope.cashData1);

            data1.startDate =$filter('date')(data1.startDate, "yyyyMMddHHmmss");
            data1.endDate=$filter('date')(data1.endDate, "yyyyMMdd");
            if(data1.endDate !=""){
                data1.endDate +="235959";
            }



            window.open(HOST_URL + "/user/account/tradeRecord/list/export?"+"adminId="+userId+"&startDate="+data1.startDate+"&endDate="+data1.endDate+"&keyword="+data1.keyword+"&type="+data1.type+"&state="+data1.state+"&token=" + token );
            // window.open(HOST_URL + "user/" + userId + "/investment/" + planId + "/pdf?token=" + token);
        }
        


    });