'use strict';

angular.module('myApp.index', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/index', {
            templateUrl: 'templates/index/index.html',
            controller: 'IndexCtrl'
        });
    }])

    .controller('IndexCtrl', function ($scope, $rootScope, IndexService) {
        // 判断登录
        var userId = localStorage.userId;
        var token = localStorage.token;
        var userName = localStorage.userName;

        $rootScope.url = {
            'login': '/manageSystem/#/login',
            'register': '/manageSystem/#/register',
            'about': '/manageSystem/#/about'
        };
        if (userId != undefined && token != undefined && userName != undefined) {
            $rootScope.url.login = '/manageSystem/#/user/index';
            $rootScope.url.register = '/manageSystem/#/logout';
            $rootScope.userName = userName;
            $rootScope.log = "退出登录";
        } else {
            $rootScope.url.login = '/manageSystem/#/login';
            $rootScope.url.register = '/manageSystem/#/register';
            $rootScope.userName = "立即登录";
            $rootScope.log = "立即注册";
        }
        //
        $scope.synRealPlans = IndexService.synPlans(0, 3).then(function () {
            $scope.realPlans = IndexService.getPlans();
            $scope.synExpPlans = IndexService.synPlans(1, 3).then(function () {
                $scope.expPlans = IndexService.getPlans();
            });
        });
    })

    .factory('IndexService', function ($http) {
        var plans;
        var itemList;
        var ListObject = {};
        return {
            getPlans: function () {
                return plans;
            },
            synPlans: function (planType, planLimit) {
                return $http.get(HOST_URL + "/plans?order=desc&type=" + planType + "&limit=" + planLimit).success(function (responseData) {
                    plans = responseData;
                }).error(function (responseData) {
                    // 无响应
                });
            },
            selectPages: function (page, items, eachPages) {
                var totalPage = Math.ceil(items.length / eachPages);
                ListObject.totalPages = totalPage;
                ListObject.itemList = [];
                var limit;
                if (page <= 1) {
                    page = 1;
                }

                if (page >= totalPage) {
                    page = totalPage;
                }

                if (page == totalPage) {
                    limit = items.length;
                } else {
                    limit = page * eachPages;
                }

                for (var i = (page - 1) * eachPages; i < limit; i++) {
                    ListObject.itemList.push(items[i]);
                }
                ListObject.startIndex = (page - 1) * eachPages + 1;
                ListObject.nowPage = page;

                ListObject.pages = [];

                if (ListObject.nowPage > 3 && ListObject.totalPages > 7) {
                    if (ListObject.nowPage + 3 < ListObject.totalPages) {
                        for (var i = 0; i < 7; i++) {
                            ListObject.pages[i] = {};
                            ListObject.pages[i].showNumber = ListObject.nowPage - 3 + i;
                            ListObject.isShowDot = true;
                        }
                    } else if (ListObject.nowPage + 3 >= ListObject.totalPages) {
                        for (var i = 6; i >= 0; i--) {
                            ListObject.pages[6 - i] = {};
                            ListObject.pages[6 - i].showNumber = ListObject.totalPages - i;
                            ListObject.isShowDot = false;
                        }
                    }
                } else if (ListObject.nowPage <= 3 && ListObject.totalPages > 8) {
                    for (var i = 0; i <= 6; i++) {
                        ListObject.pages[i] = {};
                        ListObject.pages[i].showNumber = i + 1;
                        ListObject.isShowDot = true;
                    }
                } else {
                    for (var i = 0; i < ListObject.totalPages; i++) {
                        ListObject.pages[i] = {};
                        ListObject.pages[i].showNumber = i + 1;
                        ListObject.isShowDot = false;
                    }
                }
                return ListObject;
            }
        }
    });