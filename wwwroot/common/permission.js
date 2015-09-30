/**
 * Created by PCXS on 2015/8/31.
 */
var _permissionID = (function () {
    var _pid = {};
    return _pid;
})();

var _isPermissible = function (Id) {
    return true;
};

var _warn = function (content) {
    alert(content);
};

var _permissionError = function (err) {
    _warn("权限不足，操作：" + err);
};