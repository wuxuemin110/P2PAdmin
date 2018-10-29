'use strict';

angular.module('myApp.updateEdit', ['ngRoute']).directive('fileModel', ['$parse', function($parse) {
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
        $routeProvider.when('/activity/updateEdit', {
            templateUrl: 'templates/activity/updateEdit.html',
            controller: 'updateEditCtrl'
        });
    }])

    .controller('updateEditCtrl', function($scope, $location, $mdDialog,$filter, bannerListService,updateEditService,$http) {
        $scope.tradeRecord = {};
        $scope.userAccount = {};
        $scope.showUrl=true;
        $scope.trade={}
        $scope.path = updateEditService.getPath();
        var app="";
        var id = 0;
        if($location.url() != null) {
            id = $location.url().split("=")[1];
        }
        // 检测登录
        var userId = localStorage.userId;
        var token = localStorage.token;
        if(token == undefined) {
            alert("您尚未登录！");
            self.location = "/manageSystem/#/login";
            return 0;
        }
            $scope.uploadFile=function(){
                var form = new FormData();
                var file = document.getElementById("fileUpload").files[0];
                form.append('file', file);
                // console.log(form);
                $http.post(HOST_URL + "/update/check/upload?token="+token,form,
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

                        var url=responseData.resultData;
                        $scope.showUrl=false;
                        $('#getUrl').val(url);


                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title('提示')
                                .textContent("添加成功")
                                .ok('确定')
                        )} else {
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

            };
        // };
        // 获取图片新闻
        updateEditService.synTradeRecords(token, id).success(function() {
            $scope.tradeRecord = updateEditService.getTradeRecords();
            console.log($scope.tradeRecord );
            $scope.tradeRecord.type = $scope.tradeRecord.type + '';

        });
        $scope.tradeRecord.url =$("#imageId").val();
        console.log($scope.tradeRecord.url);
        // 保存按钮
        $scope.edit = function() {

            var imgnews = {
                id:$scope.tradeRecord.id,
                forceUpdate:$scope.tradeRecord.forceUpdate,
                // type:$scope.tradeRecord.type,
                detail:$scope.tradeRecord.detail,
                version:$scope.tradeRecord.version

            };
            var str1= $("#myTime").val();
            var reg1 = /\/| |:/g;
            imgnews.updatedTime= str1.replace(reg1,'');

            if($("#getUrl").val()!=""){
                imgnews.url=$("#getUrl").val();
            }else{
                imgnews.url=$scope.tradeRecord.url;
            }

            imgnews.token = token;
            console.log(imgnews);
            updateEditService.edit(imgnews);
        };

    })

    .factory('updateEditService', function($http, $location, $mdDialog,$filter, bannerListService) {
        var downloadPath = HOST_URL + "/news/img/downloadPic?fileName=";
        var tradeRecords;
        var trade;
        return {
            getTradeRecords: function() {
                return tradeRecords;
            },
            getPath: function() {
                return downloadPath;
            },
            //执行修改
            edit: function(imgnews) {
//				console.log(imgnews);
                $http.post(HOST_URL + "/update/check/update", $.param(imgnews), {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function(responseData) {
                    if(responseData.resultCode == "0") {
                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title('提示')
                                .textContent("修改成功")
                                .ok('确定')
                        ).finally(function(){
                            $location.url("/activity/update_list")
                        });

                    }
                    else {
                        bannerListService.alertInfo(responseData);
                    }
                }).error(function(responseData) {
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

            synTradeRecords: function(token, id) {
                var tokenData = {
                    "token": token
                };
                return $http.get(HOST_URL + "/update/check/query/" + id,

                    {params:tokenData}, {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }
                ).success(function(responseData) {
//					console.log(responseData);
                    if(responseData.resultCode == "0") {
                        tradeRecords = responseData.resultData;
                        console.log(tradeRecords);

                        tradeRecords.updatedTime = $filter("newDate")(tradeRecords.updatedTime, "yyyy/MM/dd HH:mm:ss");
                        tradeRecords.endTime = $filter("newDate")(tradeRecords.endTime, "yyyy/MM/dd HH:mm:ss");
                        // $scope.startTime = startTime;
                    } else {
                        bannerListService.alertInfo(responseData);
                    }
                }).error(function(responseData) {
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