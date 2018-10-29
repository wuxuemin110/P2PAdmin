'use strict';

angular.module('myApp.couponRegular_add', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/pocket/couponRegular_add', {
            templateUrl: 'templates/pocket/couponRegular_add.html',
            controller: 'couponRegular_addCtrl'
        });
    }])

    .controller('couponRegular_addCtrl', function ($scope,$rootScope, $http, $mdDialog,$location,bannerListService) {

        $scope.tradeRecord = {};
        $scope.userAccount = {};
        $scope.user={};
        // var tokenData={};
        // 检测登录
        var userId = localStorage.userId;
        var token = localStorage.token;
        // tokenData.token =token;
        // console.log(tokenData);

        if (token == undefined) {
            alert("您尚未登录！");
            self.location = "/manageSystem/#/login";
            return 0;
        }
        $scope.newPlan = {
            type: "10",
            itemValue: null,
            itemCondition: null,
            itemAmount: null,
            itemRestricta: null,
            status: "0",
            beginTime: null,
            endTime: null,
            itemName: null,
            itemType:'0',
            // length:null

        };
        $scope.saveRegular = function() {

//			console.log($scope.newPlan);  
//             var specialPlan = parseInt($scope.newPlan.specialPlan);
            // if(specialPlan == 0) {
            //     var yan = {
            //         rasingRate: null,
            //         labelType: 0, //标签类型
            //         specialPlanPassword: ""
            //     }
            // } else {
            //
            //     var yan = {
            //         labelType: 0, //标签类型
            //         rasingRate: null,
            //
            //     }
            //
            // }

            var plan = angular.copy($scope.newPlan);

            // plan.purchaseTime=$filter('date')(plan.purchaseTime, "yyyyMMddHHmmss");
            // plan.showTime=$filter('date')(plan.showTime, "yyyyMMddHHmmss");

            // var str1= $("#showTime").val();
            // var reg1 = /\/| |:/g;
            // plan.showTime= str1.replace(reg1,'');
            // var str2= $("#purchaseTime").val();
            // var reg2 = /\/| |:/g;
            // plan.purchaseTime= str2.replace(reg2,'');
            var str1= $("#myTimes").val();
            var reg1 = /\/| |:/g;
            plan.beginTime= str1.replace(reg1,'');
            var str2= $("#myTimes1").val();
            var reg2 = /\/| |:/g;
            plan.endTime= str2.replace(reg2,'');
            console.log(plan);
            for(var key in plan) {


                    if(plan[key] == null || plan[key] == "") {
                        // console.log(key);

                        function switchCase(key) {
                            var textContent;
                            switch(key) {
                                case "type":
                                    textContent = "红包类型";
                                    break;
                                case "itemValue":
                                    textContent = "券值";
                                    break;
                                case "itemCondition":
                                    textContent = "使用条件";
                                    break;
                                case "itemRestricta":
                                    textContent = "限制天数";
                                    break;
                                case "itemAmount":
                                    textContent = "发放数量";
                                    break;
                                // case "length":
                                //     textContent = "券有效期";
                                //     break;
                                case "itemName":
                                    textContent = "券规则名称";
                                    break;
                                case "status":
                                    textContent = "状态";
                                    break;
                                case "itemType":
                                    textContent = "券类型";
                                    break;
                                case "beginTime":
                                    textContent = "开始时间";
                                    break;
                                case "endTime":
                                    textContent = "结束时间";
                                    break;

                            }
                            return textContent;
                        }
                        var x = switchCase(key);
                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title('提示')
                                .textContent("请填写" + x + "!")
                                .ok('确定')
                        );
                        return
                    }

            }
            if( plan.type==0){
                plan.itemValue*=100;
            }else{
                plan.itemValue*=10;
            }
               plan.itemCondition *= 100;
            // plan.length *= 60*60*24;


            var data = plan;
            data.token = token;
            // console.log(data);
            $http.post(HOST_URL + "/sys/voucher/rule/change",
                $.param(data), {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            ).success(function(responseData) {
                if(responseData.resultCode=="0"){
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent(responseData['resultMsg'])
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
                        .title('提示')
                        .textContent(responseData['resultMsg'])
                        .ok('确定')
                );
            });
        };




    });