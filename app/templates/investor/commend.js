/**
 * Created by admin on 2017/1/11.
 */
'use strict';

angular.module('myApp.commend', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/investor/commend', {
            templateUrl: 'templates/investor/commend.html',
            controller: 'commend'
        });
    }])
    .controller('commend', function ($http, $scope, $mdDialog, riskService) {

        $scope.customid="";

        //查询信息

        $scope.selectCustomInfo = function(){
            $http.get(HOST_URL+"/custom/selectCustomInfo").success(function (data) {
                // console.log(data)
                $scope.listCustomInfo = data
            });
        }
        $scope.selectCustomInfo();


        //统计评价
        $scope.liIdexCount=function (custom_id) {
            //留住，然后赋予给分页（个人宣言表id）
            $scope.customid = angular.copy(custom_id);
            $http.get(HOST_URL+"/custom/countCustomNum?custom_id="+$scope.customid).success(function (data) {
                // console.log(data)
                $scope.countCustom = data

            });

            //分页客户寄语
            $scope.selectPage(1);

        }

        //分页客户寄语
        $scope.selectPage = function (page) {
            var data = {
                page: page,
                limit: 10,
                keyword: $scope.customid
            };
            riskService.selectPage("/custom/selectCustomIdeal/1", "/custom/selectCustomIdeal/2", data).then(function () {

                var tmpObject = riskService.getResult();
                $scope.itemList = tmpObject.itemList;
                $scope.nowPage = tmpObject.nowPage;
                $scope.pages = tmpObject.pages;
                $scope.isShowDot = tmpObject.isShowDot;
                $scope.totalPages = tmpObject.totalPages;
                $scope.startIndex = tmpObject.startIndex;

                // console.log($scope.totalPages );
            });
        };

        //上传图片
        $scope.loanImgs = [{file: null, link: null, base64: null, title: null}];
         $scope.custom = {
            id: null,
            name: null,
            declaration: null,
            popularity:null,
            photo:null,
            createdTime: null,
            updatedTime: null
        };

        // 上传图片
        $scope.uploadPlanFile = function (index) {

            var file;
            file = $scope.loanImgs[index].file;
            var reader = new FileReader();
            reader.onload = function (e) {
                $scope.$apply(function () {
                    $scope.loanImgs[index].base64 = e.target.result;

                });
            };
            reader.readAsDataURL(file);

            var formData = new FormData();
            formData.append('file', file);

            $http.post(HOST_URL + "/custom/imgUpload", formData, {
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity
            }).success(function (data) {
                // console.log(data)
                        $scope.loanImgs[index].link = data.fileName;
                        $scope.custom.photo = data.fileName;

                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent('上传成功')
                        .ok('确定')
                );
            });
        };
        //添加信息
        $scope.submit = function () {
            var customData = angular.copy($scope.custom);
            // console.log(customData)
            $http.post(
                HOST_URL + "/custom/customAddInfo", customData,
                {
                    headers: { 'Content-Type': 'application/json' }}).success(function (responseData) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent(responseData.success)
                        .ok('确定')
                );
                $scope.selectCustomInfo();
                    // console.log(responseData)

            }).error(function(responseData){
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent(responseData.error)
                        .ok('确定')
                );
            })
        }
        //删除信息
        $scope.delete = function (id) {
            $http.post(
                HOST_URL + "/custom/deletCustomInfo?id="+id).success(function (responseData) {
                // console.log(responseData.error)
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent("删除成功")
                        .ok('确定')
                );
                $scope.selectCustomInfo();
            }).error(function(responseData){
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent(responseData.error)
                        .ok('确定')
                );
            })

        };
    });