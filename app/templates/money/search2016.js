/**
 * Created by admin on 2017/1/6.
 */

angular.module('myApp.search2016', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/money/search2016', {
            templateUrl: 'templates/money/search2016.html',
            controller: 'search2016Ctrl'
        });
    }])

    .controller('search2016Ctrl', function ($scope, $http, $mdDialog, riskService) {
        $scope.liIdex=1;
        $scope.cashData = {
            page: 1,
            limit: 10,
            key:""
        };
        $scope.type = "investor";
        $scope.selectPage = function (page,type) {
            $scope.cashData['page'] = page;
            var data = angular.copy($scope.cashData);
            $scope.type = type;
            riskService.selectPage("/plan/selectInvestment/"+$scope.type+"/a", "/plan/selectInvestment/"+$scope.type+"/b", data).then(function () {
                var tmpObject = riskService.getResult();
                $scope.itemList = tmpObject.itemList;
                $scope.nowPage = tmpObject.nowPage;
                $scope.pages = tmpObject.pages;
                $scope.isShowDot = tmpObject.isShowDot;
                $scope.totalPages = tmpObject.totalPages;
                $scope.startIndex = tmpObject.startIndex;
            });
            $http.get(HOST_URL + "/sumMoney/"+$scope.type ).success(function (responseData) {
                $scope.money = responseData;
            }).error(function (responseData) {
                alert("请联系管理员！")
            });
        };
        $scope.selectPage(1,$scope.type);
    })