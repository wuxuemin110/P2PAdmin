'use strict';

angular.module('myApp.personal_list', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/money/personal_list', {
            templateUrl: 'templates/money/personal_list.html',
            controller: 'personal_listCtrl'
        });
    }])

    .controller('personal_listCtrl', function ($scope, $http, $mdDialog, riskService,investorCashCtrlService,$filter,bannerListService) {
        var token = localStorage.token;
        // $scope.keyword = '';
        if(token == undefined) {
			alert("您尚未登录！");
			self.location = "/manageSystem/#/login";
		}
$scope.keyword="";
        $scope.searchRecharge = function (keyword) {
$scope.cashData['keyword']=$scope.keyword;
            $scope.selectPage(1);
        }
        $scope.cashData = {
            // status:status,
            token: token,
            page: 1,
            limit: 20,
             startDate:"",
            endDate:""
        };

        $scope.selectPage = function (page) {
            if (page <= 1) {
                page = 1;
            } else if (page >= $scope.totalPages) {
                page = $scope.totalPages;
            }
            $scope.cashData['page'] = page;
            var data = angular.copy($scope.cashData);
            // var str= $("#myTime").val();
            // var reg = /\/| |:/g;
            // data.startDate=str.replace(reg,'');
            // var str1= $("#myTime1").val();
            // var reg1 = /\/| |:/g;
            // data.endDate= str1.replace(reg1,'');

            data.startDate =$filter('date')(data.startDate, "yyyyMMddHHmmss");
            data.endDate=$filter('date')(data.endDate, "yyyyMMdd");
            if(data.endDate !=""){
                data.endDate +="235959";
            }

            // console.log(data);
            investorCashCtrlService.selectPage("/personal/balance/checklist",data).then(function () {
                var tmpObject = investorCashCtrlService.getResult();
                $scope.itemList = tmpObject.itemList;
                $scope.nowPage = tmpObject.nowPage;
                $scope.pages = tmpObject.pages;
                $scope.sumCount=tmpObject.sumCount;
                $scope.isShowDot = tmpObject.isShowDot;
                $scope.totalPages = tmpObject.totalPages;
                $scope.startIndex = tmpObject.startIndex;
            });
        };
        $scope.searchRecharge(1);

        var data1={
            token:token
        };
        $scope.check = function() {
            $http.post(HOST_URL + "/user/balance/check",
                $.param(data1),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function(responseData) {
                if(responseData.resultCode == "0") {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent(responseData.resultMsg)
                            .ok('确定')
                    );

                } else {
                    bannerListService.alertInfo(responseData);
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

    });