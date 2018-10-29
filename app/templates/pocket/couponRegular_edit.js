'use strict';

angular.module('myApp.couponRegular_edit', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/pocket/couponRegular_edit/:id', {
            templateUrl: 'templates/pocket/couponRegular_edit.html',
            controller: 'couponRegular_editCtrl'
        });
    }])

    .controller('couponRegular_editCtrl', function ($scope,$rootScope, $http, $mdDialog,bannerListService,$routeParams,$filter,$location) {
        $scope.loan_edit = {};
        $scope.planCarLoan = {};
        $scope.carLoan = {};
        // 检测登录
        var userId = localStorage.userId;
        var token = localStorage.token;
        if(token == undefined) {
            alert("您尚未登录！");
            self.location = "/manageSystem/#/login";
        }

       $scope.cashData= {
            token: token,
           siteConfigId:$routeParams.id
        };
        var data=angular.copy($scope.cashData);
        $scope.selectUserId = function() {
            $http.get(HOST_URL + "/sys/voucher/rules/" + $routeParams.id, {
                params: data
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function(responseData) {
                if(responseData.resultCode == "0") {
                    console.log($scope.cashData);
                    $scope.cashData = responseData.resultData;
                    console.log($scope.cashData);
                    $scope.cashData.status = $scope.cashData.status + '';
                    $scope.cashData.type = $scope.cashData.type + '';
                    $scope.cashData.itemType = $scope.cashData.itemType + '';
                    // console.log(  $scope.cashData.itemType);
                    // console.log(  $scope.cashData.type);
                  if( $scope.cashData.type==0){
                      $scope.cashData.itemValue = $scope.cashData.itemValue / 100;
                  }else{
                      $scope.cashData.itemValue = $scope.cashData.itemValue / 10+"%";
                  }
                    $scope.cashData.itemCondition = $scope.cashData.itemCondition / 100;
                    var  beginTime  = $scope.cashData.beginTime + '';
                   beginTime = $filter("newDate")(beginTime, "yyyy/MM/dd HH:mm:ss");
                    $scope.beginTime = beginTime;
                   var endTime = $scope.cashData.endTime + '';
                    endTime = $filter("newDate")(endTime, "yyyy/MM/dd HH:mm:ss");
                    $scope.endTime = endTime;

                } else {
                    bannerListService.alertInfo(responseData);
                }
                //				angular.element('#selectPage').bSelectPage({
                //						showField: 'realName',
                //						keyField: 'id',
                //						data: $scope.selectUser
                //					});
            }).error(function(responseData) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent(responseData['resultMsg'])
                        .ok('确定')
                );
            })
        };
        $scope.selectUserId();

//    $scope.cashData1 = {
//             token: token,
//        type:"",
//        itemValue:$scope.cashData.itemValue,
//        itemCondition:$scope.cashData.itemCondition,
//        itemAmount:$scope.cashData.itemAmount,
//        itemRestricta:$scope.cashData.itemRestricta,
//        status:$scope.cashData.status,
//        beginTime:$scope.beginTime,
//        endTime:$scope.endTime,
//        itemName:$scope.cashData.itemName
//         };
//         var data1=angular.copy($scope.cashData1);
// console.log(data1);
        $scope.saveRegular = function() {
            var beginTime = $("#beginTime").val();
            var endTime = $("#endTime").val();
            $scope.cashData.beginTime = beginTime;
            $scope.cashData.endTime = endTime;
            var cashData = angular.copy($scope.cashData);
            cashData.itemCondition = $scope.cashData.itemCondition*100 ;
            cashData.itemAmount = $scope.cashData.itemAmount ;
            cashData.status = $scope.cashData.status ;
            cashData.itemName = $scope.cashData.itemName ;
            cashData.itemType = $scope.cashData.itemType ;
            if(cashData.type=='0'){
                cashData.itemValue = $scope.cashData.itemValue*100 ;
            }else{
                var strb=$scope.cashData.itemValue;
                console.log(strb);
                var regb=/%/;
                cashData.itemValue= strb.replace(regb,'');
                cashData.itemValue=cashData.itemValue*10;
                console.log(cashData.itemValue);
            }
            // cashData.itemValue = $scope.cashData.itemValue*100 ;
            cashData.token = token ;
            cashData.beginTime = $filter('newDate')(cashData.beginTime, "yyyyMMddHHmmss");
            cashData.endTime = $filter('newDate')(cashData.endTime, "yyyyMMddHHmmss");

            $http.post(HOST_URL + "/sys/voucher/rule/change/",
                $.param(cashData),
             {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function(responseData) {
                if(responseData.resultCode == "0") {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent("保存成功")
                            .ok('确定')
                    ).finally(function() {
                        $location.path('/pocket/couponRegular');
                    });
                } else {
                    bannerListService.alertInfo(responseData);
                }

            }).error(function(responseData) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('发生错误，错误信息如下：')
                        .textContent(
                            responseData['resultMsg']
                        )
                        .ok('确定')
                );
            });
        }




    });
