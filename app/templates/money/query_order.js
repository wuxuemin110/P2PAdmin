/**
 * Created by admin on 2016/12/30.
 */
'use strict';

angular.module('myApp.query_order', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/money/query_order', {
            templateUrl: 'templates/money/query_order.html',
            controller: 'query_order'
        });
    }])
    .controller('query_order', function ($scope,$mdDialog,$http,$filter) {
    	// 检测登录
        var userId = localStorage.userId;
        var token = localStorage.token;
        if (token == undefined) {
            alert("您尚未登录！");
            self.location = "/manageSystem/#/login";
            return 0;
        }
        $scope.nodejs = {
            orderNumber:"",
            beginTime:null,
            endTime:null,
            pageIndex: 1
        };
        $scope.queryOrder={};
        $scope.queryOrderList={};

        //比如这个2017-02-17 判断获取为个位数时在前面加0
        function pad2(n) { return n < 10 ? '0' + n : n }
        //查询
        $scope.selectPage = function (page) {

            if($scope.nodejs.beginTime !=null){
                var beginTime = $scope.nodejs.beginTime;
                var beTime = beginTime.getFullYear().toString() + pad2(beginTime.getMonth() + 1) + pad2(beginTime.getDate()) + pad2(beginTime.getHours() ) + pad2(beginTime.getMinutes() ) + pad2(beginTime.getSeconds())
                $scope.nodejs.beginTime = beTime;

            }
            if($scope.nodejs.endTime !=null){
                var endTime = $scope.nodejs.endTime;
                var eTime = endTime.getFullYear().toString() + pad2(endTime.getMonth() + 1) + pad2( endTime.getDate()) + pad2( endTime.getHours() ) + pad2( endTime.getMinutes() ) + pad2( endTime.getSeconds() )
                $scope.nodejs.endTime = eTime;

            }


            // console.log($scope.nodejs)
            $http.post(HOST_URL+"/getOrder",$scope.nodejs,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).success(function (responseData) {

                $scope.queryOrder = responseData;
                $scope.queryOrderList = responseData.list;

            }).error(function (responseData) {
                localStorage.clear();
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent(responseData['error'])
                        .ok('确定')
                );
            });

        };



    });