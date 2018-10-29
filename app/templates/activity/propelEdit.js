'use strict';

angular.module('myApp.propelEdit', ['ngRoute'])

	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/activity/propelEdit/:id', {
			templateUrl: 'templates/activity/propelEdit.html',
			controller: 'propelEditCtrl'
		});
	}])

	.controller('propelEditCtrl', function($http, $filter, $mdDialog, $scope, $rootScope, loanEditService, $routeParams, bannerListService,propel_editService) {
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


        $scope.tradeRecord = {};
        $scope.userAccount = {};


        // 获取详情列表
        var tokenData = {
            token: token
        };
        propel_editService.getNewsByid(tokenData, $routeParams.id).success(function() {
            $scope.cashData= propel_editService.getNews();
       console.log($scope.cashData);
            var scheduledTime = $scope.cashData.scheduledTime + "";

            scheduledTime = $filter("newDate")(scheduledTime, "yyyy/MM/dd HH:mm:ss");
            $scope.scheduledTime = scheduledTime;
            var repaymentTime1 = $scope.cashData.repaymentTime1 + "";

            repaymentTime1 = $filter("newDate")(repaymentTime1, "yyyy/MM/dd HH:mm:ss");
            $scope.repaymentTime1 = repaymentTime1;
            var repaymentTime2 = $scope.cashData.repaymentTime2 + "";

            repaymentTime2 = $filter("newDate")(repaymentTime2, "yyyy/MM/dd HH:mm:ss");
            //$("#showTime").val(showTime);
            $scope.repaymentTime2 = repaymentTime2;
        });

        // 保存按钮

        $scope.saveRegister = function() {
            var notice = $scope.cashData;

            if(notice.title == "") {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent("请添加标题")
                        .ok('确定')
                );
                return;
            }
            // if(notice.alluser == "") {
            //     $mdDialog.show(
            //         $mdDialog.alert()
            //             .clickOutsideToClose(true)
            //             .title('提示')
            //             .textContent("请添加是否全部用户")
            //             .ok('确定')
            //     );
            //     return;
            // }
            if(notice.content == "") {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent("请添加内容")
                        .ok('确定')
                );
                return;
            }
            if(notice.url == "") {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent("请添加透传链接")
                        .ok('确定')
                );
                return;
            }

            if(notice.type == "") {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent("请添加透传类型")
                        .ok('确定')
                );
                return;
            }
            if(notice.registered == "") {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent("请添加是否注册")
                        .ok('确定')
                );
                return;
            }
            if(notice.realname == "") {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent("请添加是否实名")
                        .ok('确定')
                );
                return;
            }
            if(notice.investment == "") {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent("请添加是否投资")
                        .ok('确定')
                );
                return;
            }
            if(notice.scheduledTime == "") {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent("请添加预定时间")
                        .ok('确定')
                );
                return;
            }
            if(notice.repaymentTime1 == "") {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent("请添加还款日期")
                        .ok('确定')
                );
                return;
            }
            if(notice.repaymentTime2 == "") {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent("请添加还款日期")
                        .ok('确定')
                );
                return;
            }
            // if(notice.personalInfo == undefined) {
            //     $mdDialog.show(
            //         $mdDialog.alert()
            //             .clickOutsideToClose(true)
            //             .title('提示')
            //             .textContent("请添加个人用户")
            //             .ok('确定')
            //     );
            //     return;
            // }
            $scope.cashData = {
                token: token,
                title: notice.title,
                type: notice.type,
                content: notice.content,
                url: notice.url,
                realname: notice.realname,
                investment: notice.investment,
                registered: notice.registered,
                // alluser: notice.alluser,
                scheduledTime: notice.scheduledTime,
                repaymentTime1: notice.repaymentTime1,
                repaymentTime2: notice.repaymentTime2,
                personalInfo: notice.personalInfo,
                id: $routeParams.id

                // content: notice.content
            };
            var personalInfo = $("#textarea1").val();
            console.log(personalInfo);
            var scheduledTime = $("#scheduledTime").val();
            var repaymentTime1 = $("#repaymentTime1").val();
            var repaymentTime2=$("#repaymentTime2").val();
            $scope.cashData.repaymentTime2 = repaymentTime2;
            $scope.cashData.repaymentTime1 = repaymentTime1;
            $scope.cashData.scheduledTime = scheduledTime;
            $scope.cashData.personalInfo = personalInfo;
            console.log($scope.cashData);
            var data = angular.copy($scope.cashData);
            if($scope.cashData.personalInfo!=""){
                var data1=$scope.cashData.personalInfo.replace(/[\r\n]/g,",").split(",");
                if(data1!="") {
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
                console.log(data1);
                var dataa =JSON.stringify(data1).replace(/\[|]|"/g,"");
                console.log(dataa);
                data.personalInfo=dataa;
            }



            data.scheduledTime = $filter('newDate')(data.scheduledTime, "yyyyMMddHHmmss");
            data.repaymentTime1 = $filter('newDate')(data.repaymentTime1, "yyyyMMddHHmmss");
            data.repaymentTime2 = $filter('newDate')(data.repaymentTime2, "yyyyMMddHHmmss");
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


            $http.post(HOST_URL + "/sys/getui/save",form,
               // $.param(form),

                {
                    transformRequest: angular.identity,
                    headers: {
                        // 'Content-Type': 'application/x-www-form-urlencoded'
                        'Content-Type': undefined
                    }

                }
                ).success(function(responseData) {
                if(responseData.resultCode == "0") {
                  // console.log(responseData)

                    $mdDialog.show(
                        $mdDialog.alert().clickOutsideToClose(true)
                            .title('提示')
                            .textContent(responseData['resultMsg'])
                            .ok('确定')
                    ).finally(function() {

                    	self.location='/manageSystem/#/activity/propel_list';
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

        }

    })

    .factory('propel_editService', function($http, $mdDialog, bannerListService) {
        var news;
        return {
            getNews: function() {
                return news;
            },

            // 获取公告
            getNewsByid: function(data, id) {
                return $http.get(HOST_URL + "/sys/getui/" + id +"/detail",
                {
                    params:data
                },
                    {
                        headers: {
                            'Content-Type'
                        :
                            'application/x-www-form-urlencoded'
                        }

                }).success(function(responseData) {

                    if(responseData.resultCode == "0") {
                        news = responseData.resultData;
                        console.log(news);
                        if(news.personalInfo!=undefined){
                            var personalInfo=news.personalInfo.replace(/\[|]|"/g,"").replace(/,/g,'\n');
                            news.personalInfo=personalInfo;
                            // console.log(news.personalInfo);
                        }


                    } else {
                        bannerListService.alertInfo(responseData);
                    }

                }).error(function(responseData) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent(responseData.error)
                            .ok('确定')
                    );
                });
            }
        }

    });