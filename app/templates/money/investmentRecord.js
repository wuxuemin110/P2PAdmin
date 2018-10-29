'use strict';

angular.module('myApp.investmentRecord', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/money/investmentRecord', {
            templateUrl: 'templates/money/investmentRecord.html',
            controller: 'investmentRecordCtrl'
        });
    }])

    .controller('investmentRecordCtrl', function ($scope, $http, $mdDialog, riskService,investorCashCtrlService,$filter) {
        var token = localStorage.token;
        var userId=localStorage.userId;
         if (token == undefined) {
            alert("您尚未登录！");
            self.location = "/manageSystem/#/login";
        }
        $http.get(HOST_URL+"/statistics/channel/list?token="+token+"&adminId="+userId).success(function(responseData) {
            if(responseData.resultCode=="0"){
                $scope.roleOptions=responseData.resultData;

            }
        });

        $scope.searchRecharge = function (keyword ,smallMoney,bigMoney) {
            // $scope.cashData['startTime']=$scope.startTime ;
            // $scope.cashData['endTime']=$scope.endTime ;
            $scope.cashData['keyword']=$scope.keyword;
            // $scope.cashData['channel']=$scope.channel;
            // $scope.cashData['smallMoney']=$scope.smallMoney;
            // $scope.cashData['bigMoney']=$scope.bigMoney;
            // $scope.cashData.smallMoney=$("#myMoney").val();
            // $scope.cashData.bigMoney=$("#myMoney1").val();
            $scope.cashData.keyword=$("#kws").val();
            if( userId == 144573){
                $scope.cashData.channel = 'zj30'
            }
            $scope.selectPage(1);
        }
        $scope.cashData = {
              adminId:userId,
            token: token,
            page: 1,
            limit: 20,
            startDate :"",
            endDate:"",
            keyword:"",
            recomCode:'',
            // smallMoney:"",
            // bigMoney:""
            // channel:"",

        };

        $scope.selectPage = function (page) {
            if (page <= 1) {
                page = 1;
            } else if (page >= $scope.totalPages) {
                page = $scope.totalPages;
            }
            $scope.cashData['page'] = page;
            var data=angular.copy($scope.cashData)
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

            data.startDate =$filter('date')(data.startDate , "yyyyMMddHHmmss");
            data.endDate=$filter('date')(data.endDate, "yyyyMMdd");
            if(data.endDate!="") {
                data.endDate += "235959";
            }
            investorCashCtrlService.selectPage("/invest/list",data).then(function () {
                var tmpObject = investorCashCtrlService.getResult();
                $scope.itemList = tmpObject.itemList;

                if (userId == 144573) {
                    var arr = [];
                    $scope.itemList.forEach(function(index, val) {
                        
                        if (index.channel == 'zj30') {

                           
                            arr.push(index)
                        }
                    })
                    $scope.itemList == arr
            
                }

               
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
        //    $scope.cashData1['smallMoney']=$("#myMoney").val();
        // $scope.cashData1.bigMoney=$("#myMoney1").val();
        // $scope.cashData1.keyword=$("#kws").val();
        }

        $scope.gotoExport=function(){
            // console.log(  $scope.cashData1)
            // $scope.cashData1['smallMoney']=$("#myMoney").val();
            // $scope.cashData1.bigMoney=$("#myMoney1").val();
            $scope.cashData1.recomCode=$("#code").val();
            $scope.cashData1.keyword=$("#kws").val();
            $scope.cashData1.channel=$("#channelNum").val();
            // $scope.cashData1['status'] = input;
            $scope.cashData1['startDate']=$scope.cashData.startDate;
            $scope.cashData1['endDate']=$scope.cashData.endDate;
            var data1= angular.copy($scope.cashData1);
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

            data1.startDate =$filter('date')(data1.startDate, "yyyyMMddHHmmss");
            data1.endDate=$filter('date')(data1.endDate, "yyyyMMdd");

            if(data1.endDate!=""){
                data1.endDate +="235959";
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
            window.open(HOST_URL + "/invest/list/export?"+"adminId="+userId+"&startDate="+data1.startDate+"&endDate="+data1.endDate+"&recomCode="+data1.recomCode+"&channel="+data1.channel+"&keyword="+data1.keyword+"&token=" + token );
            // window.open(HOST_URL + "user/" + userId + "/investment/" + planId + "/pdf?token=" + token);
        }





    });