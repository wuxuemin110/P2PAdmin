'use strict';

angular.module('myApp.recharge_list', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/money/recharge_list', {
            templateUrl: 'templates/money/recharge_list.html',
            controller: 'recharge_listCtrl'
        });
    }])

    .controller('recharge_listCtrl', function ($scope, $http, $mdDialog, riskService,investorCashCtrlService,$filter) {
        var token = localStorage.token;
        var userId=localStorage.userId;
         $scope.keyword = '';
        // $scope.status = '';
        $http.get(HOST_URL+"/statistics/channel/list?token="+token+"&adminId="+userId).success(function(responseData) {
            if(responseData.resultCode=="0"){
                $scope.roleOptions=responseData.resultData;
            }
        });
        $scope.searchRecharge = function () {
            // $scope.cashData['status']=input;
            // console.log(input)
            // $scope.cashData['startDate']=$scope.startDate;
            // $scope.cashData['endDate']=$scope.endDate;
      // $scope.cashData['channel'] = $scope.channel;
            $scope.cashData['keyword']=$scope.keyword;
            $scope.selectPage(1);
        }
        $scope.cashData = {
             adminId:userId,
             status:status,
            token: token,
            page: 1,
            limit: 20,
             startDate:"",
            endDate:"",
            // purchaseTime: null
             keyword: ""
         // channel:"",
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
            // console.log(data)

            data. startDate=$filter('date')(data. startDate, "yyyyMMddHHmmss");
            data.endDate=$filter('date')(data.endDate, "yyyyMMdd");
            if(data.endDate !=""){
                data.endDate +="235959";
            }

            investorCashCtrlService.selectPage("/user/recharge/list",data).then(function () {
                var tmpObject = investorCashCtrlService.getResult();
                $scope.itemList = tmpObject.itemList;
                $scope.nowPage = tmpObject.nowPage;
                $scope.pages = tmpObject.pages;
                $scope.sumCount= tmpObject.sumCount;
                $scope.isShowDot = tmpObject.isShowDot;
                $scope.totalPages = tmpObject.totalPages;
                $scope.startIndex = tmpObject.startIndex;
            });
        };
        $scope.searchRecharge(1);

$scope.cashData1={};

        $scope.gotoExport=function(){
            $scope.cashData1.channel= $("#channelNum").val();
            // $scope.cashData1['channel'] = $scope.cashData.channel;
            $scope.cashData1['status'] = $scope.cashData.status;
            $scope.cashData1['keyword']=$scope.keyword;
            $scope.cashData1['startDate']=$scope.cashData.startDate;
            $scope.cashData1['endDate']=$scope.cashData.endDate;
            var data1 = angular.copy($scope.cashData1);
            // data.startDate=$filter('date')(data.startDate, "yyyyMMddHHmmss");
            // data.endDate=$filter('date')(data.endDate, "yyyyMMddHHmmss");

            // var str= $("#myTime").val();
            // var reg = /\/| |:/g;
            // data1.startDate=str.replace(reg,'');
            // var str1= $("#myTime1").val();
            // var reg1 = /\/| |:/g;
            // data1.endDate= str1.replace(reg1,'');

            data1.startDate =$filter('date')(data1.startDate, "yyyyMMddHHmmss");
            data1.endDate=$filter('date')(data1.endDate, "yyyyMMdd");
            if(data1.endDate !=""){
                data1.endDate +="235959";
            }


            // console.log(data1);
            // var str2= $("#Time").val()
            // var reg2 = /\/| |:/g;

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
            // if(data.status==""){
            //     $mdDialog.show(
            //         $mdDialog.alert()
            //             .clickOutsideToClose(true)
            //             .title('提示')
            //             .textContent("请选择状态")
            //             .ok('确定')
            //     );
            //     return;
            // }
            window.open(HOST_URL + "/user/recharge/list/export?"+"adminId="+userId+"&startDate="+data1.startDate+"&endDate="+data1.endDate+"&status="+data1.status+"&channel="+data1.channel+"&keyword="+data1.keyword+"&token=" + token );
            // window.open(HOST_URL + "user/" + userId + "/investment/" + planId + "/pdf?token=" + token);
        }



    });