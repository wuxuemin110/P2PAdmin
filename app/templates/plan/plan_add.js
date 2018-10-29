'use strict';

angular.module('myApp.plan_add', ['ngRoute']).directive('fileModel', ['$parse', function($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;
                element.bind('change', function() {
                    scope.$apply(function() {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/plan/plan_add', {
            templateUrl: 'templates/plan/plan_add.html',
            controller: 'plan_addCtrl'
        });
    }])

    .controller('plan_addCtrl', function($http, $mdDialog, $filter, $scope, plan_addService, $location) {
        // 检测登录
        var userId = localStorage.userId;
        var token = localStorage.token;

        if (token == undefined) {
            alert("您尚未登录！");
            self.location = "/manageSystem/#/login";
        }

        $http.get(HOST_URL + "/plan/type?token=" + token).success(function(responseData) {
            if (responseData.resultCode == "0") {
                $scope.roleOptions = responseData.resultData;
                // console.log( $scope.roleOptions);
                //  console.log($scope.roleOptions);
                // for(var i=0;i<$scope.roleOptions.length;i++){
                //     console.log($scope.roleOptions[i])
                // }
            }
        });


        //      $scope.carLoanImgs = [{file: null, link: null, base64: null, title: null}];
        $scope.newvalue=0;

        $scope.selectUser = {};
        $scope.newPlan = {
            name: null, //计划名称
            amount: null, //计划金额
            minAmount: null, //最小投资金额
            maxAmount: null, //最大投资金额
            type: '1', //计划类型
            rate: null, //利率
            rasingRate: null, //加息利率
            staging: null, //期数
            stagingUnit: null, //期数单位
            state: 4, //状态
            //level: 0, //排序
            labelType: 0, //标签类型
            //loanId: null, //借款ID
            status: 0, //状态
            rateType: null, //计息方式          
            purchaseTime: null, //可购买时间
            //			beginTime: null, //开始时间
            //			endTime: null, //结束时间
            showTime: null, //上线时间
            specialPlan: null, //是否定向计划
            specialPlanPassword: null, //定向标密码
            repaymentType: null, //还款方式

        };

        //查询借款人
        var selectUserIdData = {
            "token": token,
            "verified": true,
            page: 1,
            limit: 10000
        };
        $scope.selectUserId = function() {
            $http.get(HOST_URL + "/back/loan/list", {
                params: selectUserIdData
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function(responseData) {
                if (responseData.resultCode == "0") {
                    $scope.selectUser = responseData.resultData;
                    // var tag_data=[];
                    // for(var i =0 ;i<$scope.selectUser.length;i++){
                    //     tag_data[i]=$scope.selectUser[i];
                    // }
                    // console.log(tag_data);
                    // $('#comboSelect').bComboSelect({
                    //     showField : 'title',
                    //     keyField : 'id',
                    //     data : tag_data
                    // });
                    //					console.log($scope.selectUser);

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
                    .textContent(responseData.resultMsg)
                    .ok('确定')
                );
            })
        };
        $scope.selectUserId();

        //      $scope.funyou = [{
        //          id: null,
        //          planId: null,
        //          accountNumber: null,
        //          name: "",
        //          school: "",
        //          money: "",
        //          cardId: "",
        //          cardIdImg: "",
        //          studentIdImg: "",
        //          detail: "",
        //          idCardFile: null,
        //          schoolFile: null
        //      }];
        //
        //      $scope.carLoan = {
        //          id: null,
        //          planId: null,
        //          name: null,
        //          cardId: null,
        //          sex: null,
        //          frame: null,
        //          evaluationMoney:'0',
        //          addMoney:'0',
        //          repaymentEnsure:'无',
        //          money: null,
        //          birthday: null,
        //          vehicle: null,
        //          images: null,
        //          loanUsage: null,
        //          description: null,
        //          guarantee:null,
        //          bankDeposit:null,
        //          accountNumber:null,
        //          createdTime: null,
        //          updatedTime: null,
        //          loanId:null,
        //      };

        //      $scope.addCarLoanImg = function () {
        //          $scope.carLoanImgs.push({file: null, link: null, base64: null, title: null});
        //      };
        //
        //      $scope.delCarLoanImg = function () {
        //          $scope.carLoanImgs.pop();
        //      };
        //
        //      $scope.delectDEX = function (dex) {
        //          $scope.funyou.splice(dex, 1);
        //      };
        //      $scope.addDEX = function () {
        //          var obj = {
        //              name: "",
        //              cardId: "",
        //              school: "",
        //              money: "",
        //              cardIdImg: "",
        //              studentIdImg: "",
        //              detail: "",
        //              idCardFile: null,
        //              schoolFile: null
        //          };
        //          $scope.funyou.push(obj);
        //      };
        //
        //      $scope.setPlanAmount = function () {
        //          $scope.newPlan.amount = 0;
        //          for (var i = 0; i < $scope.funyou.length; i++) {
        //              $scope.newPlan.amount += $scope.funyou[i].money;
        //          }
        //      };

        // function
        $scope.uploadPlanFile = function(index, type) {

            var file;
            switch (type) {
                case 'id':
                    file = $scope.funyou[index].idCardFile;
                    break;
                case 'school':
                    file = $scope.funyou[index].schoolFile;
                    break;
                case 'car':
                    file = $scope.carLoanImgs[index].file;
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        $scope.$apply(function() {
                            $scope.carLoanImgs[index].base64 = e.target.result;

                        });
                    };
                    reader.readAsDataURL(file);
            }
            var formData = new FormData();
            formData.append('file', file);

            $http.post(HOST_URL + "/news/" + userId + "/upload?token=" + token, formData, {
                headers: {
                    'Content-Type': undefined
                },
                transformRequest: angular.identity
            }).success(function(data) {
                switch (type) {
                    case 'id':
                        $scope.funyou[index].cardIdImg = data.fileName;
                        $scope.funyou[index].idCardFile = null;
                        break;
                    case 'school':
                        $scope.funyou[index].studentIdImg = data.fileName;
                        $scope.funyou[index].schoolFile = null;
                        break;
                    case 'car':
                        $scope.carLoanImgs[index].link = data.fileName;
                }
                $mdDialog.show(
                    $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('提示')
                    .textContent('上传成功')
                    .ok('确定')
                );
            });
        };

        //      $scope.addStudentPlan = function () {
        //          var plan = angular.copy($scope.newPlan);
        //          var yan = {
        //              id: "",
        //              userId: "",
        //              level: "",
        //              maxAmount: "",
        //              minAmount: "",
        //              status: "",
        //              endTime: "",
        //              profitTimes: "",
        //              createdTime: "",
        //              updatedTime: "",
        //              
        //          }
        //          var plan = angular.copy($scope.newPlan);
        //          for (var key in plan) {
        //              if (!yan.hasOwnProperty(key)) {
        //                  if (plan[key] == null || plan[key] == "") {
        //                      $mdDialog.show(
        //                          $mdDialog.alert()
        //                              .clickOutsideToClose(true)
        //                              .title('提示')
        //                              .textContent("请填写完整信息！")
        //                              .ok('确定')
        //                      );
        //                      return
        //                  }
        //              }
        //          }
        //          plan.amount *= 100;
        //          plan.minAmount *= 100;
        //          plan.maxAmount *= 100;
        //
        //          var loans = [];
        //          yan = {
        //              id: "",
        //              planId: "",
        //              accountNumber: "",
        //              idCardFile: "",
        //              schoolFile: ""
        //          }
        //          for (var i = 0; i < $scope.funyou.length; i++) {
        //              var tmp = angular.copy($scope.funyou[i]);
        //              for (var key in tmp) {
        //                  if (!yan.hasOwnProperty(key)) {
        //                      if (tmp[key] == null || tmp[key] == "") {
        //                          $mdDialog.show(
        //                              $mdDialog.alert()
        //                                  .clickOutsideToClose(true)
        //                                  .title('提示')
        //                                  .textContent("请填写完整信息！")
        //                                  .ok('确定')
        //                          );
        //                          return;
        //                      }
        //                  }
        //              }
        //              tmp.money *= 100;
        //              loans.push(tmp);
        //          }
        //
        //          var data = [plan, loans];
        //
        //          $http.post(HOST_URL + "/plan/planAdd/student?token=" + token,
        //              data,
        //              {
        //                  headers: {
        //                      'Content-Type': 'application/json'
        //                  }
        //              }
        //          ).success(function (responseData) {
        //              $mdDialog.show(
        //                  $mdDialog.alert()
        //                      .clickOutsideToClose(true)
        //                      .title('提示')
        //                      .textContent(responseData.message)
        //                      .ok('确定')
        //              );
        //              history.go(-1);
        //          }).error(function (responseData) {
        //              $mdDialog.show(
        //                  $mdDialog.alert()
        //                      .clickOutsideToClose(true)
        //                      .title('发生错误，错误信息如下：')
        //                      .textContent(responseData.error)
        //                      .ok('确定')
        //              );
        //          });
        //      };
        $scope.addCarPlan = function() {

            //			console.log($scope.newPlan);
            var specialPlan = parseInt($scope.newPlan.specialPlan);
            if (specialPlan == 0) {
                var yan = {
                    rasingRate: null,
                    labelType: 0, //标签类型
                    specialPlanPassword: ""
                }
            } else {

                var yan = {
                    labelType: 0, //标签类型
                    rasingRate: null

                }

            }

            var plan = angular.copy($scope.newPlan);
            //console.log(plan);

            // plan.purchaseTime=$filter('date')(plan.purchaseTime, "yyyyMMddHHmmss");
            // plan.showTime=$filter('date')(plan.showTime, "yyyyMMddHHmmss");

            var str1 = $("#showTime").val();
            var reg1 = /\/| |:/g;
            plan.showTime = str1.replace(reg1, '');
            var str2 = $("#purchaseTime").val();
            var reg2 = /\/| |:/g;
            plan.purchaseTime = str2.replace(reg2, '');
            console.log(plan);
            // if(plan.labelType==2 &&plan.cashback==""){
            //    $mdDialog.show(
            //        $mdDialog.alert()
            //            .clickOutsideToClose(true)
            //            .title('提示')
            //            .textContent("请输入返现说明")
            //            .ok('确定')
            //    );
            //    return;
            // }
            if (plan.amount == 0) {
                $mdDialog.show(
                    $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('提示')
                    .textContent("计划金额必须大于0")
                    .ok('确定')
                );
                return;
            }
            if (plan.minAmount == 0) {
                $mdDialog.show(
                    $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('提示')
                    .textContent("单笔最小金额必须大于0")
                    .ok('确定')
                );
                return;
            }
            if (plan.maxAmount == 0) {
                $mdDialog.show(
                    $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('提示')
                    .textContent("单笔最大金额必须大于0")
                    .ok('确定')
                );
                return;
            }

            for (var key in plan) {
              
            	console.log(key)
                if (!yan.hasOwnProperty(key)) {
                    console.log(plan[key]);
                    if (plan[key] == null || plan[key] == ""  ) {
                        console.log(plan[key]);

                        function switchCase(key) {
                            var textContent;
                            switch (key) {
                                case "name":
                                    textContent = "计划名称";
                                    break;
                                case "amount":
                                    textContent = "计划金额";
                                    break;
                                case "minAmount":
                                    textContent = "最小投资金额";
                                    break;
                                case "maxAmount":
                                    textContent = "最大投资金额";
                                    break;
                                case "type":
                                    textContent = "计划类型";
                                    break;
                                case "rate":
                                    textContent = "利率";
                                    break;
                                case "rasingRate":
                                    textContent = "加息利率";
                                    break;
                                case "staging":
                                    textContent = "期数";
                                    break;
                                case "stagingUnit":
                                    textContent = "期数单位";
                                    break;
                                case "showTime":
                                    textContent = "上线时间";
                                    break;
                                case "state":
                                    textContent = "投资状态";
                                    break;
                               /* case "level":
                                    textContent = "排序";
                                    break;*/
                                case "labeltype":
                                    textContent = "标签类型";
                                    break;
                                    /*case "loanId":
                                    	textContent = "借款人";
                                    	break;*/
                                case "status":
                                    textContent = "状态";
                                    break;
                                case "rateType":
                                    textContent = "计息方式";
                                    break;
                                case "purchaseTime":
                                    textContent = "认购时间";
                                    break;
                                case "specialPlan":
                                    textContent = "是否定向计划";
                                    break;
                                case "specialPlanPassword":
                                    textContent = "定向标密码";
                                    break;
                                case "repaymentType":
                                    textContent = "还款方式";
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
            }

            plan.specialPlan = specialPlan;
            plan.rate *= 10;
            plan.rasingRate *= 10;

            plan.amount *= 100;
            plan.minAmount *= 100;
            plan.maxAmount *= 100;
            var cashback = $("#cashback").val();
            plan['cashback'] = cashback;
            console.log(plan);
            // if(plan.labelType == 2 && plan.cashback==""){
            //     $mdDialog.show(
            //         $mdDialog.alert()
            //             .clickOutsideToClose(true)
            //             .title('提示')
            //             .textContent("请填写返现说明")
            //             .ok('确定')
            //     );
            //     return;
            // }
            //          yan = {
            //              id: null,
            //          planId: null,
            //          name: null,
            //          cardId: null,
            //          sex: null,
            //          frame: null,
            //          evaluationMoney:'0',
            //          addMoney:'0',
            //          repaymentEnsure:'无',
            //          money: null,
            //          birthday: null,
            //          vehicle: null,
            //          images: null,
            //          loanUsage: null,
            //          description: null,
            //          guarantee:null,
            //          bankDeposit:null,
            //          accountNumber:null,
            //          createdTime: null,
            //          updatedTime: null,
            //          loanId:null,
            //          }
            //
            //          var loan = angular.copy($scope.carLoan);
            //          loan.money *= 100;
            //          loan.images = '';

            //          for (var imgL = 0; imgL < $scope.carLoanImgs.length; imgL++) {
            //              var itemTmp = $scope.carLoanImgs[imgL];
            //              if (itemTmp.link == null || itemTmp.title == null || itemTmp.title == '') {
            //                  $mdDialog.show(
            //                      $mdDialog.alert()
            //                          .clickOutsideToClose(true)
            //                          .title('提示')
            //                          .textContent("请上传图片或填写标题")
            //                          .ok('确定')
            //                  );
            //                  return;
            //              }
            //          }
            //
            //          for (var i = 0; i < $scope.carLoanImgs.length; i++) {
            //              loan.images += ($scope.carLoanImgs[i].link + '|' + $scope.carLoanImgs[i].title + ':');
            //          }
            //         
            //          for (var key in loan) {
            //          	
            //              if (!yan.hasOwnProperty(key)) {
            //                  if (loan[key] == null || loan[key] == "" || loan[key] == "null:") {
            //                  	console.log(key);
            //                      $mdDialog.show(
            //                          $mdDialog.alert()
            //                              .clickOutsideToClose(true)
            //                              .title('提示')
            //                              .textContent("请填写完整信息！")
            //                              .ok('确定')
            //                      );
            //                      return;
            //                  }
            //              }
            //          }

            //          var data = [plan, loan];

            var data = plan;
            data.token = token;
            data.level=$scope.newvalue;
            // data.loanId=$("#comboSelect").val();
             console.log(data);
            $http.post(HOST_URL + "/back/plan/save",
                $.param(data), {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            ).success(function(responseData) {
                // console.log(responseData)
                //              $mdDialog.show(
                //                  $mdDialog.alert()
                //                      .clickOutsideToClose(true)
                //                      .title('提示')
                //                      .textContent(responseData.message)
                //                      .ok('确定')
                //              );
                $mdDialog.show(
                    $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('提示')
                    .textContent(responseData['resultMsg'])
                    .ok('确定')
                ).finally(function() {
                    $location.path('/plan/plan_view');
                })

            }).error(function(responseData) {
                //              $mdDialog.show(
                //                  $mdDialog.alert()
                //                      .clickOutsideToClose(true)
                //                      .title('发生错误，错误信息如下：')
                //                      .textContent(responseData.error)
                //                      .ok('确定')
                //              );

                $mdDialog.show(
                    $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('提示')
                    .textContent(responseData['resultMsg'])
                    .ok('确定')
                );
            });
        };

        //      $scope.planAdd = function () {
        //          var yan = {
        //              id: "",
        //              userId: "",
        //              level: "",
        //              maxAmount: "",
        //              minAmount: "",
        //              status: "",
        //              endTime: "",
        //              profitTimes: "",
        //              createdTime: "",
        //              updatedTime: ""
        //          }
        //          var addData = angular.copy($scope.newPlan);
        //          for (var key in addData) {
        //              if (!yan.hasOwnProperty(key)) {
        //              	
        //                  if (addData[key] == null || addData[key] == "") {
        //                  	
        //                      $mdDialog.show(
        //                          $mdDialog.alert()
        //                              .clickOutsideToClose(true)
        //                              .title('提示')
        //                              .textContent("请填写完整信息！")
        //                              .ok('确定')
        //                      );
        //                      return
        //                  }
        //              }
        //          }
        //          addData.amount = addData.amount * 100;
        //          addData.minAmount = addData.minAmount * 100;
        //          addData.maxAmount = addData.maxAmount * 100;
        //          $http.post(HOST_URL + "/plan/planAdd/ex?token=" + token,
        //              addData,
        //              {
        //                  headers: {
        //                      'Content-Type': 'application/json'
        //                  }
        //              }
        //          ).success(function (responseData) {
        //              $mdDialog.show(
        //                  $mdDialog.alert()
        //                      .clickOutsideToClose(true)
        //                      .title('提示')
        //                      .textContent(responseData.message)
        //                      .ok('确定')
        //              );
        //              history.go(-1);
        //          }).error(function (responseData) {
        //              $mdDialog.show(
        //                  $mdDialog.alert()
        //                      .clickOutsideToClose(true)
        //                      .title('发生错误，错误信息如下：')
        //                      .textContent(responseData.error)
        //                      .ok('确定')
        //              );
        //          });
        //      };
    })

    .factory('plan_addService', function($http, $mdDialog) {
        var plan_add;
        return {
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
            }
        }
    });