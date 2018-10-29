'use strict';

angular.module('myApp.login', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'templates/index/login.html',
            controller: 'LoginCtrl'
        });
    }])

    .controller('LoginCtrl', function ($scope, $http, $mdDialog, LoginService, $location) {

        $scope.user = {};
        $scope.logging = false;
        $scope.login = function () {

            if (!$scope.logging) {
                $scope.logging = true;
                LoginService.login($scope.user).success(function () {
                	if(parseInt(localStorage.getItem('userId')) ==139477){
                       
                             $location.path('/money/statistics_list');
                             return
                    }
                    
                    if(parseInt(localStorage.getItem('userId')) ==144573){
                       
                             $location.path('/money/investmentRecord');
                             return
                    }

                     if(localStorage.getItem('role')!=undefined&&localStorage.getItem('role')!=null){  
                    switch (parseInt(localStorage.getItem('role'))) {
                        case 300:
                        case 400:
                            $location.path('/index/dataCenter');
                            break;
                        case 500:
                            // $location.path('/plan/plan_view');
                            $location.path('/index/dataCenter');
                            break;
                        case 600:
                        case 610:
                            $location.path('/money/account_list');
                            break;
                        case 700:
                            $location.path('/banner/banner_list');
                            break;
                        case 800:
                        case 810:
                        case 815:
                        case 820:
                        case 830:
                        case 840:
                        case 850:
                            $location.path('/windcontrol/information_autable');
                            break;
                        default:
                            $location.path('/index/dataCenter');
                            break;
                    }
                    }
                }).finally(function () {
                    $scope.logging = false;
                });
            }
        };
    })

    .factory('LoginService', function ($http, $mdDialog) {
       localStorage.clear();
        var user;
        var userInfo;
        var userAuth;
        return {
            getAll: function () {
                return [user, userInfo, userAuth];
            },
            login: function (user) {
 //           	var data="?name="+user.name+"&password="+user.password;
                 return $http.get(
                	 HOST_URL + "/user/login",
                	{
                    	params:user
                   },
                	 {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }
//              return $http.post(
//              	 HOST_URL + "/user/login",
//              	 $.param(user),
//              	 {
//                      headers: {
//                          'Content-Type': 'application/x-www-form-urlencoded'
//                      }
//                  }
 //                   HOST_URL + "/user/login"+data
//                  user,
//                  {
//                      headers: {
//                          'Content-Type': 'application/json'
//                      }
//                  }
                ).success(function (responseData) {
                	
                	if(responseData.resultCode == "0") {
                		
//              		console.log(responseData);
                    localStorage.setItem('userId', responseData.resultData['user']['id']);
                    localStorage.setItem('userName', responseData.resultData['user']['name']);
                    localStorage.setItem('role', responseData.resultData['user']['role']);
                    localStorage.setItem('token', responseData.resultData['userAuth']['token']);
                   }
                	else {
                		$mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent(responseData['resultMsg'])
                            .ok('确定')
                    );
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
            }
        }
    });