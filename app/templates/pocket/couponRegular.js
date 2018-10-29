'use strict';

angular.module('myApp.couponRegular', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/pocket/couponRegular', {
            templateUrl: 'templates/pocket/couponRegular.html',
            controller: 'couponRegularCtrl'
        });
    }])

    .controller('couponRegularCtrl', function ($scope,$rootScope, $http, $mdDialog, riskService,investorCashCtrlService,$filter,bannerListService) {
        var token = localStorage.token;
        var userId = localStorage.userId;
         $scope.keyword = '';
        // $scope.status = '';
        $scope.searchRecharge = function () {
            // $scope.cashData['status']=input;
            // console.log(input)
            // $scope.cashData['startDate']=$scope.startDate;
            // $scope.cashData['endDate']=$scope.endDate;
        // $scope.cashData['status'] = $scope.status;
        //     $scope.cashData['keyword']=$scope.keyword;
        //     $scope.cashData['itemName']=$scope.itemName;
            $scope.selectPage(1);
        }
        $scope.cashData = {
            status:status,
            token: token,
            page: 1,
            limit: 20,
             startDate:"",
            endDate:"",
            // purchaseTime: null
            //  keyword: "",
            itemName:""
        };
        // $scope.viewUI1 = function(m){
        //     // self.location='/#/investor/investor_edit?userId='+x.userId;
        //     self.location='/#/pocket/couponRegular_edit/'+m.userId;
        // }
        $scope.selectPage = function (page) {
            if (page <= 1) {
                page = 1;
            } else if (page >= $scope.totalPages) {
                page = $scope.totalPages;
            }
            $scope.cashData['page'] = page;
            var data = angular.copy($scope.cashData);
            console.log(data);
            // data.startDate=$filter('date')(data.startDate, "yyyyMMddHHmmss");
            // data.endDate=$filter('date')(data.endDate, "yyyyMMddHHmmss");
            // var str= $("#myTime").val()
            // var reg = /\/| |:/g;
            // data.startDate=str.replace(reg,'');
            // var str1= $("#myTime1").val()
            // var reg1 = /\/| |:/g;
            // data.endDate= str1.replace(reg1,'');

            data.startDate=$filter('date')(data.startDate, "yyyyMMddHHmmss");
            data.endDate=$filter('date')(data.endDate, "yyyyMMdd");
            if(data.endDate!=""){
                data.endDate+="235959";
            }
            // console.log(data)
            investorCashCtrlService.selectPage("/sys/voucher/rules",data).then(function () {
                var tmpObject = investorCashCtrlService.getResult();
                $scope.itemList = tmpObject.itemList;
                // console.log(tmpObject.id);
                $scope.nowPage = tmpObject.nowPage;
                $scope.pages = tmpObject.pages;
                $scope.sumCount= tmpObject.sumCount;
                $scope.isShowDot = tmpObject.isShowDot;
                $scope.totalPages = tmpObject.totalPages;
                $scope.startIndex = tmpObject.startIndex;
            });
        };
        $scope.searchRecharge(1);

        $scope.viewUI = function(m){
            $rootScope.m=m;
            self.location = "/manageSystem/#/pocket/couponRegular_edit/"+m.id;
        };
        $scope.showConfirm=function(m){
            $mdDialog.show(
                $mdDialog.confirm()
                    .clickOutsideToClose(true)
                    .title('您确定要删除吗？')
                    .ok('确定')
                    .cancel('取消')
            ).then(function () {
                $scope.delete(m);
            }, function () {

            });
        }

        $scope.delete = function (m) {
            var data={
                token:token,
                siteConfigId:m.id
            }

            $http.post(
                HOST_URL + "/sys/voucher/rule/del/"+m.id,
                $.param(data),
                {
                    headers:{
                        'Content-Type':'application/x-www-form-urlencoded'
                    }
                }

            ).success(function (responseData){
                if(responseData.resultCode=='0'){
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent('删除成功')
                            .ok('确定')
                    ).finally(function() {
                        window.location.reload();
                    });
                }else{
                    bannerListService.alertInfo(responseData);
                }

            }).error(function (responseData) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent(responseData['resultMsg'])
                        .ok('确定')
                );
            });
        };


    });