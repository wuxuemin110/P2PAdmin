$(function () {
    window.onload = function () {
        // 加载原图
        loadOriImg();
    }
    // 向父类添加active
    $('[role="radio-box"]').on("click", function () {
        var name = $(this).attr('name');
        if (name == '' || name == undefined)
        {
            $('[role="radio-box"]').parent().removeClass('active');
        }
        else
        {
            $('[name="'+name+'"]').parent().removeClass('active');
        }
        $(this).parent().addClass('active');
    });
    // tab
    $('[role="tab"]').on("click", function () {
        var obj = $(this);
        var openModel = obj.attr('open-model');
        var name = obj.attr('name');
        $('[name="'+name+'"]').each(function(){
            var _openModel = $(this).attr('open-model');
            $(this).parent().removeClass('active');
            $('#'+_openModel).removeClass('active').removeClass('in');
        });
        obj.parent().addClass('active');
        $('#'+openModel).addClass('active').addClass('in');
    });
    // 查看原图
    $('[role="open-img"]').on("click", function () {
        // 原始图路径
        var oriSrc = $(this).attr('ori-src');
        // 最大高度
        var maxHeight = $(window).height() - 120;
        $('#show-img').html('<img class="fade" style="max-height:' + maxHeight + 'px" src="' + oriSrc + '" />').show();
        setTimeout(function () {
            $('#show-img').find('img').addClass('in');
        }, 200);
    });
    // 隐藏图片
    $('#show-img').on("click", function () {
        $(this).html('').hide();
    });
});

// 加载原图
function loadOriImg()
{
    setTimeout(function () {
        $('[role="ajax-img"]').each(function () {
            var oriSrc = $(this).attr('ori-src');
            $(this).attr('src', oriSrc);
        });
    }, 500);
}

// 确认是否登录
function checkLogin(obj)
{
    var state = $("#checkLoginState").val();
    if (state != "ok")
    {
        var href = $(obj).attr('href');
        var target = $(obj).attr('target');
        $(obj).attr('href', 'javascript:;');
        $(obj).attr('target', '');
        if (confirm('尚未登录，是否需要登录？'))
        {
            $(obj).attr('href', href);
            $(obj).attr('target', target);
        }
        else
        {
            setTimeout(function () {
                $(obj).attr('href', href);
                $(obj).attr('target', target);
            }, 500);
        }
    }
    return true;
}