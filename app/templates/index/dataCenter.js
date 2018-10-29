'use strict';

angular.module('myApp.dataCenter', ['ngRoute'])

	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/index/dataCenter', {
			templateUrl: 'templates/index/dataCenter.html',
			controller: 'dataCenterCtrl'
		});
	}])

	.controller('dataCenterCtrl', function($scope, $http, $mdDialog, investorCashCtrlService, $filter, bannerListService) {
		// 检测登录
		var status = "wait_verify";
		var userId = localStorage.userId;
		var token = localStorage.token;
		if(token == undefined) {
			alert("您尚未登录！");
			self.location = "/manageSystem/#/login";
			return 0;
		}
		// 数据中心
        $scope.cashData2={
            token:token
        };
        var data2=angular.copy($scope.cashData2);
        $http.get(
            HOST_URL + "/sys/data/all",
            {
                params:data2
            },
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }

        ).success(function (responseData) {
            if(responseData.resultCode == "0") {
                $scope.static2=responseData.resultData;

            }
            else {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent(responseData['resultMsg'])
                        .ok('确定')
                )
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
        //15天详情
        $scope.openwin=function(list){

        	if(list!=undefined&&list!={}){
        		        	layer.open({
        		type: 1,
        		title:'待回款详情',
      area: ['360px', '540px'],
      shadeClose: true, //点击遮罩关闭
      btn:['确定'],
      btnAlign:'c',
      content: $("#win"),
      success:function(){
      	var str='<li><span  style="font-weight:bold;">&emsp;回款日期</span>&emsp;&emsp;&emsp;&emsp;<span style="float:right;font-weight:bold;">回款金额&nbsp;（元）</span></li>';
      	var pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
      	for(var key in list){
      		str+='<li class="shadow">'+key+"&emsp;&emsp;&emsp;&emsp;<span class='red'>"+(list[key]/ 100).toFixed(2)+"</span></li>"
      	}
      	$("#win").find('ul').html(str);
      }
        	})
        	}else{
        		layer.msg('暂无相关记录');
        		return 0;
        	}

        }
		// 今日数据
$scope.cashData1={
			token:token
};
var data1=angular.copy($scope.cashData1);
        $http.get(
            HOST_URL + "/sys/data/today",
            {
                params:data1
            },
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }

        ).success(function (responseData) {
            if(responseData.resultCode == "0") {
				$scope.static=responseData.resultData;

            }
            else {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent(responseData['resultMsg'])
                        .ok('确定')
                ).finally(function() {
                        if (responseData.resultMsg == "您已在其他地点登录或登录已过期！") {
                            // console.log(responseData.resultMsg)
//                          self.location = "/login";
                            self.location = "/manageSystem/#/login";
                        }
                    });
                    return
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
// 待处理
        $scope.cashData2={
            token:token
        };
        var data2=angular.copy($scope.cashData1);
        $http.get(
            HOST_URL + "/sys/data/pending",
            {
                params:data2
            },
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }

        ).success(function (responseData) {
   
            if(responseData.resultCode == "0") {
                $scope.static1=responseData.resultData;

            }
            else {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent(responseData['resultMsg'])
                        .ok('确定')
                )
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

//  var dottedBase = +new Date();
// var categoryA=[];
// var lineDataA = [];
// var barDataA= [];
// for (var i = 0; i <100; i++) {
//      var date = new Date(dottedBase -= 1000 * 3600 * 24);
//     categoryA.unshift([
//         date.getFullYear(),
//         date.getMonth() + 1,
//         date.getDate()
//     ].join('-'));
//
//     var b = Math.random() * 200;
//     var d = Math.random() * 200;
//     $scope.data.category=categoryA;
//     // $scope.data.money=800;
//    barDataA.push(b);
//    lineDataA.push(d + b);
//     $scope.data.lineData=lineDataA;
//     $scope.data.barData=barDataA;
// }
//console.log($scope.data);
		//获取状态
		//      $http.get(HOST_URL+"/money/getStateOptions").success(function(responseData) {
		//          $scope.stateOptions = responseData;
		//      });

		  $scope.setVal = function () {
            // 设置状态
           
            $scope.selectPage();   
        };

		// 查询条件
		$scope.cashData = {
			
			token: token,
			startDate: "",
			endDate: "",
		};

		$scope.getStatic = function() {
			
			var data = angular.copy($scope.cashData);
			data.startDate = $filter('date')(data.startDate, "yyyyMMddHHmmss");
			data.endDate = $filter('date')(data.endDate, "yyyyMMdd");
			if(data.endDate != "") {
				data.endDate += "235959";
			}
             $http.get(
                HOST_URL + "/statistics/everyday/invest",
                {
                    params:data
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
            	$scope.data = {};
		        var categoryA=[];
                var lineDataA = [];
                if(responseData.resultCode == "0") {
					var data1=responseData.resultData;
					
//                  $scope.data.money=data1.maxAmount/100000;
					$scope.data.money=data1.maxAmount/100000;
                    
                    for(var i=0;i<data1.list.length;i++){
                        
                        var money1=data1.list[i].money/100000;
                        $scope.data.days1=data1.list[i].days;
                        categoryA.push(data1.list[i].days);
                        lineDataA.push(money1);
						$scope.data.category=categoryA;
                        $scope.data.lineData=lineDataA;
                        // console.log(lineDataA);
					}
//                  console.log(categoryA);
                }
                else {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent(responseData['resultMsg'])
                            .ok('确定')
                    ).finally(function() {
                        if (responseData.resultMsg == "您已在其他地点登录或登录已过期！") {
                            // console.log(responseData.resultMsg)
//                          self.location = "/login";
                            self.location = "/manageSystem/#/login";
                        }
                    });
                    return
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

        $scope.getStatic();
	}).factory('investorCashCtrlService', function($http, $mdDialog, bannerListService) {
		var tmpObj = {};
		return {
			selectPage: function(url, data) {

				return $http.get(HOST_URL + url, {
					params: data
				}, {
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).success(function(responseData) {
//   	console.log(responseData.resultData)
					if(responseData.resultCode == "0") {
						var items = responseData.resultData;
//console.log(items)
					} else {
						bannerListService.alertInfo(responseData);
					}
					//                      console.log(responseData);
					var eachPages = data.limit;
					var totalPage = Math.ceil(responseData.sumCount / data.limit);
					var page = data.page;
					tmpObj.sumCount = responseData.sumCount;
					tmpObj.totalPages = totalPage;
					tmpObj.itemList = [];
					if(page <= 1) {
						page = 1;
					}

					if(page >= totalPage) {
						page = totalPage;
					}
//					console.log(items)
					for(var i = 0; i < items.length; i++) {
						tmpObj.itemList.push(items[i]);
					}
					tmpObj.startIndex = (page - 1) * eachPages + 1;
					tmpObj.nowPage = page;
					tmpObj.pages = [];
					if(tmpObj.nowPage > 3 && tmpObj.totalPages > 7) {
						if(tmpObj.nowPage + 3 < tmpObj.totalPages) {
							for(var i = 0; i < 7; i++) {
								tmpObj.pages[i] = {};
								tmpObj.pages[i].showNumber = tmpObj.nowPage - 3 + i;
								tmpObj.isShowDot = true;
							}
						} else if(tmpObj.nowPage + 3 >= tmpObj.totalPages) {
							for(var i = 6; i >= 0; i--) {
								tmpObj.pages[6 - i] = {};
								tmpObj.pages[6 - i].showNumber = tmpObj.totalPages - i;
								tmpObj.isShowDot = false;
							}
						}
					} else if(tmpObj.nowPage <= 3 && tmpObj.totalPages > 8) {
						for(var i = 0; i <= 6; i++) {
							tmpObj.pages[i] = {};
							tmpObj.pages[i].showNumber = i + 1;
							tmpObj.isShowDot = true;
						}
					} else {
						for(var i = 0; i < tmpObj.totalPages; i++) {
							tmpObj.pages[i] = {};
							tmpObj.pages[i].showNumber = i + 1;
							tmpObj.isShowDot = false;
						}
					}
					return tmpObj;
				});
			},
			getResult: function() {
				return tmpObj;
			}
		}
	})
	.factory('investorCashCtrlService1', function($http, $mdDialog, bannerListService) {
		var tmpObj = {};
		return {
			selectPage: function(url, data) {

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
				return $http.get(HOST_URL + url, {
					params: data
				}, {
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).success(function(responseData) {

					if(responseData.resultCode == "0") {

						// console.log(responseData)

						var items = responseData.resultData;

					} else {
						bannerListService.alertInfo(responseData);
					}
					//                      console.log(responseData);
					var eachPages = data.limit;
					var totalPage = Math.ceil(responseData.sumCount / data.limit);
					var page = data.page;
					tmpObj.sumCount = responseData.sumCount;
					tmpObj.totalPages = totalPage;
					tmpObj.itemList = [];
					if(page <= 1) {
						page = 1;
					}

					if(page >= totalPage) {
						page = totalPage;
					}
					for(var i = 0; i < items.length; i++) {
						tmpObj.itemList.push(items[i]);

					}
					tmpObj.startIndex = (page - 1) * eachPages + 1;
					tmpObj.nowPage = page;
					tmpObj.pages = [];
					if(tmpObj.nowPage > 3 && tmpObj.totalPages > 7) {
						if(tmpObj.nowPage + 3 < tmpObj.totalPages) {
							for(var i = 0; i < 7; i++) {
								tmpObj.pages[i] = {};
								tmpObj.pages[i].showNumber = tmpObj.nowPage - 3 + i;
								tmpObj.isShowDot = true;
							}
						} else if(tmpObj.nowPage + 3 >= tmpObj.totalPages) {
							for(var i = 6; i >= 0; i--) {
								tmpObj.pages[6 - i] = {};
								tmpObj.pages[6 - i].showNumber = tmpObj.totalPages - i;
								tmpObj.isShowDot = false;
							}
						}
					} else if(tmpObj.nowPage <= 3 && tmpObj.totalPages > 8) {
						for(var i = 0; i <= 6; i++) {
							tmpObj.pages[i] = {};
							tmpObj.pages[i].showNumber = i + 1;
							tmpObj.isShowDot = true;
						}
					} else {
						for(var i = 0; i < tmpObj.totalPages; i++) {
							tmpObj.pages[i] = {};
							tmpObj.pages[i].showNumber = i + 1;
							tmpObj.isShowDot = false;
						}
					}
					return tmpObj;
				});
			},
			getResult: function() {
				return tmpObj;
			}
		}
	}).directive('line', function() {
		return {
			scope: {
				id: "@",
				//legend: "=",
				//item: "=",    
				data: "="
			},
			restrict: 'E',
			template: '<div style="height:300px;width:100%" ></div>',
			replace: true,
			link: function($scope, element, attrs, controller) {
				//				console.log($scope,element, attrs);
//								console.log($scope.data.money);
//				var a = [];
				var option = {
					//backgroundColor: '#41cac0',
					tooltip: {
					 trigger: 'axis',
						backgroundColor:'#fff',
						borderColor:'rgb(255,0,0)',
						 borderWidth: 1,
						axisPointer: {
							type: 'line',
							
							lineStyle: { // 直线指示器样式设置
								color: '#757575',
								width: 0,
								type: 'solid'
							},
							label: {
								show: true,
								backgroundColor: '#333'
							}
						},
						textStyle: {
        color: '#333'
    }
					},
//					legend: {
//						data: ['line', 'bar'],
//						textStyle: {
//							width: 30,
//							color: '#FFF'
//						}
//					},
					xAxis: {
						data: $scope.data.category,
						axisLine: {
							lineStyle: {
								color: '#757575',
								width: 1
							}
						}
					},
					yAxis: {
						splitLine: {
							show: false
						},
						name: '（单位：K）',
						max: $scope.data.money,
						axisLine: {
							lineStyle: {
								color: '#757575',
								width: 1
							}
						}
					},
					series: [{
						name: '当日投资',
						type: 'line',
						smooth: true,
						showAllSymbol: true,
						symbol: 'emptyCircle',
						symbolSize: 3,
						itemStyle: {
							normal: {
								color: '#f37e9e',
								lineStyle: { // 系列级个性化折线样式
									width: 1,
									
								},
								 areaStyle: {
                            color: 'rgba(255, 111, 111, 0.2)'
                        }
							},
							emphasis: {
								color: '#55ff55'
							}
						},
						data: $scope.data.lineData
					}],
				};
				var myChart = echarts.init(document.getElementById($scope.id), 'macarons');
				myChart.setOption(option);
				window.onresize = myChart.resize;
			}
		};
	});