'use strict';

angular.module('myApp.loan_edit', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/loan/loan_edit', {
            templateUrl: 'templates/loan/loan_edit.html',
            controller: 'Loan_editCtrl'
        });
    }])

    .controller('Loan_editCtrl', function ($scope, $http, $location, $mdDialog) {
         // 检测登录
        var userId = localStorage.userId;
        var token = localStorage.token;
        if (token == undefined) {
            alert("您尚未登录！");
            self.location = "/manageSystem/#/login";
            return 0;
        }
        /**用传过来的用户ID去查询该投资人的信息**/
        $http.get(HOST_URL + '/borrowerInfo/'+$location.search().userId).success(function(data){
            $scope.borrower=data;
            if($scope.borrower.userCard!=null)
                $scope.borrower.userCard.type=$scope.borrower.userCard.type+'';//为了能让下拉能够正常的默认选中
        });
        /**保存修改**/
        $scope.password = '';
        $scope.saveBorrower = function() {
            $scope.borrower.user.password = $scope.password;
            $http.post(HOST_URL+"/borrower/update?token="+token,$scope.borrower).success(function(data){
                 $scope.borrower = data;
                $scope.borrower.userCard.type=$scope.borrower.userCard.type+'';//为了能让下拉能够正常的默认选中
                 $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent('保存成功')
                            .ok('确定')
                    );
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
        
    })

 ;