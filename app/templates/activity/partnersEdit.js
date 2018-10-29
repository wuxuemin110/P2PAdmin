'use strict';

angular.module('myApp.partnersEdit', ['ngRoute']).directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/activity/partnersEdit', {
            templateUrl: 'templates/activity/partnersEdit.html',
            controller: 'partnersEditCtrl'
        });
    }])

    .controller('partnersEditCtrl', function ($scope, $location, $mdDialog, partnersEditService, $filter, bannerListService, $http) {
        $scope.tradeRecord = {};
        $scope.userAccount = {};
        $scope.visible = true;
        $scope.path = partnersEditService.getPath();
        var id = 0;
        if ($location.url() != null) {
            id = $location.url().split("=")[1];
        }
        // 检测登录
        var userId = localStorage.userId;
        var token = localStorage.token;
        if (token == undefined) {
            alert("您尚未登录！");
            self.location = "/manageSystem/#/login";
            return 0;
        }

        // 获取图片新闻
        partnersEditService.synTradeRecords(token, id).success(function () {
            $scope.tradeRecord = partnersEditService.getTradeRecords();
            // console.log($scope.tradeRecord);
            var status = $scope.tradeRecord.status + '';
            var outSite = $scope.tradeRecord.outSite + '';
            $scope.tradeRecord.outSite = outSite;
            $scope.tradeRecord.status = status;
//			console.log($scope.tradeRecord);
        });
        //上传按钮
        $scope.uploadFile = function () {
            var form = new FormData();
            var file = document.getElementById("fileUpload").files[0];
            form.append('file', file);
            // console.log(form);
            $http.post(HOST_URL + "/partners/pic/upload?token=" + token, form,
                // $.param(data),
                {
                    transformRequest: angular.identity,
                    headers: {
                        // 'Content-Type': 'application/x-www-form-urlencoded'
                        'Content-Type': undefined
                    }
                    // transformRequest: angular.identity
                }
            ).success(function (responseData) {
                if (responseData.resultCode == "0") {

                    var url = responseData.resultData;
                    $('#trueUrl').val(url);
                    console.log($('#trueUrl').val());
                    // }


                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent("添加成功")
                            .ok('确定')
                    )
                } else {
                    bannerListService.alertInfo(responseData);
                }

            }).error(function (responseData) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('发生错误，错误信息如下：')
                        .textContent("添加失败")
                        .ok('确定')
                );
            });
            $scope.visible = false;
        };

        // 保存按钮

        $scope.edit = function () {

            console.log($scope.visible);
            var imgnews = {
                id: $scope.tradeRecord.id,
                orderNum: $scope.tradeRecord.orderNum,
                name: $scope.tradeRecord.name,
                url: $scope.tradeRecord.url,
                status: $scope.tradeRecord.status,
                website: $scope.tradeRecord.website
                // startDate:'',
                // endDate:""

            };

            if ($('#trueUrl').val() == '' || $('#trueUrl').val() == undefined) {
                imgnews.url = $scope.tradeRecord.url;
            }
            else {
                imgnews.url = $('#trueUrl').val();
            }


            console.log(imgnews);
            imgnews.token = token;

            //			 imgnews.createTime=new Date(imgnews.createTime);
            partnersEditService.edit(imgnews);
        };

    })

    .factory('partnersEditService', function ($http, $location, $mdDialog, $filter, bannerListService) {
        var downloadPath = HOST_URL + "/news/img/downloadPic?fileName=";
        var tradeRecords;

        return {
            getTradeRecords: function () {
                return tradeRecords;
            },
            getPath: function () {
                return downloadPath;
            },
            //执行修改
            edit: function (imgnews) {
//				console.log(imgnews);
                $http.post(HOST_URL + "/partners/save", $.param(imgnews), {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function (responseData) {
                    if (responseData.resultCode == "0") {
                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title('提示')
                                .textContent("修改成功")
                                .ok('确定')
                        );
                        $location.url("/activity/partners_list")
                    }
                    else {
                        bannerListService.alertInfo(responseData);
                    }
                }).error(function (responseData) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent(responseData.resultMsg)
                            .ok('确定')
                    );
                });
            },
            // 同步 TradeRecords
            synTradeRecords: function (token, id) {
                var tokenData = {
                    "token": token
                };
                return $http.get(HOST_URL + "/partners/select/" + id,

                    {params: tokenData}, {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }
                ).success(function (responseData) {
//					console.log(responseData);
                    if (responseData.resultCode == "0") {
                        tradeRecords = responseData.resultData;
                        // console.log(tradeRecords);
                        // var startTime = $scope.plan_edit.startTime + "";
                        tradeRecords.startTime = $filter("newDate")(tradeRecords.startTime, "yyyy/MM/dd HH:mm:ss");
                        tradeRecords.endTime = $filter("newDate")(tradeRecords.endTime, "yyyy/MM/dd HH:mm:ss");
                        // $scope.startTime = startTime;
                    } else {
                        bannerListService.alertInfo(responseData);
                    }
                }).error(function (responseData) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent(responseData.resultMsg)
                            .ok('确定')
                    );
                });
            }
        }
    });