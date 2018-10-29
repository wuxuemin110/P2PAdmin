'use strict';

angular.module('myApp.statistics_list', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/money/statistics_list', {
            templateUrl: 'templates/money/statistics_list.html',
            controller: 'statistics_listCtrl'
        });
    }])

    .controller('statistics_listCtrl', function($scope, $http, $mdDialog, riskService, investorCashCtrlService1, $filter) {
        var token = localStorage.token;
        var userId = localStorage.userId;
        $http.get(HOST_URL + "/statistics/channel/list?token=" + token).success(function(responseData) {
            if (responseData.resultCode == "0") {
                // var channelNum={}
                $scope.roleOptions = responseData.resultData;

            
                // for(var i=0;i<$scope.roleOptions.length;i++){
                //     console.log($scope.roleOptions[i]);
                // }
            }
        });
        $scope.cashData = {
            // channel:"",
            token: token,
            page: 1,
            limit: 20,
            startDate: "",
            endDate: "",
            singleDate: '',
            adminId:userId
        };
        $scope.searchRecharge = function() {
            // $scope.cashData['channel']=$scope.channel;
            // console.log(input)
            // $scope.cashData['startDate']=$scope.startDate;
            // $scope.cashData['endDate']=$scope.endDate;
            // $scope.cashData['status'] = input;
            $scope.selectPage(1);
        }


        $scope.selectPage = function(page) {
            if (page <= 1) {
                page = 1;
            } else if (page >= $scope.totalPages) {
                page = $scope.totalPages;
            }
            $scope.cashData['page'] = page;
            var data = angular.copy($scope.cashData);
            // console.log(data.startDate)
            data.singleDate = $filter('date')(data.singleDate, "yyyyMMddHHmmss");
            data.startDate = $filter('date')(data.startDate, "yyyyMMddHHmmss");
            data.endDate = $filter('date')(data.endDate, "yyyyMMdd");
            if (data.endDate != "") {
                data.endDate += "235959";
            }
            // var str2= $("#myTimes").val();
            // var reg2 = /\/| |:/g;
            // data.singleDate= str2.replace(reg2,'');
            // console.log($("#channelNum").val());
            // data.channel=$("#channelNum").val();
            // console.log(data)
            investorCashCtrlService1.selectPage("/statistics/total", data).then(function() {
                var tmpObject = investorCashCtrlService1.getResult();
                // console.log(tmpObject)
                tmpObject.itemList = tmpObject.itemList.sort(function(s, t) {
                    var a = s.channel.toLowerCase();
                    var b = t.channel.toLowerCase();
                    if (a < b) return -1;
                    if (a > b) return 1;
                    return 0;
                })

                $scope.itemList = tmpObject.itemList;
               
                $scope.nowPage = tmpObject.nowPage;
                $scope.pages = tmpObject.pages;
                $scope.sumCount = tmpObject.sumCount;
                $scope.isShowDot = tmpObject.isShowDot;
                $scope.totalPages = tmpObject.totalPages;
                $scope.startIndex = tmpObject.startIndex;
            });
        };
        $scope.searchRecharge(1);

        // console.log($("#channelNum").val())
        $scope.cashData1 = {};
        $scope.gotoExport = function(channel) {
            $scope.cashData1['channel'] = $("#channelNum").val();
            $scope.cashData1['startDate'] = $scope.cashData.startDate;
            $scope.cashData1['endDate'] = $scope.cashData.endDate;
            $scope.cashData1['singleDate'] = $scope.cashData.singleDate;
            var data1 = angular.copy($scope.cashData1);
            //
            // var str= $("#myTime").val();
            // var reg = /\/| |:/g;
            // data.startDate=str.replace(reg,'');
            // var str1= $("#myTime1").val();
            // var reg1 = /\/| |:/g;
            // data.endDate= str1.replace(reg1,'');
            // var str2= $("#myTimes").val();
            // var reg2 = /\/| |:/g;
            // data.singleDate= str2.replace(reg2,'');
            // // console.log(data)
            // console.log(data1.startDate)
            data1.singleDate = $filter('date')(data1.singleDate, "yyyyMMddHHmmss");
            data1.startDate = $filter('date')(data1.startDate, "yyyyMMddHHmmss");
            data1.endDate = $filter('date')(data1.endDate, "yyyyMMdd");
            if (data1.endDate != "") {
                data1.endDate += "235959";
            }
            // var str2= $("#myTimes").val();
            // var reg2 = /\/| |:/g;
            // data1.singleDate= str2.replace(reg2,'');
            // console.log($("#channelNum").val());
            // data1.channel=$("#channelNum").val();
            window.open(HOST_URL + "/statistics/export?startDate=" + data1.startDate + "&endDate=" + data1.endDate + "&channel=" + data1.channel + "&singleDate=" + data1.singleDate + "&token=" + token + "&adminId=" + userId);
            // window.open(HOST_URL + "user/" + userId + "/investment/" + planId + "/pdf?token=" + token);
        }



    });