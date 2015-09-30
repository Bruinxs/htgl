/**
 * Created by PCXS on 2015/9/5.
 */

//路由设置
(function () {
    _route.checkfile = "/checkfile";  //检查文件 权限，重名，断点
    _route.uploadfile = "/uploadfile";    //上传文件
})();


var _newPack = function (currentpath, filename, filelist) {
    return {currentFilePath: currentpath, fileName: filename, fileNameList: filelist};
};

var _currentPath = function () {
    return ""
};

var _uploadFiles = (function () {
    var uploadSize = 1024 * 1024;  //每次上传的数据大小
    var number = "number"; //number 字段，表示第几块
    var blob = "blob";   //blob 表示二进制块

    var blobSlice = File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice;  //file的slice方法，注意它的兼容性，在不同浏览器的写法不同
    var formdata = new FormData();
    var xhr = new XMLHttpRequest();

    var nextload = function (i, n, start, end, router) {
        formdata.append(number, i);
        formdata.append(blob, blobSlice.call(this, start, end));
        xhr.open("POST", router, true);
        xhr.upload.onloadend = function () {
        };
        xhr.send(formdata);
    };

    //size:已经上传的大小  router:临时路由
    var upload = function (hadsize, router) {
        var filesize = this.size - hadsize;   //还需要上传的数据大小
        var num = Math.ceil(filesize / uploadSize);
        var start = hadsize;
        var end = start + uploadSize;
        nextload.call(this, 0, num, start, end, router);
    };

    return function (files, onprogress) {
        var len = files.length;
        for (var i = 0; i < len; i++) {
            var file = files[i];
            file.myonprogress = onprogress;
            ajax({
                url: _route.checkfile,
                data: _newPack(_currentPath(), file.name),
                context: file,
                success: function (result) {
                    var rel = _parseAndCheck(result);
                    if (rel) {
                        var obj = JSON.parse(rel.content);
                        upload.call(this, obj.size, obj.route);
                    }
                },
                error: _errorHandler
            });
        }
    };
})();
