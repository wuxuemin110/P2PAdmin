// 页码与页数
var pageIndex = 1;
var pageSize = 30;
var totalPages = 0;
var callback = '';

function init(_pageIndex, _pageSize, _totalPages, _callback)
{
    pageIndex = _pageIndex;
    pageSize = _pageSize;
    totalPages = _totalPages;
    callback = _callback;
}

function next()
{
    if (pageIndex < totalPages)
    {
        pageIndex += 1;
        callback();
    }
}

function previous()
{
    if (pageIndex > 1)
    {
        pageIndex -= 1;
        callback();
    }
}

function firstPage()
{
    if (pageIndex > 1)
    {
        pageIndex = 1;
        callback();
    }
}

function lastPage()
{
    if (pageIndex < totalPages)
    {
        pageIndex = totalPages;
        callback();
    }
}

function jumpPage(n)
{
    pageIndex = n;
    callback();
}

function loadPagination(_pageIndex, _totalPages, _callback)
{
    if (_totalPages <= 1)
    {
        return;
    }
    pageIndex = _pageIndex;
    totalPages = _totalPages;
    callback = _callback;
    
    var _html_pagination = '<li id="firstPage" ' + (pageIndex == 1 ? 'class="disabled"' : '') + '>' + (pageIndex == 1 ? '' : '<a href="javascript:firstPage();">') + '<span aria-hidden="true">首页</span>' + (pageIndex == 1 ? '' : '</a>') + '</li>'
            +'<li id="Previous" ' + (pageIndex == 1 ? 'class="disabled"' : '') + '>' + (pageIndex == 1 ? '' : '<a href="javascript:previous();" aria-label="Previous">') + '<span aria-hidden="true">«</span>' + (pageIndex == 1 ? '' : '</a>') + '</li>';
    var i = (_pageIndex <= 4 ? 1 : _pageIndex - 3);
    var j = (_totalPages > (i + 6) ? i + 6 : _totalPages);
    
    if (_totalPages - _pageIndex <= 3 && _totalPages > 6)
    {
        i = _totalPages - 6;
    }
    
    for (;i <= j;i++)
    {
        _html_pagination += '<li' + (i == _pageIndex ? ' class="active"' : '') + '><a href="javascript:jumpPage(' + i + ');">' + i + '</a></li>';
    }
    
    if (j < _totalPages)
    {
        _html_pagination += '<li class="disabled"><span>……</span></li>';
    }
    
    _html_pagination += '<li id="Next" ' + (pageIndex == totalPages ? 'class="disabled"' : '') + '>' + (pageIndex == totalPages ? '' : '<a href="javascript:next();" aria-label="Next">') + '<span aria-hidden="true">»</span>' + (pageIndex == totalPages ? '' : '</a>') + '</li>'
            +'<li id="firstPage" ' + (pageIndex == totalPages ? 'class="disabled"' : '') + '>' + (pageIndex == totalPages ? '' : '<a href="javascript:lastPage();">') + '<span aria-hidden="true">尾页</span>' + (pageIndex == totalPages ? '' : '</a>') + '</li>';
    
    document.getElementById("pagination").innerHTML = _html_pagination;
}