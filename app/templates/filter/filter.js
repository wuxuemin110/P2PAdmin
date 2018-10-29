angular.module('myApp.filter', ['ngRoute'])
    .filter('TradeType', function () {
        return function (input) {
            input = parseInt(input);
            switch (input) {
                case 0:
                    return "默认";
                    break;
                case 100:
                    return "投资";
                    break;
                case 110:
                    return "使用红包券";
                    break;
                case 120:
                    return "使用体验金券";
                    break;
                case 130:
                    return "使用加息券";
                    break;
                case 200:
                    return "借款";
                    break;
                case 300:
                    return "充值现金";
                    break;
                case 310:
                    return "充值红包券";
                    break;
                case 320:
                    return "充值体验金券";
                    break;
                case 330:
                    return "充值加息券";
                    break;
                case 400:
                    return "收益";
                    break;
                case 500:
                    return "本金退出";
                    break;
                case 600:
                    return "提现";
                    break;
                case 700:
                    return "订单生成";
                    break;
                case 800:
                    return "活动";
                    break;
                case 810:
                    return "活动赠送红包券";
                    break;
                case 820:
                    return "活动赠送体验金券";
                    break;
                case 830:
                    return "活动赠送加息券";
                    break;
                case 900:
                    return "还款";
                    break;
                default:
                    return "未知状态，请联系管理员查询";
            }
        };
    })
    .filter('YuanToPoint', function () {
        return function (input) {
            input = parseFloat(input) * 100;
            return input;
        };
    })
    .filter('jsonDate', function () {
        return function (input) {
            if(input!=undefined){
                var pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
                var formatedDate = input.replace(pattern, '$1-$2-$3 $4:$5:$6');
                return formatedDate;
            }

        };
    })

    .filter('bracket', function () {
        return function (input) {
            if(input!=undefined){
                var pattern = /\[|]|"/g;
                var formatedDate = input.replace(pattern, '');
                return formatedDate;
            }

        };
    })

    .filter('newDate', function ($filter) {
        return function (input,format) {
	        if(input!=undefined){
	        var pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
            var formatedDate = input.replace(pattern, '$1-$2-$3 $4:$5:$6');
            formatedDate=formatedDate.replace(new RegExp(/-/gm) ,"/");
            formatedDate=new Date(formatedDate);
            formatedDate=formatedDate.getTime(); 
            return $filter("date")(formatedDate, format);
	        }
            
        };
    })
    .filter('PointToYuan', function () {
        return function (input) {
            if (input == undefined) {
                return '';
            }
            input = parseFloat(input) / 100;
            return input;
        };
    })

    .filter('Fee', function () {
        return function (input) {
            if (input < 100 && input > 0) {
                return 2;
            } else {
                return 0;
            }
        };
    })

    .filter('Status', function () {
        return function (input) {
            var items = {
                0: "正常",
                1: "异常",
                2: "锁定"
            };
            for (var item in items) {
                if (item == input) {
                    return items[item];
                }
            }
            return "未知";
        };
    })

    .filter('LoanAuditState', function () {
        return function (input) {
            var items = {
                0: "待资料齐全",
                1: "资料不全",
                100: "待资料审核",
                200: "待电话审核",
                300: "待消息调查",
                400: "待复审",
                500: "待复审",
                600: "待面签",
                700: "审核通过",
                710: "审核不通过"
            };
            for (var item in items) {
                if (item == input) {
                    return items[item];
                }
            }
            return "未知";
        };
    })

    .filter('LoanType', function () {
        return function (input) {
            var items = {
                1: "",
                2: "",
                3: "",
                4: "",
                5: ""
            };
            for (var item in items) {
                if (item == input) {
                    return items[item];
                }
            }
            return "未知";
        };
    })

    .filter('BankCode', function () {
        return function (input) {
            var items = {
                1: "中国工商银行",
                2: "中国农业银行",
                3: "中国建设银行",
                4: "民生银行",
                5: "中国银行",
                6: "兴业银行",
                7: "光大银行",
                8: "中信银行",
                9: "平安银行",
                10: "邮政银行",
                11: "交通银行",
                12: "广发银行",
                13: "浦发银行",
                14: "招商银行",
                15: "华夏银行"
            };
            for (var item in items) {
                if (item == input) {
                    return items[item];
                }
            }
            return "请选择银行";
        };
    })

    .filter('Sex', function () {
        return function (input) {
            switch (input) {
                case 1:
                case '1':
                    return '男';
                case 2:
                case '2':
                    return '女';
                default:
                    return '未知';
            }
        }
    })

    .filter('OptionToScore', function () {
        var optionToScore = {
            "38530": "0",
            "38531": "-10",
            "101000": "0",
            "101001": "-50",
            "102000": "0",
            "102001": "-50",
            "103000": "0",
            "103001": "3",
            "103002": "5",
            "103003": "8",
            "103004": "-50",
            "104000": "-50",
            "104001": "-50",
            "104002": "0",
            "104003": "2",
            "104004": "3",
            "104005": "4",
            "105000": "0",
            "105001": "0",
            "106000": "0",
            "106001": "5",
            "107000": "0",
            "107001": "-2",
            "108000": "0",
            "108001": "0",
            "201000": "0",
            "201001": "0",
            "201002": "-5",
            "201003": "-10",
            "202000": "0",
            "202001": "0",
            "202002": "-5",
            "202003": "-10",
            "204000": "0",
            "204001": "-5",
            "204002": "-10",
            "205000": "0",
            "205001": "-5",
            "205002": "-10",
            "301000": "0",
            "301001": "0",
            "302000": "0",
            "302001": "0",
            "304000": "0",
            "304001": "0",
            "305000": "0",
            "305001": "-10",
            "305002": "-30",
            "306000": "0",
            "306001": "0",
            "307000": "0",
            "307001": "-5",
            "307002": "-15",
            "307003": "-50",
            "308000": "0",
            "308001": "-10",
            "308002": "-15",
            "309000": "0",
            "309001": "-10",
            "309003": "-10",
            "309004": "-15",
            "309005": "-20",
            "310000": "10",
            "310001": "5",
            "310002": "0",
            "310003": "-5",
            "311000": "10",
            "311001": "5",
            "311002": "0",
            "311003": "-5",
            "312000": "0",
            "312001": "-5",
            "313000": "0",
            "313001": "10",
            "315000": "5",
            "315001": "3",
            "315002": "3",
            "315003": "3"
        };
        return function (input) {
            return optionToScore[input];
        }

    })

    .filter("AuditState", function () {
        return function (input) {
            switch (input) {
                case 110:
                case '110':
                    return "等待审核";
                case 120:
                case '120':
                    return "审核中";
                case 130:
                case '130':
                    return "审核通过";
                case 140:
                case '140':
                    return "审核失败";
                case 210:
                case '210':
                    return "还款中";
                case 220:
                case '220':
                    return "已结束";
                default:
                    return "等待中";
            }
        }
    })

    .filter("GraduationDate", function () {
        return function (input) {
            var date = parseInt(input);
            return date * 1000;
        }
    })

    .filter("RepaymentState", function () {
        return function (input) {
            switch (input) {
                case 100:
                    return "待还款";
                case '100':
                    return "待还款";
                case 200:
                    return "逾期";
                case '200':
                    return "逾期";
                case 210:
                    return "严重逾期(超30天)";
                case '210':
                    return "严重逾期(超30天)";
                case 300:
                    return "已还款";
                case '300':
                    return "已还款";
                case 400:
                    return "一次性还款";
                case '400':
                    return "一次性还款";
                default:
                    return "未知";
            }
        }
    })

    .filter('LoanState', function () {
        return function (input) {
            input = '' + input;
            input = parseInt(input);
            switch (input) {
                case 110:
                    return '待审核';
                case 120:
                    return '审核中';
                case 130:
                    return '通过';
                case 140:
                    return '未通过';
                case 210:
                    return '还款中';
                case 220:
                    return '已结清';
                default:
                    return '异常';
            }
        }
    })

    .directive("fileread", [function () {
        return {
            scope: {
                fileread: "="
            },
            link: function (scope, element, attributes) {
                element.bind("change", function (changeEvent) {
                    scope.$apply(function () {
                        scope.fileread = changeEvent.target.files[0];
                        // or all selected files:
                        // scope.fileread = changeEvent.target.files;
                    });
                });
            }
        }
    }])

;

