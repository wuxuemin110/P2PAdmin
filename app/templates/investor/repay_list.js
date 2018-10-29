'use strict';

angular.module('myApp.repay_list', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/investor/repay_list', {
            templateUrl: 'templates/investor/repay_list.html',
            controller: 'repay_listCtrl'
        });
    }])

    .controller('repay_listCtrl', function ($scope, $http, $mdDialog, riskService,investorCashCtrlService,$filter) {
        var adminId=localStorage.userId;
        var token = localStorage.token;
        $scope.planName= '';
        $scope.keyword="";
        $http.get(HOST_URL+"/statistics/channel/list?token="+token+"&adminId="+adminId).success(function(responseData) {
            if(responseData.resultCode=="0"){
                $scope.roleOptions=responseData.resultData;
                //  console.log($scope.roleOptions.length)
                // for(var i=0;i<$scope.roleOptions.length;i++){
                //     console.log($scope.roleOptions[i])
                // }
            }
        });
        $scope.searchRecharge = function (keyword) {
            $scope.cashData['planName']=$scope.planName;
            $scope.cashData['keyword']=$scope.keyword;
            // $scope.cashData['status']=$scope.status;
            $scope.selectPage(1);
        }
        $scope.cashData = {
       status:status,
            token: token,
            adminId:adminId,
            page: 1,
            limit: 20,
             startDate:"",
            endDate:"",
            keyword:""
            // channel:""
        };
        $scope.repayExamine = function(x){
  	 // console.log(x.status);
  	if(x.status==1){
        self.location = "/manageSystem/#/money/repayExamine/"+x.id;
    }

        };
        $scope.selectPage = function (page) {
            if (page <= 1) {
                page = 1;
            } else if (page >= $scope.totalPages) {
                page = $scope.totalPages;
            }
            $scope.cashData['page'] = page;
            var data = angular.copy($scope.cashData);


            // data.startDate=$filter('date')(data.startDate, "yyyyMMddHHmmss");
            // data.endDate=$filter('date')(data.endDate, "yyyyMMddHHmmss");
            // var str= $("#myTime").val()
            // var reg = /\/| |:/g;
            // data.startDate=str.replace(reg,'');
            // var str1= $("#myTime1").val()
            // var reg1 = /\/| |:/g;
            // data.endDate= str1.replace(reg1,'');


            data.startDate =$filter('date')(data.startDate, "yyyyMMddHHmmss");
            data.endDate=$filter('date')(data.endDate, "yyyyMMdd");
            if(data.endDate !=""){
                data.endDate +="235959";
            }


            investorCashCtrlService.selectPage("/invest/repay/list",data).then(function () {
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

};
        $scope.gotoExport=function(){
            // $scope.cashData1['channel'] = $scope.cashData.channel;
            $scope.cashData1['channel'] = $("#channelNum").val();
           $scope.cashData1['status'] = $scope.cashData.status;
            $scope.cashData1['startDate']=$scope.cashData.startDate;
            $scope.cashData1['endDate']=$scope.cashData.endDate;
           $scope.cashData1['planName']=$scope.planName;
            $scope.cashData1['keyword']=$scope.keyword;
            var data1 = angular.copy($scope.cashData1);
            // console.log(data1)
            // data.startDate=$filter('date')(data.startDate, "yyyyMMddHHmmss");
            // data.endDate=$filter('date')(data.endDate, "yyyyMMddHHmmss");
            // var str= $("#myTime").val()
            // var reg = /\/| |:/g;
            // data1.startDate=str.replace(reg,'');
            // var str1= $("#myTime1").val()
            // var reg1 = /\/| |:/g;
            // data1.endDate= str1.replace(reg1,'');
            console.log(data1);
            data1.startDate =$filter('date')(data1.startDate, "yyyyMMddHHmmss");
            data1.endDate=$filter('date')(data1.endDate, "yyyyMMdd");
            if(data1.endDate !=""){
                data1.endDate +="235959";
            }

            // console.log(data1)
            //
            // data.endDate= str1.replace(reg1,'');
            // console.log(data)
            //
            // data.endDate= str1.replace(reg1,'');
            // console.log(data)

            // var str2= $("#myTimes").val()
            // var reg2 = /\/| |:/g;
            // data.singleDate= str2.replace(reg2,'');
            window.open(HOST_URL + "/invest/repay/list/export?"+"adminId="+adminId+"&startDate="+data1.startDate+"&endDate="+data1.endDate+"&planName="+data1.planName+"&keyword="+data1.keyword+"&status="+data1.status+"&channel="+data1.channel+"&token=" + token );
            // window.open(HOST_URL + "user/" + userId + "/investment/" + planId + "/pdf?token=" + token);
        }



    });