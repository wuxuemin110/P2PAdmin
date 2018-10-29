'use strict';

angular.module('myApp.loan_add', ['ngRoute']).directive('fileModel', ['$parse', function($parse) {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				var model = $parse(attrs.fileModel);
				var modelSetter = model.assign;
				element.bind('change', function() {
					scope.$apply(function() {
						modelSetter(scope, element[0].files[0]);
					});
				});
			}
		};
	}])

	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/plan/loan_add', {
			templateUrl: 'templates/plan/loan_add.html',
			controller: 'loan_addCtrl'
		});
	}])

	.controller('loan_addCtrl', function($http, $mdDialog, $filter, $scope, loan_addService, $location, $routeParams, bannerListService) {
		// 检测登录
		var userId = localStorage.userId;
		var token = localStorage.token;

		if(token == undefined) {
			alert("您尚未登录！");
			self.location = "/manageSystem/#/login";
		}

		$scope.carLoanImgs = [{
			file: null,
			link: null,
			base64: null,
			title: null
		}];
		//查询借款人

		var selectUserIdData = {
			page:1,
			limit:10000,
			"token": token,
			"verified": true
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
                    // }
                    // console.log(tag_data);
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
		$scope.newLoan = {
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
			// purpose:'',


		};

		$scope.addCarPlan = function() {
			var yan = {
//							userId: "",
//							title: "",
//							used: "",
//							description: "",
//							money: "",
//							auditRate: "",
//							borrowingAgreement: "",
//							risk: "",
//							repayInfo:"",
//							userInfo: "",
			}
			var loan = angular.copy($scope.newLoan);
			//			loan.userId = parseInt($scope.newLoan.userId);
			// console.log(loan)
			loan.money *= 100;
			loan.auditRate *= 10;

//			for(var imgL = 0; imgL < $scope.carLoanImgs.length; imgL++) {
//				var itemTmp = $scope.carLoanImgs[imgL];
//				if(itemTmp.id == null || itemTmp.title == null || itemTmp.title == '') {
//					$mdDialog.show(
//						$mdDialog.alert()
//						.clickOutsideToClose(true)
//						.title('提示')
//						.textContent("请上传图片")
//						.ok('确定')
//					);
//					return;
//				}
//			}

            // if(newLoan.guaranteeInfo== "") {
            //     $mdDialog.show(
            //         $mdDialog.alert()
            //             .clickOutsideToClose(true)
            //             .title('提示')
            //             .textContent("请添加内容")
            //             .ok('确定')
            //     );
            //     return;
            // }
            if(um.getContent() != null && um.getContent().trim() != "") {
                loan.description = um.getContent();
            } else {
                loan.description = "";
            }
			for(var key in loan) {
				if(!yan.hasOwnProperty(key)) {
					if(loan[key] == null || loan[key] == "") {
//						console.log(key);

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
                                    textContent = "第三方担保信息";
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
//			console.log($scope.carLoanImgs);
			loan.pics="";
           
           	for(var i = 0; i < $scope.carLoanImgs.length; i++) {
           		  if($scope.carLoanImgs[i].file == null){
           		  	$scope.carLoanImgs[i].id="";
           		      }
				loan.pics += $scope.carLoanImgs[i].id + ',';
			}

			var data = loan;
			data.token = token;
            // data.userId=$("#comboSelect").val();
			$http.post(HOST_URL + "/back/loan/save",
				$.param(data), {
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}
			).success(function(responseData) {
				if(responseData.resultCode == "0") {
					$mdDialog.show(
						$mdDialog.alert()
						.clickOutsideToClose(true)
						.title('提示')
						.textContent("添加成功")
						.ok('确定')
					).finally(function() {
						$location.path('/plan/loanView');
					});
				} else {
					bannerListService.alertInfo(responseData);
				}

			}).error(function(responseData) {
				//              $mdDialog.show(
				//                  $mdDialog.alert()
				//                      .clickOutsideToClose(true)
				//                      .title('发生错误，错误信息如下：')
				//                      .textContent(responseData.error)
				//                      .ok('确定')
				//              );
				$mdDialog.show(
					$mdDialog.alert()
					.clickOutsideToClose(true)
					.title('发生错误，错误信息如下：')
					.textContent("添加失败")
					.ok('确定')
				);
			});
		};

		//		$scope.planAdd = function() {
		//			var yan = {
		//				id: "",
		//				userId: "",
		//				level: "",
		//				maxAmount: "",
		//				minAmount: "",
		//				status: "",
		//				endTime: "",
		//				profitTimes: "",
		//				createdTime: "",
		//				updatedTime: ""
		//			}
		//			var addData = angular.copy($scope.newPlan);
		//			for(var key in addData) {
		//				if(!yan.hasOwnProperty(key)) {
		//
		//					if(addData[key] == null || addData[key] == "") {
		//
		//						$mdDialog.show(
		//							$mdDialog.alert()
		//							.clickOutsideToClose(true)
		//							.title('提示')
		//							.textContent("请填写完整信息！")
		//							.ok('确定')
		//						);
		//						return
		//					}
		//				}
		//			}
		//			addData.amount = addData.amount * 100;
		//			addData.minAmount = addData.minAmount * 100;
		//			addData.maxAmount = addData.maxAmount * 100;
		//			$http.post(HOST_URL + "/plan/planAdd/ex?token=" + token,
		//				addData, {
		//					headers: {
		//						'Content-Type': 'application/json'
		//					}
		//				}
		//			).success(function(responseData) {
		//				$mdDialog.show(
		//					$mdDialog.alert()
		//					.clickOutsideToClose(true)
		//					.title('提示')
		//					.textContent(responseData.message)
		//					.ok('确定')
		//				);
		//				history.go(-1);
		//			}).error(function(responseData) {
		//				$mdDialog.show(
		//					$mdDialog.alert()
		//					.clickOutsideToClose(true)
		//					.title('发生错误，错误信息如下：')
		//					.textContent(responseData.error)
		//					.ok('确定')
		//				);
		//			});
		//		};

		$scope.addCarLoanImg = function() {
			$scope.carLoanImgs.push({
				file: null,
				link: null,
				base64: null,
				title: null
			});
		};
		// var loan = angular.copy($scope.newLoan);
		// for (var i = 0; i < $scope.carLoanImgs.length; i++) {
		//     loan.pics+=$scope.carLoanImgs[i].id+',';
		//     console.log(loan.pics)
		// }
		// var id= $scope.carLoanImgs;
		// console.log(id)

		$scope.delectDEX = function(dex) {
			$scope.funyou.splice(dex, 1);
		};
		// function
		$scope.uploadPlanFile = function(index, type) {
			console.log(index, type);
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
							.textContent("请先选择图片，再上传")
							.ok('确定')
						);
						return;
					}

					var reader = new FileReader();
					reader.onload = function(e) {
						$scope.$apply(function() {
							$scope.carLoanImgs[index].base64 = e.target.result;

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
//							console.log($scope.carLoanImgs);

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
			$scope.showConfirm=function(dex){
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
			}
		$scope.delCarLoanImg = function(dex) {
			
			
			var dataId=$scope.carLoanImgs[dex].id
//			console.log(dataId,$scope.carLoanImgs);
			if(dataId == undefined || dataId == null) {
				$scope.carLoanImgs.splice(dex, 1);
			} else {

				$scope.cashData = {
					token: token,
				}
//				console.log(dataId);
				var data = angular.copy($scope.cashData)
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
					} else {
						bannerListService.alertInfo(responseData);
					}
					$scope.carLoanImgs.splice(dex, 1);
				}).error(function(responseData) {
					$mdDialog.show(
						$mdDialog.alert()
						.clickOutsideToClose(true)
						.title('提示')
						.textContent(responseData['resultMsg'])
						.ok('确定')
					);
				})
			};
		}

	})

	.factory('loan_addService', function($http, $mdDialog, bannerListService) {
		var loan_add;
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
			},
		}
	});