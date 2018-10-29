'use strict';

angular.module('myApp.grantPocket', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/pocket/grantPocket', {
            templateUrl: 'templates/pocket/grantPocket.html',
            controller: 'grantPocketCtrl'
        });
    }])

    .controller('grantPocketCtrl', function ($scope, $http, $mdDialog, riskService,investorCashCtrlService,$filter,userEditService) {
        var token = localStorage.token;

        $http.get(HOST_URL+"/sys/voucher/rules?status="+0+"&token="+token)
            .success(function(responseData) {
                $scope.roleOptions = responseData.resultData;


            });
        userEditService.synTradeRecords(token).success(function () {
            $scope.tradeRecords = userEditService.getTradeRecords();
            // console.log($scope.tradeRecords);
            // $scope.tradeRecords.id= $scope.tradeRecords.id+"";
        });
        $scope.updateUser = function(tradeRecords){



           var data1=$scope.tradeRecords.phones.replace(/[\r\n]/g,",").split(",");
            // console.log(data1);
            // console.log(arr);
            // data.add(arr);
           var dataa =JSON.stringify(data1).replace(/\[|]|"/g,"");
         // console.log(dataa);
            var data={
                token:token,
                siteConfigId:$scope.tradeRecords.id,
               phones:dataa

            };
            // console.log(data);
            $http.post(HOST_URL+"/sys/voucher/grant",
                $.param(data),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            ).success(function(responseData){
if(responseData.resultCode=="0"){
    $mdDialog.show(
        $mdDialog.alert()
            .clickOutsideToClose(true)
            .title('提示')
            .textContent(responseData['resultMsg'])
            .ok('确定')
    );
}

                // history.go(-1);
            }).error(function(responseData){
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent(responseData['resultMsg'])
                        .ok('确定')
                );

            });
        }
         // $scope.keyword = '';
        // $scope.status = '';
        // $scope.searchRecharge = function () {
        //     // $scope.cashData['status']=input;
        //     // console.log(input)
        //     $scope.cashData['startDate']=$scope.startDate;
        //     $scope.cashData['endDate']=$scope.endDate;
        // // $scope.cashData['status'] = $scope.status;
        //     $scope.cashData['keyword']=$scope.keyword;
        //     $scope.selectPage(1);
        // }
        // $scope.cashData = {
        //     status:status,
        //     token: token,
        //     page: 1,
        //     limit: 20,
        //      startDate:"",
        //     endDate:"",
        //     // purchaseTime: null
        //      keyword: "",
        // };
        //
        // $scope.selectPage = function (page) {
        //     if (page <= 1) {
        //         page = 1;
        //     } else if (page >= $scope.totalPages) {
        //         page = $scope.totalPages;
        //     }
        //     $scope.cashData['page'] = page;
        //     var data = angular.copy($scope.cashData);
        //     // data.startDate=$filter('date')(data.startDate, "yyyyMMddHHmmss");
        //     // data.endDate=$filter('date')(data.endDate, "yyyyMMddHHmmss");
        //     // var str= $("#myTime").val()
        //     // var reg = /\/| |:/g;
        //     // data.startDate=str.replace(reg,'');
        //     // var str1= $("#myTime1").val()
        //     // var reg1 = /\/| |:/g;
        //     // data.endDate= str1.replace(reg1,'');
        //     // console.log(data)
        //     investorCashCtrlService.selectPage("/user/recharge/list",data).then(function () {
        //         var tmpObject = investorCashCtrlService.getResult();
        //         $scope.itemList = tmpObject.itemList;
        //         $scope.nowPage = tmpObject.nowPage;
        //         $scope.pages = tmpObject.pages;
        //         $scope.sumCount= tmpObject.sumCount;
        //         $scope.isShowDot = tmpObject.isShowDot;
        //         $scope.totalPages = tmpObject.totalPages;
        //         $scope.startIndex = tmpObject.startIndex;
        //     });
        // };
        // $scope.searchRecharge(1);

// $scope.cashData1={}

        // $scope.gotoExport=function(){
        //     $scope.cashData1['status'] = $scope.cashData.status;
        //     $scope.cashData1['keyword']=$scope.keyword;
        //     $scope.cashData1['startDate']=$scope.cashData.startDate;
        //     $scope.cashData1['endDate']=$scope.cashData.endDate;
        //     var data1 = angular.copy($scope.cashData1);
        //     // data.startDate=$filter('date')(data.startDate, "yyyyMMddHHmmss");
        //     // data.endDate=$filter('date')(data.endDate, "yyyyMMddHHmmss");
        //     // var str= $("#myTime").val();
        //     // var reg = /\/| |:/g;
        //     // data1.startDate=str.replace(reg,'');
        //     // var str1= $("#myTime1").val();
        //     // var reg1 = /\/| |:/g;
        //     // data1.endDate= str1.replace(reg1,'');
        //     console.log(data1);
        //     // var str2= $("#Time").val()
        //     // var reg2 = /\/| |:/g;
        //
        //     // if(data.startDate==""||data.endDate==""){
        //     //     $mdDialog.show(
        //     //         $mdDialog.alert()
        //     //             .clickOutsideToClose(true)
        //     //             .title('提示')
        //     //             .textContent("请输入时间")
        //     //             .ok('确定')
        //     //     );
        //     //     return;
        //     // }
        //     // if(data.status==""){
        //     //     $mdDialog.show(
        //     //         $mdDialog.alert()
        //     //             .clickOutsideToClose(true)
        //     //             .title('提示')
        //     //             .textContent("请选择状态")
        //     //             .ok('确定')
        //     //     );
        //     //     return;
        //     // }
        //     window.open(HOST_URL + "/user/recharge/list/export?startDate="+data1.startDate+"&endDate="+data1.endDate+"&status="+data1.status+"&keyword="+data1.keyword+"&token=" + token );
        //     // window.open(HOST_URL + "user/" + userId + "/investment/" + planId + "/pdf?token=" + token);
        // }



    });