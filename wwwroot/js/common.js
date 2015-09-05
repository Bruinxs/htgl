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
    $.ajax(obj);
};

//路由设置
var _route={};