'use strict';

angular.module('myApp.firstInvestmentRecord', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/money/firstInvestmentRecord', {
            templateUrl: 'templates/money/firstInvestmentRecord.html',
            controller: 'firstInvestmentRecord'
        });
    }])

    .controller('firstInvestmentRecord', function($scope, $http, $mdDialog, riskService, investorCashCtrlService, $filter) {
        var token = localStorage.token;

        $http.get(HOST_URL + "/statistics/channel/list?token=" + token).success(function(responseData) {
            if (responseData.resultCode == "0") {
                $scope.roleOptions = responseData.resultData;

            }
        });

        $scope.searchRecharge = function(keyword, smallMoney, bigMoney) {
            // $scope.cashData['startTime']=$scope.startTime ;
            // $scope.cashData['endTime']=$scope.endTime ;
            $scope.cashData['keyword'] = $scope.keyword;
            // $scope.cashData['channel']=$scope.channel;
            // $scope.cashData['smallMoney']=$scope.smallMoney;
            // $scope.cashData['bigMoney']=$scope.bigMoney;
            // $scope.cashData.smallMoney=$("#myMoney").val();
            // $scope.cashData.bigMoney=$("#myMoney1").val();
            $scope.cashData.keyword = $("#kws").val();
            $scope.selectPage(1);
        }
        $scope.cashData = {
            token: token,
            page: 1,
            limit: 20,
            isFirst: '',
            startDate: "",
            endDate: "",
            keyword: "",
            recomCode: '',
            registerEnd: '',
            registerBegin: "",
            registerDesc: 1,
            //          startDateDesc:1
            // smallMoney:"",
            // bigMoney:""
            // channel:"",

        };
        $scope.cdata = {
            name: '注册时间',
            desc: '升序'
        }
        $("[name='name']").bootstrapSwitch({
            onText: "首投时间",
            offText: "注册时间",
            onColor: "success",
            offColor: "info",
            size: "small",
            onSwitchChange: function(event, state) {
                if (state == true) {
                    $scope.cdata.name = '首投时间';
                    delete $scope.cashData.registerDesc
                    if ($scope.cdata.desc == '升序') {
                        $scope.cashData.startDateDesc = 1
                    } else {
                        $scope.cashData.startDateDesc = 0
                    }
                } else {
                    $scope.cdata.name = '注册时间';
                    delete $scope.cashData.startDateDesc
                    if ($scope.cdata.desc == '升序') {
                        $scope.cashData.registerDesc = 1
                    } else {
                        $scope.cashData.registerDesc = 0
                    }
                }
            }
        });
        $("[name='desc']").bootstrapSwitch({
            onText: "降序",
            offText: "升序",
            onColor: "success",
            offColor: "info",
            size: "small",

            onSwitchChange: function(event, state) {
                if (state == true) {
                    $scope.cdata.desc = '降序';
                    if ($scope.cdata.name == '注册时间') {
                        $scope.cashData.registerDesc = 0
                    } else {
                        $scope.cashData.startDateDesc = 0
                    }
                } else {
                    $scope.cdata.desc = '升序';
                    if ($scope.cdata.name == '注册时间') {
                        $scope.cashData.registerDesc = 1
                    } else {
                        $scope.cashData.startDateDesc = 1
                    }
                }
            }
        });
        $scope.selectPage = function(page) {
            if (page <= 1) {
                page = 1;
            } else if (page >= $scope.totalPages) {
                page = $scope.totalPages;
            }
            $scope.cashData['page'] = page;
            var data = angular.copy($scope.cashData)
            // console.log(data)
            // if(data.smallMoney!=0){
            //     data.smallMoney*=100
            // }
            // if(data.bigMoney!=0){
            //     data.bigMoney*=100
            // }
            // var str= $("#myTime").val()
            // var reg = /\/| |:/g;
            // data.startDate=str.replace(reg,'');
            // var str1= $("#myTime1").val()
            // var reg1 = /\/| |:/g;
            // data.endDate= str1.replace(reg1,'');

            data.startDate = $filter('date')(data.startDate, "yyyyMMddHHmmss");
            data.endDate = $filter('date')(data.endDate, "yyyyMMdd");
            data.registerBegin = $filter('date')(data.registerBegin, "yyyyMMddHHmmss");
            data.registerEnd = $filter('date')(data.registerEnd, "yyyyMMdd");
            if (data.endDate != "") {
                data.endDate += "235959";
            }
            if (data.registerEnd != "") {
                data.registerEnd += "235959";
            }
            investorCashCtrlService.selectPage("/firstInvest/list", data).then(function() {
                var tmpObject = investorCashCtrlService.getResult();


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
        $scope.cashData1 = {
            token: token,
            //    $scope.cashData1['smallMoney']=$("#myMoney").val();
            // $scope.cashData1.bigMoney=$("#myMoney1").val();
            // $scope.cashData1.keyword=$("#kws").val();
        }

        $scope.gotoExport = function() {
            // console.log(  $scope.cashData1)
            // $scope.cashData1['smallMoney']=$("#myMoney").val();
            // $scope.cashData1.bigMoney=$("#myMoney1").val();
            $scope.cashData1.recomCode = $("#code").val();
            $scope.cashData1.keyword = $("#kws").val();
            $scope.cashData1.channel = $("#channelNum").val();
            // $scope.cashData1['status'] = input;
            $scope.cashData1['startDate'] = $scope.cashData.startDate;
            $scope.cashData1['endDate'] = $scope.cashData.endDate;
            var data1 = angular.copy($scope.cashData1);
            // if(data1.smallMoney!=0){
            //     data1.smallMoney*=100
            // }
            // if(data1.bigMoney!=0){
            //     data1.bigMoney*=100
            // }
            // data.startDate=$filter('date')(data.startDate, "yyyyMMddHHmmss");
            // data.endDate=$filter('date')(data.endDate, "yyyyMMddHHmmss");
            // var str= $("#myTime").val()
            // var reg = /\/| |:/g;
            // data1.startDate=str.replace(reg,'');
            // var str1= $("#myTime1").val()
            // var reg1 = /\/| |:/g;
            // data1.endDate= str1.replace(reg1,'');

            data1.startDate = $filter('date')(data1.startDate, "yyyyMMddHHmmss");
            data1.endDate = $filter('date')(data1.endDate, "yyyyMMdd");

            if (data1.endDate != "") {
                data1.endDate += "235959";
            }

            // var str2= $("#Time").val()
            // var reg2 = /\/| |:/g;
            // data1.checkStartTime=str2.replace(reg2,'');
            // var str3= $("#Time1").val()
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
            //  console.log(data1);
            window.open(HOST_URL + "/invest/list/export?startDate=" + data1.startDate + "&endDate=" + data1.endDate + "&recomCode=" + data1.recomCode + "&channel=" + data1.channel + "&keyword=" + data1.keyword + "&token=" + token);
            // window.open(HOST_URL + "user/" + userId + "/investment/" + planId + "/pdf?token=" + token);
        }





    });