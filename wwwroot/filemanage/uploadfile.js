/**
 * Created by PCXS on 2015/9/5.
 */

var _fileManager = _fileManager || {};

(function (manager) {
    //路由设置
    _route.checkfile = "/checkfile";  //检查文件 权限，重名，断点
    _route.uploadfile = "/uploadfile";    //上传文件

    //manager._newPack = function (currentpath, filename, filelist) {
    //    return {currentFilePath: currentpath, fileName: filename, fileNameList: filelist};
    //};

    //manager._currentPath = function () {
    //    return ""
    //};

    manager._uploadFiles = (function () {
        var uploadSize = 1024 * 1024;  //每次上传的数据大小
        var number = "number"; //number 字段，表示第几块
        var blob = "blob";   //blob 表示二进制块
        var isHandling = false;
        var uploadThread = 0;
        manager._maxUploadThread = 3; //最大同时上传文件数

        var blobSlice = File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice;  //file的slice方法，兼容性，在不同浏览器的写法不同
        var formdata = new FormData();
        var xhr = new XMLHttpRequest();

        var fileUplandHandler = function (file, i, n) {
            if (file._uploadHandler) {
                if (i == 0 && file._uploadHandler.onStart) {
                    file._uploadHandler.onStart();
                } else if (i == 1 && file._uploadHandler.onProgress) {
                    file._uploadHandler.onProgress(n);
                } else if (i == 2 && file._uploadHandler.onComplete) {
                    file._uploadHandler.onComplete();
                }
            }
        };

        var nextload = function (file, i, n, start, end, router) {
            formdata.append(number, i);
            formdata.append(blob, blobSlice.call(file, start, end));
            xhr.open("POST", router, true);
            xhr.upload.onloadend = function () {
                trace(file.name + " is load end " + i + "/" + n);
                if (i < n) {
                    var s = end + uploadSize;
                    var e = s + uploadSize;
                    if (e > file.size) {
                        e = file.size;
                    }
                    fileUplandHandler(file, 1, (i + 1) / n);
                    nextload(file, i + 1, n, s, e, router);
                } else {
                    fileUplandHandler(file, 2);
                    uploadThread--;
                    uploadNextFile();
                }
            };
            xhr.send(formdata);
        };

        //size:已经上传的大小  router:临时路由
        var upload = function (file, hadsize, router) {
            uploadThread++;
            var filesize = this.size - hadsize;   //还需要上传的数据大小
            var num = Math.ceil(filesize / uploadSize);
            var start = hadsize;
            var end = start + uploadSize;
            fileUplandHandler(file, 0);    //开始上传
            nextload(file, 0, num, start, end, router);
        };

        var uploadNextFile = function () {
            var o = manager._uploadQueue.pop();
            if (!o) {
                isHandling = false;
                return;
            }
            upload(o.file, o.hadsize, o.tmproute);
        };

        var handleUploadQueue = function () {
            //if (isHandling) {
            //    return;
            //}
            isHandling = true;
            var o;
            for (var i = 0, count = manager._maxUploadThread - uploadThread; i < count; i++) {
                o = manager._uploadQueue.pop();
                if (o) {
                    upload(o.file, o.hadsize, o.tmproute);
                }
            }
        };

        var startHandleUploadQueue = function () {
            if (!isHandling) {
                handleUploadQueue();
            }
        };

        //初始化上传队列
        var initUploadQueue = function (o) {
            if (o._uploadQueue) {
                return o._uploadQueue;
            }
            var tmp = {};
            o._uploadQueue = tmp;

            tmp._queue = [];
            tmp._start = 0;
            tmp._end = 0;

            tmp._count = function () {
                var count = this._end - this._start;
                if (count < 0) {
                    count = this._queue.length + count;
                }
                return count;
            };

            tmp._nextIndex = function () {
                if (this._end == this._queue.length && this._start > 1) {
                    this._end = 0;
                    return this._end++;
                }
                if ((this._end + 1) != this._start) {
                    return this._end++;
                }
                if (this._count() == 0) {
                    this._start = this._end = 0;
                    return this._end++;
                }
                if (this._end < this._start) {
                    var len = this._queue.length;
                    var extension = 5;
                    for (var i = len - 1; i >= this._start; i--) {
                        this._queue[i + extension] = this._queue[i];
                        if (i < this._start + extension) {
                            this._queue[i] = null;
                        }
                    }
                    this._start = this._start + extension;
                }
                return this._end++;
            };

            tmp._frontIndex = function () {
                if (this._count() == 0) {
                    return -1;
                }
                var n = this._start;
                this._start = (n + 1) % this._queue.length;
                return n;
            };

            tmp.push = function () {
                for (var i = 0, len = arguments.length; i < len; i++) {
                    this._queue[this._nextIndex()] = arguments[i];
                }
            };

            tmp.pop = function () {
                var i = this._frontIndex();
                if (i < 0) {
                    return null;
                }
                var file = this._queue[i];
                this._queue[i] = null;
                return file;
            };

            return tmp;
        };

        return function (files) {
            var len = files.length;
            for (var i = 0; i < len; i++) {
                var file = files[i];
                ajax({
                    url: _route.checkfile,
                    data: manager._newPack(manager._currentPath, file.name),
                    context: file,
                    success: function (result) {
                        var rel = _parseAndCheck(result);
                        if (rel) {
                            var obj = JSON.parse(rel.content);
                            var queue = manager._uploadQueue || initUploadQueue(manager);
                            queue.push({file: this, hadsize: obj.size, tmproute: obj.route});
                            startHandleUploadQueue();
                        }
                    },
                    error: _errorHandler
                });
            }
        };
    })();

})(_fileManager);