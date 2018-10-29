'use strict';

angular.module('myApp.information_autable', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/windcontrol/information_autable', {
            templateUrl: 'templates/windcontrol/information_autable.html',
            controller: 'Information_autableCtrl'
        });
    }])

    .controller('Information_autableCtrl', function ($scope, $http, IndexService, riskService, $mdDialog) {
        // 检测登录
        var userId = localStorage.userId;
        var token = localStorage.token;
        if (token == undefined) {
            alert("您尚未登录！");
            self.location = "/manageSystem/#/login";
            return 0;
        }
        // 查询条件
        $scope.riskData = {
            token: token,
            page: 1,
            limit: 10,
            userId: "desc",
            loanMoney: "desc",
            loanStaging: "desc",
            loanAuditState: "",
            keyword: ""
        };

        $scope.addPool = function (loanId, index) {
            $http.get(HOST_URL + '/loan/' + loanId + '/pool?token=' + token).success(function (responseData) {
                $scope.itemList[index].deptPoolId = responseData.id;
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent(responseData.message)
                        .ok('确定')
                );
            }).error(function (resposeData) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('提示')
                        .textContent(responseData.error)
                        .ok('确定')
                );
            })
        };
        $scope.tiaoz;
        $scope.selectPage = function (page) {
            if (page == 'undefined' || page == null) {
                return;
            }
            $scope.riskData['page'] = page;
            var data = angular.copy($scope.riskData);
            riskService.selectPage("/risk/list", "/risk/list/total", data).then(function () {
                var tmpObject = riskService.getResult();
                $scope.itemList = tmpObject.itemList;
                $scope.nowPage = tmpObject.nowPage;
                $scope.pages = tmpObject.pages;
                $scope.isShowDot = tmpObject.isShowDot;
                $scope.totalPages = tmpObject.totalPages;
                $scope.startIndex = tmpObject.startIndex;

            });
        };
        $scope.execl = function () {
            $scope.selectPage(1);
            var timer = setTimeout(function () {
                window.location.href = "http://120.76.44.113:8081/excel";
                clearTimeout(timer);
            }, 2500);

        };
        $scope.selectPage(1);
    })
    .factory("riskService", function ($http, $q, $mdDialog, $location) {
        var userInfo;
        var auditList;
        var validationList;
        var totalCount;
        var tmpObj = {};
        var interviewImg = {};
        return {
            synAuditList: function (page, userId, token) {
                return $http.get(HOST_URL + "/user/getLoanAuditList?token=" + token).success(function (responseData) {
                    auditList = responseData;
                }).error(function (responseData) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent(responseData.error)
                            .ok('确定')
                    );
                })
            },
            getAuditList: function () {
                return auditList;
            },
            //查看借款人区块，刷新信息
            synLoanerInfoBlock: function (loanId, token) {
                return $http.get(HOST_URL + "/loan/" + loanId + "/userInfo?token=" + token).success(function (responseData) {
                    userInfo = responseData;
                }).error(function (responseData) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent(responseData.error)
                            .ok('确定')
                    );
                })
            },
            getUserInfo: function () {
                return userInfo;
            },
            synValidationBlock: function (loanId, token) {
                return $http.get(HOST_URL + "/loan/" + loanId + "/userValidations?token=" + token).success(function (responseData) {
                    validationList = responseData;
                }).error(function (responseData) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent(responseData.error)
                            .ok('确定')
                    );
                })
            },
            getValidationList: function () {
                return validationList;
            },
            selectPage: function (url, urlForCount, data) {
                var url_data = "?";

                function isType(obj, type) {
                    return Object.prototype.toString.call(obj) === "[object " + type + "]";
                }

                for (var item in data) {
                    if (isType(data[item], "Object")) {
                        if (item == "keyword") {
                            url_data += "keyword=&";
                        }
                        for (var ite in data[item]) {
                            // 如果是二层数组，key是value，value是key
                            url_data += ite + "=" + data[item][ite] + "&";
                        }
                    } else {
                        url_data += item + "=" + data[item] + "&";
                    }
                }
                var promiseA = $http.get(HOST_URL + urlForCount + url_data).success(function (responseData) {
//              	console.log(urlForCount ,url_data);
                    totalCount = responseData.total;
                    
//                  console.log(responseData);
                }).error(function (responseData) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent(responseData.error)
                            .ok('确定')
                    );
                });

                return promiseA.then(function () {
                    return $http.get(HOST_URL + url + url_data, data).success(function (responseData) {
//                  	 console.log(responseData);
                        var items = responseData;
                        var eachPages = data.limit;
                        var totalPage = Math.ceil(totalCount / data.limit);
                        var page = data.page;
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
                    }).error(function (responseData) {
                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title('提示')
                                .textContent(responseData.error)
                                .ok('确定')
                        );
                    });
                });
            },
            getResult: function () {
                return tmpObj;
            },
            getImageUrlsPromise: function (data) {
                return $http.post(
                    HOST_URL + "/risk/image/list?token=" + localStorage.token,
                    data,
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                ).error(function (responseData) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('提示')
                            .textContent(responseData.error)
                            .ok('确定')
                    );
                });
            },

            saveAudit: function (data, token, loanId, action) {
                var req = angular.copy(data);

                if(req['40500']!=undefined && req['40500'].score!=null)
                {
                    req['40500'].score = req['40500'].score * 1000;
                }

                return $http.post(HOST_URL + "/loan/" + loanId + "/userValidations?token=" + token + "&action=" + action, req).success(function () {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('消息')
                            .textContent('操作成功')
                            .ok('确定')
                    ).finally(function () {
                        if (action != "save") {
                            $location.path('/windcontrol/information_autable');
                        }
                    });
                }).error(function (respsonseData) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('失败')
                            .textContent(respsonseData.error)
                            .ok('确定')
                    );
                });
            },
            synInterviewImg: function (token, loanId) {
                return $http.get(HOST_URL + "/loan/" + loanId + "/interviewImg?token=" + token).success(function (responseData) {
                    interviewImg = responseData;
                })
            },
            getInterviewImg: function () {
                return interviewImg;
            }
        }
    })

    .directive('pointToYuan', function () {
        return {
            require: 'ngModel',
            scope: {
                ngModel: '='
            },
            link: function (scope, element, attrs, ngModel) {
                ngModel.$parsers.push(function (value) {
                    return '' + value;
                });
                ngModel.$formatters.push(function (value) {
                    return parseFloat(value);
                });
            }
        };
    })

    .directive('stringToNumber', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                ngModel.$parsers.push(function (value) {
                    return '' + value;
                });
                ngModel.$formatters.push(function (value) {
                    return parseFloat(value, 10);
                });
            }
        };
    })

    .directive('mdImg', function ($http) {
        return {
            restrict: 'EA',
            replace: true,
            scope: true,
            template: getTemplate,
            link: postLink
        };

        function getTemplate(elem, attr) {
            return '<img style="width: 300px;height: 160px">';
        }

        function postLink(scope, elem, attr) {
            var i = 0;
            var timer = setInterval(function () {

                if (attr.imgKey != "" && attr.imgKey != undefined) {
                    clearInterval(timer);
                    if (attr.imgKey.indexOf('upload') > -1) {
                        elem.attr('src', "http://120.25.147.123/" + attr.imgKey);
                    } else {
                        $http.get(HOST_URL + "/loan/" + attr.loanId + '/interview?type=GET&token=' + localStorage.getItem('token') + '&key=' + attr.imgKey).success(function (responseData) {
                            elem.attr('src', responseData.url);
                        })
                    }
                } else {
                    ++i;
                    if (i > 10) {
                        clearInterval(timer);
                    }
                }
            }, 1000);

            elem.on('click', function () {
                scope.$parent.$apply(function () {
                    scope.$parent.showImg = true;
                    scope.$parent.fullImgUrl = elem.attr('src');
                });
            });

        }
    })

    .directive('mdUpload', function ($mdButtonInkRipple, $mdTheming, $mdAria, $timeout) {

        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            scope: {},
            template: getTemplate,
            link: postLink
        };

        //获取权限ajax
        function send_request(scope) {
            var xmlhttp = null;
            if (window.XMLHttpRequest) {
                xmlhttp = new XMLHttpRequest();
            }
            else if (window.ActiveXObject) {
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }

            if (xmlhttp != null) {
                var serverUrl = scope.serverHost
                    + '/loan/'
                    + scope.loanId
                    + '/interview?type=PUT&token='
                    + localStorage.getItem("token")
                    + "&key="
                    + scope.uploadType;
                xmlhttp.open("GET", serverUrl, false);
                xmlhttp.send(null);
                return xmlhttp.responseText
            }
            else {
                alert("您的浏览器不支持 XMLHTTP.");
            }
        }

        //获取权限data
        function get_signature(scope) {
            //可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲
            var now = Date.parse(new Date()) / 1000;
            if (scope.expire == undefined || scope.expire < now + 3) {
                var body = send_request(scope);
                var obj = eval("(" + body + ")");
                scope.host = obj['host'];
                scope.policyBase64 = obj['policy'];
                scope.accessid = obj['accessid'];
                scope.signature = obj['signature'];
                scope.expire = parseInt(obj['expire']);
                scope.callbackbody = obj['callback'];
                scope.key = obj['dir'];
            }
        }

        function get_suffix(filename) {
            var pos = filename.lastIndexOf('.');
            var suffix = '';
            if (pos != -1) {
                suffix = filename.substring(pos)
            }
            return suffix;
        }

        function random_string(len) {
            len = len || 32;
            var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
            var maxPos = chars.length;
            var pwd = '';
            for (var i = 0; i < len; i++) {
                pwd += chars.charAt(Math.floor(Math.random() * maxPos));
            }
            return pwd;
        }

        function set_upload_param(up, scope, fileName) {
            get_signature(scope);
            scope.randName = random_string(16) + get_suffix(fileName);
            var new_multipart_params = {
                'key': scope.key + scope.randName,
                'policy': scope.policyBase64,
                'OSSAccessKeyId': scope.accessid,
                'success_action_status': '200', //让服务端返回200,不然，默认会返回204
                'callback': scope.callbackbody,
                'signature': scope.signature
            };

            up.setOption({
                'url': scope.host,
                'multipart_params': new_multipart_params
            });

            up.start();
        }

        function isAnchor(attr) {
            return angular.isDefined(attr.href) || angular.isDefined(attr.ngHref) || angular.isDefined(attr.ngLink) || angular.isDefined(attr.uiSref);
        }

        function getTemplate(element, attr) {
            if (isAnchor(attr)) {
                return '<a class="md-button" ng-transclude></a>';
            } else {
                //If buttons don't have type="button", they will submit forms automatically.
                var btnType = (typeof attr.type === 'undefined') ? 'button' : attr.type;
                return '<button class="md-button" type="' + btnType + '" ng-transclude></button>';
            }
        }

        function postLink(scope, element, attr) {

            $mdTheming(element);
            $mdButtonInkRipple.attach(scope, element);

            // Use async expect to support possible bindings in the button label
            $mdAria.expectWithText(element, 'aria-label');

            // For anchor elements, we have to set tabindex manually when the
            // element is disabled
            if (isAnchor(attr) && angular.isDefined(attr.ngDisabled)) {
                scope.$watch(attr.ngDisabled, function (isDisabled) {
                    element.attr('tabindex', isDisabled ? -1 : 0);
                });
            }

            // disabling click event when disabled is true
            element.on('click', function (e) {
                if (attr.disabled === true) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                }
            });

            // restrict focus styles to the keyboard
            scope.mouseActive = false;
            element.on('mousedown', function () {
                scope.mouseActive = true;
                $timeout(function () {
                    scope.mouseActive = false;
                }, 100);
            })
                .on('focus', function () {
                    if (scope.mouseActive === false) {
                        element.addClass('md-focused');
                    }
                })
                .on('blur', function (ev) {
                    element.removeClass('md-focused');
                });

            scope.uploadType = attr.uploadType;
            scope.loanId = attr.loanId;
            scope.serverHost = HOST_URL;
            scope.ossHost = "http://oss.aliyuncs.com";
            init(element, element.get(0).parentNode, scope);
        }

        function init(elem, container, scope) {

            var uploader = new plupload.Uploader({
                runtimes: 'html5,flash,silverlight,html4',
                browse_button: elem.get(0),
                container: container,
                multi_selection: false,
                flash_swf_url: '../../resource/upload/lib/plupload-2.1.2/js/Moxie.swf',
                silverlight_xap_url: '../../resource/upload/lib/plupload-2.1.2/js/Moxie.xap',
                url: scope.ossHost,
                drop_element: container,

                filters: {
                    mime_types: [ //只允许上传图片和zip,rar文件
                        {title: "Image files", extensions: "jpg,gif,png,bmp"}
                        // {title: "Zip files", extensions: "zip,rar"}
                    ],
                    max_file_size: '2mb', //最大只能上传5mb的文件
                    prevent_duplicates: true //不允许选取重复文件
                },

                init: {

                    FilesAdded: function (up, files) {
                        container.innerHTML = '<div style="margin-top: 40%" id="' + files[0].id + '">' + files[0].name + ' (' + plupload.formatSize(files[0].size) + ')<b></b>'
                            + '<div class="progress" style="width: 100%;"><div class="progress-bar" style="width: 0%"></div></div>'
                            + '</div>';
                        set_upload_param(up, scope, files[0].name)
                    },

                    BeforeUpload: function (up, file) {
                    },

                    UploadProgress: function (up, file) {
                        var d = container.firstChild;
                        d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
                        var prog = d.getElementsByTagName('div')[0];
                        var progBar = prog.getElementsByTagName('div')[0];
                        progBar.style.width = file.percent + '%';
                        progBar.setAttribute('aria-valuenow', file.percent);
                    },

                    FileUploaded: function (up, file, info) {
                        if (info.status == 200) {
                            var postData = {};
                            postData["imgKey"] = scope.key + scope.randName;
                            postData["type"] = scope.uploadType;
                            postData = JSON.stringify(postData);
                            $.ajax({
                                url: scope.serverHost + "/loan/" + scope.loanId + "/interview?token=" + localStorage.getItem("token"),
                                type: 'POST',
                                data: postData,
                                contentType: 'application/json',
                                success: function (data, status, xhr) {
                                    container.innerHTML = '上传成功';
                                },
                                Error: function (xhr, error, exception) {
                                    container.innerHTML = '上传失败';
                                }
                            });
                            // document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = ' 上传成功，文件名：' + get_uploaded_object_name(file.name);
                        }
                        else {
                            container.innerHTML = '上传失败:' + info.response;
                        }
                    },

                    Error: function (up, err) {
                        if (err.code == -600) {
                            container.appendChild(document.createTextNode("\n选择的文件超过了2M"));
                        }
                        else if (err.code == -601) {
                            container.appendChild(document.createTextNode("\n选择的文件后缀不对"));
                        }
                        else if (err.code == -602) {
                            container.appendChild(document.createTextNode("\n这个文件已经上传过一遍了"));
                        }
                        else {
                            container.appendChild(document.createTextNode("\nError xml:" + err.response));
                        }
                    }
                }
            });
            uploader.init();
        }

    }).$inject = ["$mdButtonInkRipple", "$mdTheming", "$mdAria", "$timeout", "$http"];