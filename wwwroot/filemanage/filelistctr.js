/**
 * Created by PCXS on 2015/9/30.
 */
var _fileManager = _fileManager || {};

//文件列表控制
(function (manager) {
    manager._fileApp = manager._fileApp || angular.module("fileApp", []);
    var _fileApp = manager._fileApp;

    //路由
    _route.fileList = "/filelist";    //文件列表路由

    manager._fileList = [];  //文件列表

    //数据包
    manager._newPack = function (currentpath, filename, filelist) {
        var pack = {};
        if (currentpath) {
            pack.currentFilePath = currentpath;
        }
        if (filename) {
            pack.fileName = filename;
        }
        if (filelist) {
            pack.fileNameList = filelist;
        }
        return pack;
    };

    manager._requestFileList = function (path) {
        path = path || manager._currentPath || "/";
        ajax({
            url: _route.fileList,
            type: "GET",
            data: manager._newPack(path),
            success: function (result) {
                var rel = _parseAndCheck(result);
                if (rel) {
                    var arr = JSON.parse(rel.content);
                    var len = arr.length;
                    if (isNaN(len)) {
                        trace("请求文件列表，返回错误", arr);
                        return;
                    }
                    manager._fileList.length = len;
                    for (var i = 0; i < len; i++) {
                        if (arr[i].fileselect == undefined) {
                            arr[i].fileselect = false
                        }
                        manager._fileList[i] = arr[i];
                    }
                }
            },
            error: _errorHandler
        });
    };

    manager._requestFileList();

    _fileApp.controller("fileListCtrl", function ($scope) {
        $scope.filelist = manager._fileList;
    });

})(_fileManager);