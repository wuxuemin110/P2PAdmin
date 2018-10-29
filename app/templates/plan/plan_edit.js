'use strict';

angular.module('myApp.plan_edit', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/plan/plan_edit/:id', {
            templateUrl: 'templates/plan/plan_edit.html',
            controller: 'plan_editCtrl'
        });
    }])

    .controller('plan_editCtrl', function($http, $filter, $mdDialog, $scope, $rootScope, $routeParams, plan_editService,$location) {
        var message;
        $scope.plan_edit = {};
       
        // 检测登录
        var userId = localStorage.userId;
        var token = localStorage.token;
        if(token == undefined) {
            alert("您尚未登录！");
            self.location = "/manageSystem/#/login";
        }

        $http.get(HOST_URL+"/plan/type?token="+token).success(function(responseData) {
            if(responseData.resultCode=="0"){
                $scope.roleOptions=responseData.resultData;
                // console.log( $scope.roleOptions);
                // //  console.log($scope.roleOptions);
                // for(var i=0;i<$scope.roleOptions.length;i++){
                //     console.log($scope.roleOptions[i])
                // }
            }
        });




        //查询借款人

        var selectUserIdData = {
            "token": token,
            "verified": true,
            page:1,
            limit:10000
        };
        $scope.selectUserId = function() {
            $http.get(HOST_URL + "/back/loan/list", {
                params: selectUserIdData
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function(responseData) {
                if(responseData.resultCode == "0") {
                    $scope.selectUser = responseData.resultData;
                        // console.log($scope.selectUser);
                    // var tag_data=[];
                    // for(var i =0 ;i<$scope.selectUser.length;i++){
                    //     tag_data[i]=$scope.selectUser[i];
                    //
                    // }
                    // $('#comboSelect').bComboSelect({
                    //     showField : 'title',
                    //     keyField : 'id',
                    //     data : tag_data
                    // });

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

            })
        };
        $scope.selectUserId();
        // 获取详情列表
        var tokenData = {
            token: token
        };
        $scope.getPlan = function() {
            $http.get(HOST_URL + "/back/plan/" + $routeParams.id, {
                params: tokenData
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function(responseData) {
                if(responseData.resultCode == "0") {
                    console.log(responseData)
                    $scope.plan_edit = responseData.resultData;
                     //console.log( $scope.plan_edit );

                }
                 $scope.plan_edit.loanId = $scope.plan_edit.loanId + '';
                $scope.plan_edit.rate = $scope.plan_edit.rate / 10;
                $scope.plan_edit.rasingRate = $scope.plan_edit.rasingRate / 10;
                $scope.plan_edit.status = $scope.plan_edit.status + '';
                $scope.plan_edit.type = $scope.plan_edit.type + '';
                $scope.plan_edit.state = $scope.plan_edit.state + '';
                $scope.plan_edit.amount = $scope.plan_edit.amount / 100;
                $scope.plan_edit.minAmount = $scope.plan_edit.minAmount / 100;
                $scope.plan_edit.maxAmount = $scope.plan_edit.maxAmount / 100;
                var purchaseTime = $scope.plan_edit.purchaseTime + "";
                purchaseTime = $filter("newDate")(purchaseTime, "                                                                                                                                                                                                                                                                                                                                                                                                                    yyyy/MM/dd HH:mm:ss");
                $scope.purchaseTime = purchaseTime;
                var showTime = $scope.plan_edit.showTime + "";

                showTime = $filter("newDate")(showTime, "yyyy/MM/dd HH:mm:ss");
                //$("#showTime").val(showTime);
                $scope.showTime = showTime;
                $scope.plan_edit.title=$scope.plan_edit.title+"";


                //$scope.plan_edit.level=$scope.plan_edit.sort;

                $scope.plan_edit.labelType = $scope.plan_edit.labelType + '';
                // $scope.plan_edit.cashback = $scope.plan_edit.cashback + '';
                $scope.plan_edit.rateType = $scope.plan_edit.rateType + '';
                $scope.plan_edit.specialPlan = $scope.plan_edit.specialPlan + '';
                $scope.plan_edit.repaymentType= $scope.plan_edit.repaymentType + '';
                // console.log($scope.plan_edit);
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
        };
        $scope.getPlan();

        $scope.carLoanImgs = [{
            file: null,
            link: null,
            base64: null,
            title: null
        }];
        $scope.carLoanImgsKey = [];

        // 上传图片
        $scope.uploadPlanFile = function(index) {

            var file;
            file = $scope.carLoanImgs[index].file;
            var reader = new FileReader();
            reader.onload = function(e) {
                $scope.$apply(function() {
                    $scope.carLoanImgs[index].base64 = e.target.result;
                });
            };

            reader.readAsDataURL(file);

            var formData = new FormData();
            formData.append('file', file);
            $http.post(HOST_URL + "/news/" + userId + "/upload?token=" + token, formData, {

                headers: {
                    'Content-Type': undefined
                },
                transformRequest: angular.identity
            }).success(function(data) {
                $scope.carLoanImgs[index].link = data.fileName;
                $scope.carLoanImgsKey[index] = {
                    oldKey: $scope.planCarLoan[1][index].link.substring(46),
                    newKey: data.fileName
                };
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent('上传成功')
                        .ok('确定')
                );
            });
        };


        // 提交按钮
        $scope.update = function() {

            var showTime = $("#showTime").val();
            var purchaseTime = $("#purchaseTime").val();
            var cashback=$("#cashback").val();
            
             $scope.plan_edit.sort =$scope.plan_edit.sort;
            $scope.plan_edit.cashback = cashback;
            $scope.plan_edit.purchaseTime = purchaseTime;
            $scope.plan_edit.showTime = showTime;
            var plan_edit = angular.copy($scope.plan_edit);
            plan_edit.level=$scope.plan_edit.level;
            plan_edit.loanId=$scope.plan_edit.loanId;
            plan_edit.rate = $scope.plan_edit.rate * 10;
            plan_edit.rasingRate = $scope.plan_edit.rasingRate * 10;
            if(plan_edit.amount==0){
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent("计划金额必须大于0")
                        .ok('确定')

                );
                return;
            }else{
                plan_edit.amount = plan_edit.amount * 100;
            }
            if(plan_edit.minAmount==0){
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent("单笔最小金额必须大于0")
                        .ok('确定')

                );
                return;
            }else{
                plan_edit.minAmount = plan_edit.minAmount * 100;
            }
            if(plan_edit.maxAmount==0){
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent("单笔最大金额必须大于0")
                        .ok('确定')

                );
                return;
            }else{
                plan_edit.maxAmount = plan_edit.maxAmount * 100;
            }

// //判断下拉框有没有被修改
//             if($("#comboSelect").val()==''){
//                 plan_edit.loanId=$scope.plan_edit.loanId;
//             }else{
//                 plan_edit.loanId=$("#comboSelect").val();
//             }


            // plan_edit.maxAmount = plan_edit.maxAmount * 100;
            plan_edit.purchaseTime = $filter('newDate')(plan_edit.purchaseTime, "yyyyMMddHHmmss");
            plan_edit.showTime = $filter('newDate')(plan_edit.showTime, "yyyyMMddHHmmss");
            //          var carLoan = angular.copy($scope.carLoan);
            //          carLoan.money = carLoan.money * 100;
            //          var loan = angular.copy($scope.carLoanImgsKey);
            //           var data = [carLoan, loan];
            plan_edit.token = token;

            //console.log(  plan_edit.planId);
           plan_edit.id= plan_edit.planId;

           console.log(plan_edit);
            $http.post(HOST_URL + "/back/plan/save",
                $.param(plan_edit), {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            ).success(function(responseData) {
                if(responseData.resultCode == "0") {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent("修改成功")
                            .ok('确定')
                    ).finally(function() {
                        self.location ='/manageSystem/#/plan/plan_view';
                    });
                    return;
                }
            }).error(function(responseData) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent("修改失败")
                        .ok('确定')
                );
            });

        };

    })

    .factory('plan_editService', function($http, $mdDialog) {
        var plan_edit;
        var planCarLoan;
        return {
            getplan_edit: function() {
                return plan_edit;
            },
            synCarLoan: function(planId) {
                return $http.get(HOST_URL + "/plan/" + planId + "/carLoan", {
                    cache: true
                }).success(function(responseData) {
                    planCarLoan = responseData;
                }).error(function() {});
            },
            getCarLoan: function() {
                var tmpLoan = [];
                tmpLoan.push(planCarLoan[0]);
                tmpLoan[1] = [];
                var tmpImgList = planCarLoan[1];
                for(var i = 0; i < tmpImgList.length; i++) {
                    var tmpArr = tmpImgList[i]['carLoanImg'].split('|');
                    var obj = {
                        link: tmpArr[0],
                        title: tmpArr[1]
                    };
                    tmpLoan[1].push(obj);
                }
                return tmpLoan;
            },

            alertError: function(message) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('发生错误，错误信息如下：')
                        .textContent(message)
                        .ok('确定')
                );
            },
            alertInfo: function(message) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent(message)
                        .ok('确定')
                );
            },
        }
    });