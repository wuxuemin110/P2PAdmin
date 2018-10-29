'use strict';

angular.module('myApp.investor_cash', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/money/investor_cash', {
            templateUrl: 'templates/money/investor_cash.html',
            controller: 'investorCashCtrl'
        });
    }])

    .controller('investorCashCtrl', function ($scope, $http, $mdDialog,investorCashCtrlService,$filter,bannerListService) {
        // 检测登录
        var status = "wait_verify";
        var userId = localStorage.userId;
        var token = localStorage.token;
        if (token == undefined) {
            alert("您尚未登录！");
            self.location = "/manageSystem/#/login";
            return 0;
        }

        $scope.setVal = function (input) {
            // 设置状态
            $scope.cashData['status'] = input;
            // console.log($scope.cashData['status'] );

            $scope.selectPage(1);   
        };


         //获取状态
//      $http.get(HOST_URL+"/money/getStateOptions").success(function(responseData) {
//          $scope.stateOptions = responseData;
//      });

        $scope.changeState = function(id,state){
            $http.post(HOST_URL+"/money/updateState?id="+id+"&state="+state).success(function(){
                 $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent('状态更新成功')
                            .ok('确定')
                    ).then(function(){//确定按钮方法
                        // 获取交易流水
                        $scope.selectPage(1);
                    }, function(){});
            }).error(function(responseData){
                $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent(responseData['resultMsg'])
                            .ok('确定')
                    );
                
            }); 
        }     

        // 查询条件
        $scope.cashData = {
            adminId:userId,
            status : status,
            token: token,
            page: 1,
            limit: 20,
            startDate: "",
            endDate: "",
            checkStartTime: "",
            checkEndTime:"",
            keyword:"",
        };

        $scope.selectPage = function (page) {
        	 if (page <= 1) {
                page = 1;
            } else if (page >= $scope.totalPages) {
                page = $scope.totalPages;
            }
            $scope.cashData['page'] = page;
            var data = angular.copy($scope.cashData);
            
            // if(data.startDate!=""){
            //     var startDate= new Date(data.startDate);
            //     data.startDate=startDate.getTime();
            //     //
            // }
            // else{
            //     data.startDate="";
            // }
            // if(data.endDate!=""){
            //     var endDate=new Date(data.endDate);
            //     data.endDate=endDate.getTime();
            // }else{
            //     data.endDate="";
            // }


            // data.startDate=$filter('date')(data.startDate, "yyyyMMddHHmmss");
            // data.endDate=$filter('date')(data.endDate, "yyyyMMddHHmmss");
            // var str = data.startDate;
            // var str= $("#myTime").val()
            // var reg = /\/| |:/g;
            // data.startDate=str.replace(reg,'');
            // var str1= $("#myTime1").val()
            // var reg1 = /\/| |:/g;
            // data.endDate= str1.replace(reg1,'');
            // var str2= $("#Time").val()
            // var reg2 = /\/| |:/g;
            // data.checkStartTime=str2.replace(reg2,'');
            // var str3= $("#Time1").val()
            // var reg3 = /\/| |:/g;
            // data.checkEndTime=str3.replace(reg3,'');
            // data.startDate=endDate;

            data.startDate =$filter('date')(data.startDate, "yyyyMMddHHmmss");
            data.endDate=$filter('date')(data.endDate, "yyyyMMdd");
            if(data.endDate!=""){
                data.endDate +="235959";
            }

            data.checkStartTime=$filter('date')(data.checkStartTime, "yyyyMMddHHmmss");
            data.checkEndTime=$filter('date')(data.checkEndTime, "yyyyMMdd");
            if(data.checkEndTime!="") {
                data.checkEndTime += "235959";
            }
            investorCashCtrlService.selectPage("/user/withdraw/list", data).then(function () {
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

        $scope.setVal("wait_verify");

        $scope.cashData1={
            token: token

        }

       $scope.gotoExport=function(input){
            // console.log(input)
        $scope.cashData1['status'] = input;
           $scope.cashData1['keyword']=$scope.cashData.keyword;
        $scope.cashData1['startDate']=$scope.cashData.startDate;
           $scope.cashData1['endDate']=$scope.cashData.endDate;
           $scope.cashData1['checkStartTime']=$scope.cashData.checkStartTime;
           $scope.cashData1['checkEndTime']=$scope.cashData.checkEndTime;
            var data1= angular.copy($scope.cashData1);
           // var str= $("#myTime").val();
           // var reg = /\/| |:/g;
           // data1.startDate=str.replace(reg,'');
           // var str1= $("#myTime1").val();
           // var reg1 = /\/| |:/g;
           // data1.endDate= str1.replace(reg1,'');
           // var str2= $("#Time").val();
           // var reg2 = /\/| |:/g;
           // data1.checkStartTime=str2.replace(reg2,'');
           // var str3= $("#Time1").val();
           // var reg3 = /\/| |:/g;
           // data1.checkEndTime=str3.replace(reg3,'');

           data1.startDate =$filter('date')(data1.startDate, "yyyyMMddHHmmss");
           data1.endDate=$filter('date')(data1.endDate, "yyyyMMdd");
           if(data1.endDate!=""){
               data1.endDate +="235959";
           }

           data1.checkStartTime=$filter('date')(data1.checkStartTime, "yyyyMMddHHmmss");
           data1.checkEndTime=$filter('date')(data1.checkEndTime, "yyyyMMdd");
           if(data1.checkEndTime!="") {
               data1.checkEndTime += "235959";
           }
           // console.log(data1);
           window.open(HOST_URL + "/user/withdraw/export?"+"adminId="+userId+"&startDate="+data1.startDate+"&endDate="+data1.endDate+"&checkStartTime="+data1.checkStartTime+"&checkEndTime="+data1.checkEndTime+"&status="+data1.status+"&keyword="+data1.keyword+"&token=" + token );
           // window.open(HOST_URL + "user/" + userId + "/investment/" + planId + "/pdf?token=" + token);
       }
            // if(data.startDate==""||data.endDate==""){
            //     $mdDialog.show(
            //         $mdDialog.alert()
            //             .clickOutsideToClose(true)
            //             .title('提示')
            //             .textContent("请输入时间")
            //             .ok('确定')
            //     );
            //   return;
            // }
            // $http.get(
            //     HOST_URL + "/user/withdraw/export",
            //     {
            //         params:data
            //     },
            //     {
            //         headers: {
            //             'Content-Type': 'application/x-www-form-urlencoded'
            //         }
            //     } )
            // window.open();
            //     .success(function (responseData) {
            //         if(responseData.resultCode=="0"){
            //             window.open("http://localhost:8082/user/withdraw/export");
            //         }
            // })

        // }
        //获取提现审核详情
      $scope.withdrawalExamine = function(item){
   	// console.log(item);
            self.location = "/manageSystem/#/money/withdrawalExamine/"+item.id;
        };
    }).factory('investorCashCtrlService', function ($http,$mdDialog,bannerListService) {
        var tmpObj = {};
        return {
            selectPage: function (url,data) {
            	
//              var url_data = "?";
//
//              function isType(obj, type) {
//                  return Object.prototype.toString.call(obj) === "[object " + type + "]";
//              }
//              for (var item in data) {
//                  if (isType(data[item], "Object")) {
//                      if (item == "keyword") {
//                          url_data += "keyword=&";
//                      }
//                      for (var ite in data[item]) {
//                          // 如果是二层数组，key是value，value是key
//                          url_data += data[item][ite] + "=" + ite + "&";
//                      }
//                  } else {
//                      url_data += item + "=" + data[item] + "&";
//                  }
//              }

//            return $http.get(HOST_URL + url + url_data, data).success(function (responseData) {
//	console.log(url,data);
	          return $http.get(HOST_URL + url,{
                    	params:data
                    },{
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }
	          ).success(function (responseData) {
                      
                      if(responseData.resultCode=="0"){
                      	var items = responseData.resultData;
                      
                      }
                      else {
						bannerListService.alertInfo(responseData);
					}
//                      console.log(responseData);
                        var eachPages = data.limit;
                        var totalPage = Math.ceil(responseData.sumCount / data.limit);
                        var page = data.page;
                         tmpObj.sumCount=responseData.sumCount;
                        tmpObj.totalPages = totalPage;
                        tmpObj.itemList = [];
                        if (page <= 1) {
                            page = 1;
                        }

                        if (page >= totalPage) {
                            page = totalPage;
                        }
                        for (var i = 0; i < items.length; i++) {
                            tmpObj.itemList.push(items[i]);
                        }
                        tmpObj.startIndex = (page - 1) * eachPages + 1;
                        tmpObj.nowPage = page;
                        tmpObj.pages = [];
                        if (tmpObj.nowPage > 3 && tmpObj.totalPages > 7) {
                            if (tmpObj.nowPage + 3 < tmpObj.totalPages) {
                                for (var i = 0; i < 7; i++) {
                                    tmpObj.pages[i] = {};
                                    tmpObj.pages[i].showNumber = tmpObj.nowPage - 3 + i;
                                    tmpObj.isShowDot = true;
                                }
                            } else if (tmpObj.nowPage + 3 >= tmpObj.totalPages) {
                                for (var i = 6; i >= 0; i--) {
                                    tmpObj.pages[6 - i] = {};
                                    tmpObj.pages[6 - i].showNumber = tmpObj.totalPages - i;
                                    tmpObj.isShowDot = false;
                                }
                            }
                        } else if (tmpObj.nowPage <= 3 && tmpObj.totalPages > 8) {
                            for (var i = 0; i <= 6; i++) {
                                tmpObj.pages[i] = {};
                                tmpObj.pages[i].showNumber = i + 1;
                                tmpObj.isShowDot = true;
                            }
                        } else {
                            for (var i = 0; i < tmpObj.totalPages; i++) {
                                tmpObj.pages[i] = {};
                                tmpObj.pages[i].showNumber = i + 1;
                                tmpObj.isShowDot = false;
                            }
                        }
                        return tmpObj;
                    });
            },
            getResult: function () {
                return tmpObj;
            }
        }
    })
    .factory('investorCashCtrlService1', function ($http,$mdDialog,bannerListService) {
        var tmpObj = {};
        return {
            selectPage: function (url,data) {

//              var url_data = "?";
//
//              function isType(obj, type) {
//                  return Object.prototype.toString.call(obj) === "[object " + type + "]";
//              }
//              for (var item in data) {
//                  if (isType(data[item], "Object")) {
//                      if (item == "keyword") {
//                          url_data += "keyword=&";
//                      }
//                      for (var ite in data[item]) {
//                          // 如果是二层数组，key是value，value是key
//                          url_data += data[item][ite] + "=" + ite + "&";
//                      }
//                  } else {
//                      url_data += item + "=" + data[item] + "&";
//                  }
//              }

//            return $http.get(HOST_URL + url + url_data, data).success(function (responseData) {
//	console.log(url,data);
                return $http.get(HOST_URL + url,{
                        params:data
                    },{
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }
                ).success(function (responseData) {

                    if(responseData.resultCode=="0"){

                        // console.log(responseData)

                        var items = responseData.resultData;


                    }
                    else {
                        bannerListService.alertInfo(responseData);
                    }
//                      console.log(responseData);
                    var eachPages = data.limit;
                    var totalPage = Math.ceil(responseData.sumCount / data.limit);
                    var page = data.page;
                    tmpObj.sumCount=responseData.sumCount;
                    tmpObj.totalPages = totalPage;
                    tmpObj.itemList = [];
                    if (page <= 1) {
                        page = 1;
                    }

                    if (page >= totalPage) {
                        page = totalPage;
                    }
                    for (var i = 0; i < items.length; i++) {
                        tmpObj.itemList.push(items[i]);

                    }
                    tmpObj.startIndex = (page - 1) * eachPages + 1;
                    tmpObj.nowPage = page;
                    tmpObj.pages = [];
                    if (tmpObj.nowPage > 3 && tmpObj.totalPages > 7) {
                        if (tmpObj.nowPage + 3 < tmpObj.totalPages) {
                            for (var i = 0; i < 7; i++) {
                                tmpObj.pages[i] = {};
                                tmpObj.pages[i].showNumber = tmpObj.nowPage - 3 + i;
                                tmpObj.isShowDot = true;
                            }
                        } else if (tmpObj.nowPage + 3 >= tmpObj.totalPages) {
                            for (var i = 6; i >= 0; i--) {
                                tmpObj.pages[6 - i] = {};
                                tmpObj.pages[6 - i].showNumber = tmpObj.totalPages - i;
                                tmpObj.isShowDot = false;
                            }
                        }
                    } else if (tmpObj.nowPage <= 3 && tmpObj.totalPages > 8) {
                        for (var i = 0; i <= 6; i++) {
                            tmpObj.pages[i] = {};
                            tmpObj.pages[i].showNumber = i + 1;
                            tmpObj.isShowDot = true;
                        }
                    } else {
                        for (var i = 0; i < tmpObj.totalPages; i++) {
                            tmpObj.pages[i] = {};
                            tmpObj.pages[i].showNumber = i + 1;
                            tmpObj.isShowDot = false;
                        }
                    }
                    return tmpObj;
                });
            },
            getResult: function () {
                return tmpObj;
            }
        }
    })
