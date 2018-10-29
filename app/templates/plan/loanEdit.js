'use strict';

angular.module('myApp.loanEdit', ['ngRoute'])

	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/plan/loanEdit/:id', {
			templateUrl: 'templates/plan/loanEdit.html',
			controller: 'loanEditCtrl'
		});
	}])

	.controller('loanEditCtrl', function($http, $filter, $mdDialog, $scope, $rootScope, loanEditService, $routeParams, bannerListService) {
		$scope.loan_edit = {};
		$scope.planCarLoan = {};
		$scope.carLoan = {};
		// 检测登录
		var userId = localStorage.userId;
		var token = localStorage.token;
		if(token == undefined) {
			alert("您尚未登录！");
			self.location = "/manageSystem/manageSystem/#/login";
		}

		$scope.carLoanImgs = [{
			file: null,
			link: null,
			url: "resource/images/img.jpg",
			title: null
		}];

        // if(um.getContent() != null && um.getContent().trim() != "") {
        //     loanEdit.guaranteeInfo = um.getContent();
        // } else {
        //     loanEdit.guaranteeInfo = "";
        // }
		//查询借款人

		var selectUserIdData = {
			"token": token,
			"verified": true,
			limit:10000,
			page:1
		};
		$scope.selectUserId = function() {
			$http.get(HOST_URL + "/back/borrower/list", {
				params: selectUserIdData
			}, {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).success(function(responseData) {
				if(responseData.resultCode == "0") {
					$scope.selectUser = responseData.resultData;
					//					console.log($scope.selectUser);
                    // var tag_data=[];
                    // for(var i =0 ;i<$scope.selectUser.length;i++){
                     //    tag_data[i]=$scope.selectUser[i];
                     //    tag_data[i].realName=tag_data[i].realName+'('+tag_data[i].name+')';
                     //    // console.log(tag_data[i].realName);
                     //    // $scope.loanEdit1.userId=tag_data[i].realName;
                     //    // $scope.loanEdit1.id=tag_data[i].id;
                    //
                     //    // console.log( $scope.loanEdit.userId);
                    // }
                    // $('#comboSelect').bComboSelect({
                     //    showField : 'realName',
                     //    keyField : 'id',
                     //    data : tag_data
                    // });

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
		$scope.selectUserId();
		var tokenData = {
			token: token
		};

		$scope.getLoan = function() {
			$http.get(HOST_URL + "/back/loan/" + $routeParams.id, {
				params: tokenData
			}, {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).success(function(responseData) {
				if(responseData.resultCode == "0") {
					$scope.loanEdit = responseData.resultData;
                    // $scope.loanEdit.realName=$scope.loanEdit.realName+'('+$scope.loanEdit.name+')';
                    $scope.loanEdit.userId = $scope.loanEdit.userId + '';
					$scope.loanEdit.money = $scope.loanEdit.money / 100;
					$scope.loanEdit.auditRate = $scope.loanEdit.auditRate / 10;

                    um.addListener("ready", function() {
                        um.setContent($scope.loanEdit.description);  //设置内容
                    })
				} else {
					bannerListService.alertInfo(responseData);
				}

			}).error(function(responseData) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('发生错误，错误信息如下：')
					.textContent(
						responseData['resultMsg']
					)
					.ok('确定')
				);
			});
		}
		$scope.getLoan();
		//获取图片
		//  var tokenData = {
		//      token: token,
		//  }
		$scope.getPic = function() {
			$http.get(HOST_URL + "/back/loan/" + $routeParams.id + "/pics", {
				params: tokenData
			}, {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).success(function(responseData) {
				if(responseData.resultCode == "0") {
					if(responseData.resultData.length > 0) {
						$scope.carLoanImgs = responseData.resultData;
						//				        console.log($scope.carLoanImgs);
					}

					//             	$scope.sumCount=responseData.resultData.length;
					// $scope.loanEdit = responseData.resultData;
					//
					// $scope.loanEdit.userId = $scope.loanEdit.userId + '';
					// $scope.loanEdit.money = $scope.loanEdit.money / 100;
					// $scope.loanEdit.auditRate = $scope.loanEdit.auditRate / 10;
				} else {
					bannerListService.alertInfo(responseData);
				}

			}).error(function(responseData) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('发生错误，错误信息如下：')
					.textContent(
						responseData['resultMsg']
					)
					.ok('确定')
				);
			});

		}
		$scope.getPic();
		// function
		$scope.uploadPlanFile = function(index, type) {

			var file;
			switch(type) {
				case 'id':
					file = $scope.funyou[index].idCardFile;
					break;
				case 'school':
					file = $scope.funyou[index].schoolFile;
					break;
				case 'car':
					file = $scope.carLoanImgs[index].file;
					if(file == undefined||file ==null) {
						$mdDialog.show(
							$mdDialog.alert()
							.clickOutsideToClose(true)
							.title('提示')
							.textContent("请先选择图片，在点上传")
							.ok('确定')
						);
						return;
					}
					var reader = new FileReader();
					reader.onload = function(e) {
						$scope.$apply(function() {
							$scope.carLoanImgs[index].url = e.target.result;

						});
					};
					reader.readAsDataURL(file);
			}

			var formData = new FormData();
			formData.append('file', file);
			$http.post(HOST_URL + "/loan/file/upload?token=" + token, formData, {
				headers: {
					'Content-Type': undefined
				},
				transformRequest: angular.identity
			}).success(function(responseData) {
				//				console.log(responseData);
				if(responseData.resultCode == "0") {
					var data = responseData.resultData;
					$scope.dataId = data.id;
					console.log($scope.dataId);
					switch(type) {
						case 'id':
							$scope.funyou[index].cardIdImg = data.fileName;
							$scope.funyou[index].idCardFile = null;
							break;
						case 'school':
							$scope.funyou[index].studentIdImg = data.fileName;
							$scope.funyou[index].schoolFile = null;
							break;
						case 'car':
							$scope.carLoanImgs[index].id = data.id;

					}
					$mdDialog.show(
						$mdDialog.alert()
						.clickOutsideToClose(true)
						.title('提示')
						.textContent('上传成功')
						.ok('确定')
					)

				} else {
					bannerListService.alertInfo(responseData);
				}
			});
		};

		//添加圖片
		$scope.addCarPlan = function() {
			$scope.carLoanImgs.push({
				file: null,
				link: null,
				url: "resource/images/img.jpg",
				title: null
			});
		};
		//刪除圖片
		$scope.showConfirm = function (dex) {
            $mdDialog.show(
                $mdDialog.confirm()
                    .clickOutsideToClose(true)
                    .title('您确定要删除吗？')
                    .ok('确定')
                    .cancel('取消')
            ).then(function () {
              $scope.delCarLoanImg(dex);
            }, function () {

            });
        };
		$scope.delCarLoanImg = function(dex) {
			var dataId=$scope.carLoanImgs[dex].id
             // console.log(dataId);
			if(dataId == undefined || dataId == null) {
				$scope.carLoanImgs.splice(dex, 1);
			} else {
				$scope.cashData = {
					token: token
				}
				
				var data = angular.copy($scope.cashData);
				$http.post(HOST_URL + "/loan/file/" + dataId + "/delete",
					$.param(data), {
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					}).success(function(responseData) {
					if(responseData.resultCode == "0") {
						console.log(responseData);
						$mdDialog.show(
							$mdDialog.alert()
							.clickOutsideToClose(true)
							.title('提示')
							.textContent(responseData['resultMsg'])
							.ok('确定')
						);
						$scope.carLoanImgs.splice(dex, 1);
					} else {
						bannerListService.alertInfo(responseData);
					}
					
				}).error(function(responseData) {
					$mdDialog.show(
						$mdDialog.alert()
						.clickOutsideToClose(true)
						.title('提示')
						.textContent(responseData['resultMsg'])
						.ok('确定')
					);
				})
			}
		};

		$scope.loanEdit = {
			userId: null,
			title: null,
			// used: null,
			// description: null,
			money: null,
			auditRate: null,
			borrowingAgreement: null,
			// risk: null,
			// repayInfo: null,
			// userInfo: null,
            description:null,
			purpose:null,
		};
		// function
		$scope.update = function() {
			var yan = {
				auditDescription: '',
				auditMoney: '',
				auditStaging: '',
				loanedTime: '',
				oldLoanId: '',
				staging: '',
				repaidTimes: '',
				status: '',
                description:''
				//				userId: "",
				//				title: "",
				//				used: "",
				//				description: "",
				//				money: "",
				//				auditRate: "",
				//				borrowingAgreement: "",
				//				risk: "",
				//				repayInfo: "",
				//				userInfo: "",
			}
			//			console.log($scope.loanEdit);
			var loanEdit = angular.copy($scope.loanEdit);
			loanEdit.money = $scope.loanEdit.money * 100;
			loanEdit.auditRate = $scope.loanEdit.auditRate * 10;

			for(var key in loanEdit) {

				if(!yan.hasOwnProperty(key)) {
					if(loanEdit[key] == null || loanEdit[key] == "") {
						console.log(key);

						function switchCase(key) {
							var textContent;
							switch(key) {
								case "userId":
									textContent = "借款人";
									break;
								case "title":
									textContent = "借款标题";
									break;
								// case "used":
								// 	textContent = "借款详情";
								// 	break;
								// case "description":
								// 	textContent = "产品说明";
								// 	break;
								case "money":
									textContent = "借款金额";
									break;
								case "auditRate":
									textContent = "借款利率";
									break;
								case "borrowingAgreement":
									textContent = "协议编号";
									break;
								// case "userInfo":
								// 	textContent = "借款人信息";
								// 	break;
								// case "risk":
								// 	textContent = "安全保障";
								// 	break;
								// case "repayInfo":
								// 	textContent = "还款措施";
								// 	break;
                                case "description":
                                    textContent = "产品描述";
                                    break;
                                case "purpose":
                                    textContent = "借款用途";
                                    break;

							}
							return textContent;
						}
						var x = switchCase(key);

						$mdDialog.show(
							$mdDialog.alert()
							.clickOutsideToClose(true)
							.title('提示')
							.textContent("请填写" + x + "!")
							.ok('确定')
						);
						return
					}
				}
			}
			loanEdit.token = token;
			loanEdit.pics = '';
//判断下拉框有没有被修改
//             if($("#comboSelect").val()==''){
//                 loanEdit.userId= $scope.loanEdit.userId
//             }else{
//                 loanEdit.userId=$("#comboSelect").val();
//             }
			for(var i = 0; i < $scope.carLoanImgs.length; i++) {
				//				console.log($scope.carLoanImgs);
				if($scope.carLoanImgs[i].url == "resource/images/img.jpg") {
					$scope.carLoanImgs[i].id = "";
				}
				loanEdit.pics += $scope.carLoanImgs[i].id + ',';
			}

            if(um.getContent() != null && um.getContent().trim() != "") {
                loanEdit.description = um.getContent();
            } else {
                loanEdit.description = "";
            }
            if(loanEdit.description== "") {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent("请添加内容")
                        .ok('确定')
                );
                return;
            }
			//			console.log(loanEdit)
			$http.post(HOST_URL + "/back/loan/save",
				$.param(loanEdit), {
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}

			).success(function(responseData) {
				if(responseData.resultCode == "0") {
                    // um.addListener("ready", function() {
                    //     um.setContent($scope.loanEdit.guaranteeInfo); //设置内容
                    // })
					$mdDialog.show(
						$mdDialog.alert()
						.clickOutsideToClose(true)
						.title('提示')
						.textContent(responseData['resultMsg'])
						.ok('确定')
					);
					history.go(-1);
				} else {
					bannerListService.alertInfo(responseData);
				}
			}).error(function(responseData) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('发生错误，错误信息如下：')
					.textContent(responseData['resultMsg'])
					.ok('确定')
				);
			});

		};

	})
    .factory('news_editService', function($http, $mdDialog, bannerListService) {
        var news;
        return {
            getNews: function() {
                return news;
            },

            // 获取新闻
            getNewsByid: function(data, id) {
                return $http.get(HOST_URL + "/news/" + id, {
                    params: data
                }, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function(responseData) {

                    if(responseData.resultCode == "0") {
                        news = responseData.resultData;

                    } else {
                        bannerListService.alertInfo(responseData);
                    }

                }).error(function(responseData) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent(responseData.error)
                            .ok('确定')
                    );
                });
            }
        }

    })
	.factory('loanEditService', function($http, $mdDialog) {
		var plan_edit;
		var planCarLoan;
		return {
			alertError: function(message) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('发生错误，错误信息如下：')
					.textContent(message)
					.ok('确定')
				);
			},
			alertInfo: function(message) {
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('提示')
					.textContent(message)
					.ok('确定')
				);
			}
		}
	});