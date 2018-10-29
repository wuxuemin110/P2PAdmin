'use strict';

angular.module('myApp.propel', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/activity/propel', {
            templateUrl: 'templates/activity/propel.html',
            controller: 'propelCtrl'
        });
    }])

    .controller('propelCtrl', function ($scope, $http, $mdDialog, userAddService, IndexService,bannerListService,$filter) {
       
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

        $scope.cashData = {
            title:null,
            content: null,
            type: null,
            url: null,
            registered: null,
            realname: null,
            // alluser: null,
            investment: null,
            scheduledTime: null,
            repaymentTime1: null,
            repaymentTime2: null
            // personalInfo:""

        };
        // 保存按钮
        $scope.saveRegister = function (){
            var yan={};

            var plan = angular.copy($scope.cashData);


            var str1= $("#scheduledTime").val();
            var reg1 = /\/| |:/g;
          plan.scheduledTime= str1.replace(reg1,'');
            var str2= $("#repaymentTime1").val();
            var reg2 = /\/| |:/g;
            plan.repaymentTime1= str2.replace(reg2,'');
            var str3= $("#repaymentTime2").val();
            var reg3 = /\/| |:/g;
            plan.repaymentTime2= str3.replace(reg3,'');
            console.log(plan);
            for(var key in plan) {

                if(!yan.hasOwnProperty(key)) {
                    if(plan[key] == null || plan[key] == "") {
                        // console.log(key);

                        function switchCase(key) {
                            var textContent;
                            switch(key) {
                                case "title":
                                    textContent = "标题";
                                    break;
                                case "content":
                                    textContent = "内容";
                                    break;
                                case "type":
                                    textContent = "透传类型";
                                    break;
                                case "url":
                                    textContent = "透传链接";
                                    break;
                                case "registered":
                                    textContent = "是否注册";
                                    break;
                                case "realname":
                                    textContent = "是否实名";
                                    break;
                                case "investment":
                                    textContent = "是否投资";
                                    break;
                                case "scheduledTime":
                                    textContent = "预定时间";
                                    break;
                                case "repaymentTime1":
                                    textContent = "回款时间1";
                                    break;
                                case "repaymentTime2":
                                    textContent = "回款时间2";
                                    break;
                                // case "alluser":
                                //     textContent = "是否全部用户";
                                //     break;

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
            var data = plan;
            data.token=token;
            var personalInfo=$("#textarea1").val();
            data['personalInfo']=personalInfo;

            var data1=data.personalInfo.replace(/[\r\n]/g,",").split(",");
            console.log(data1.length);
          if(data1!='') {
              for (var i = 0; i < data1.length; i++) {
                  // console.log(data1[i]);
                  var reg = /^1[3|4|5|7|8][0-9]{9}$/;
                  if (reg.test(data1[i]) != true) {
                      $mdDialog.show(
                          $mdDialog.alert()
                              .clickOutsideToClose(true)
                              .title('提示')
                              .textContent("请输入正确个人用户！（手机号）")
                              .ok('确定')
                      );
                      return;
                  }
              }
          }
            var dataa =JSON.stringify(data1).replace(/\[|]|"/g,"");

            data.personalInfo=dataa;
            console.log(data.personalInfo);
            var form = new FormData();

            form.append('scheduledTime',data.scheduledTime);
            form.append('repaymentTime1',data.repaymentTime1);
            form.append('repaymentTime2',data.repaymentTime2);
            form.append('personalInfo',data.personalInfo);
            form.append('registered',data.registered);
            form.append('investment',data.investment);
            form.append('realname',data.realname);
            form.append('url',data.url);
            form.append('title',data.title);
            form.append('content',data.content);
            form.append('type',data.type);
            form.append('token',token);
            var file = document.getElementById("fileUpload").files[0];
            // console.log(file);
            form.append('file', file);
            // form.append('scheduledTime','data.scheduledTime');
            // form.append('scheduledTime','data.scheduledTime');
            console.log(form);
            // var form = new FormData();
            // var file = document.getElementById("fileUpload").files[0];
            // form.append('file', file);


            $http.post(HOST_URL + "/sys/getui/save",form,
                // $.param(data),
              {
                    transformRequest: angular.identity,
                    headers: {
                        // 'Content-Type': 'application/x-www-form-urlencoded'
                        'Content-Type': undefined
                    }
                    // transformRequest: angular.identity
                }
            ).success(function(responseData) {
                if(responseData.resultCode == "0") {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent("添加成功")
                            .ok('确定')
                    ).finally(function() {
                        self.location='#/activity/propel_list';
                    });
                } else {
                    bannerListService.alertInfo(responseData);
                }

            }).error(function(responseData) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('发生错误，错误信息如下：')
                        .textContent("添加失败")
                        .ok('确定')
                );
            });
        }
    })

    .factory('userAddService', function ($http, $mdDialog) {
        var count = 5;
        var tradeRecords;
        return {
            getTradeRecords: function () {
                return tradeRecords;
            },
            getPages: function () {
                var items = [];
                var pages = tradeRecords.length / count;
                var ends = tradeRecords.length % count;
                if (ends != 0) {
                    pages++;
                }
                for (var i = 0; i < parseInt(pages); i++) {
                    items[i] = i;
                }
                return items;
            },
            // 同步 TradeRecords
            synTradeRecords: function (userId, token) {
                return $http.get(HOST_URL + "/user/" + userId + "/tradeRecords?token=" + token).success(function (responseData) {
                    tradeRecords = responseData;
                }).error(function (responseData) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent(message)
                            .ok('确定')
                    );
                });
            }
                
        }
    });