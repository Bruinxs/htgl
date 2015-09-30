/**
 * Created by PCXS on 2015/8/31.
 */
//日志
var trace = function () {
    var s = "";
    for (var i = 0; i < arguments.length; i++) {
        if (i > 0) {
            s += ",";
        }
        s += arguments[i];
    }
    console.log(s);
};

//异步请求
var ajax = function (obj) {
    if (!obj.dataType) {
        obj.dataType = "json";
    }
    $.ajax(obj);
};

//请求返回包的解析及排查
var _parseAndCheck = function (result) {
    //var rel = JSON.parse(result);
    var rel = result;
    if (!rel) {
        _warn("解析失败");
        trace("解析失败", result);
        return;
    }
    if (!rel.status || rel.status == 0) {
        _warn("操作失败，状态：" + rel.status + ",错误：" + rel.content);
        return;
    }
    return rel;
};

//请求错误处理
var _errorHandler = function (xhr, status, error) {
    _warn("请求失败，错误信息：" + error);
};

//路由设置
var _route = {};