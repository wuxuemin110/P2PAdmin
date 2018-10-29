'use strict';

angular.module('myApp.investor_edit', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/investor/investor_edit/:id', {
            templateUrl: 'templates/investor/investor_edit.html',
            controller: 'Investor_editCtrl'
        });
    }])
    .controller('Investor_editCtrl', function ($scope, $http, $location, $mdDialog,$routeParams) {
        // 检测登录
        var userId = localStorage.userId;
        var token = localStorage.token;
        if (token == undefined) {
            alert("您尚未登录！");
            self.location = "/manageSystem/#/login";
            return 0;
        }
        /**用传过来的用户ID去查询该投资人的信息**/

        // $http.get(HOST_URL + '/investorInfo/'+$location.search().userId+"?token="+token).success(function(data){
        //     $scope.investor=data;
        //     if($scope.investor.userCard!=null){
        //         $scope.investor.userCard.type=$scope.investor.userCard.type+'';//为了能让下拉能够正常的默认选中
        //     }
        //     if($scope.investor.userCard==null){
        //         $scope.investor.userCard={type:"1"}
        //     }
        // });
        $scope.cashData={
            token:token
        }
        // $scope.cashData['userId']=$location.search().userId;
        var data=angular.copy($scope.cashData);
        $http.get(HOST_URL + '/user/'+$routeParams.id+'/info',
            {
                params:data ,
            } ,
            {
                headers:{
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        ).success(function(responseData){
            if(responseData.resultCode=="0"){
                $scope.investor= responseData.resultData;
            }
        });

        var userId=localStorage.userId;
        console.log(userId)
        /**保存修改**/
        // $scope.password = '';
        $scope.saveInvestor = function() {
           $scope.cashData={
               realName:$scope.investor.realName,
               idCard:$scope.investor.idCard,
               phone:$scope.investor.phone,
               token:token,
               id:$routeParams.id,
               managerId:userId
              

           }
            var data=angular.copy($scope.cashData);
            /*$http.post(HOST_URL+"/user/info/update",*/
            $http.post(HOST_URL+"/investorInfo/update/",
                $.param(data),
            {
                headers:{
                    'Content-Type': 'application/x-www-form-urlencoded'
                }

            }).success(function(responseData){
                if(responseData.resultCode=="0"){
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent('保存成功')
                            .ok('确定')
                    );
                    self.location = "/manageSystem/#/investor/investor";
                }else{
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent(responseData['resultMsg'])
                            .ok('确定')
                    );
                }

            }).error(function(responseData){
                $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent(responseData['error'])
                            .ok('确定')
                    );
                
            }); 
            
        }
        /**取消操作,回到列表**/
        $scope.cancle = function(){
            self.location='/manageSystem/#/investor/investor';
        }
    

    })

    .factory('Investor_editService', function ($http) {
        var mainPlanList;
        var bottomPlanList;
        var tmpScope = {};
        var rankingList;
        return {
            getPlans: function () {
                return plans;
            },
            getMainPlans: function () {
                return mainPlanList;
            },
            getBottomPlans: function () {
                return tmpScope;
            },
            // 同步计划
            synMainPlans: function () {
                return $http.get(HOST_URL + "/plans?order=desc&limit=5").success(function (responseData) {
                    mainPlanList = responseData;
                }).error(function () {
                    // 无响应
                });
            },
            // 同步历史计划
            synBottomPlans: function (page) {
                return $http.get(HOST_URL + "/plans?order=desc&limit=5&page=" + page).success(function (responseData) {

                    bottomPlanList = responseData;
                    tmpScope.bottomPlans = bottomPlanList;
                    tmpScope.totalPages = Math.ceil(bottomPlanList[0].planCount / 5);
                    tmpScope.nowPage = page;
                    tmpScope.pages = [];
                    if (tmpScope.nowPage > 3 && tmpScope.totalPages > 7) {
                        if (tmpScope.nowPage + 3 < tmpScope.totalPages) {
                            for (var i = 0; i < 7; i++) {
                                tmpScope.pages[i] = {};
                                tmpScope.pages[i].showNumber = tmpScope.nowPage - 3 + i;
                                tmpScope.isShowDot = true;
                            }
                        } else if (tmpScope.nowPage + 3 >= tmpScope.totalPages) {
                            for (var i = 6; i >= 0; i--) {
                                tmpScope.pages[6 - i] = {};
                                tmpScope.pages[6 - i].showNumber = tmpScope.totalPages - i;
                                tmpScope.isShowDot = false;
                            }
                        }
                    } else if (tmpScope.nowPage <= 3 && tmpScope.totalPages > 8) {
                        for (var i = 0; i <= 6; i++) {
                            tmpScope.pages[i] = {};
                            tmpScope.pages[i].showNumber = i + 1;
                            tmpScope.isShowDot = true;
                        }
                    } else {
                        for (var i = 0; i < tmpScope.totalPages; i++) {
                            tmpScope.pages[i] = {};
                            tmpScope.pages[i].showNumber = i + 1;
                            tmpScope.isShowDot = false;
                        }
                    }

                }).error(function () {
                    // 无响应
                });
            },
            synRankingList: function () {
                return $http.get(HOST_URL + "/user/investor_edit/rankings").success(function (responseData) {
                    rankingList = responseData;
                }).error(function () {

                });
            },
            getRankigList: function () {
                return rankingList;
            }
        }
    })
;