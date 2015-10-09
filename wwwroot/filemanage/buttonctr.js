/**
 * Created by PCXS on 2015/9/30.
 */
var _fileManager = _fileManager || {};

//按钮行为控制
(function (manager) {
    manager._fileApp = manager._fileApp || angular.module("fileApp", []);
    var _fileApp = manager._fileApp;

    //路由设置
    _route.removeFile = "/removefile";    //删除文件路由
    _route.renameFile = "/renamefile";    //重命名文件
    _route.makedirFile = "/makedirfile";  //新建文件夹

    //权限定义
    _permissionID.removeFile = 0;   //删除文件
    _permissionID.renameFile = 1;   //重命名文件
    _permissionID.makedirFile = 2;    //新建文件夹
    _permissionID.downloadFile = 3;   //下载文件
    _permissionID.uploadFile = 4; //上传文件
    _permissionID.moveFile = 5;   //移动文件
    _permissionID.copyFile = 6;   //复制文件

    //上传文件
    var uploadBtnClick = function () {
        trace("uploadBtnClick");
        if (!_isPermissible(_permissionID.uploadFile)) {
            _permissionError("上传文件");
            return;
        }
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            manager._setModalType(manager._modalType.uploadfile);
            $("#modalidentifier").modal();
        } else {
            _warn("浏览器不支持 File 接口");
        }
    };

    //下载文件
    var downloadBtnClick = function () {
        trace("downloadBtnClick");
        if (!_isPermissible(_permissionID.downloadFile)) {
            return;
        }
        var files = [];
        for (var i = _fileList.length - 1; i >= 0; i--) {
            if (_fileList[i].fileselect) {
                files.push(_fileList[i].filename);
            }
        }
        var len = files.length;
        if (len == 0) {
            return;
        }
        var a = document.createElement("a");
        for (var i = 0; i < len; i++) {
            a.download = files[i];
            a.href = "js/modalctr.js";
            a.click();
        }
    };

    //新建文件夹
    var makedirBtnClick = function () {
        trace("makedirBtnClick");
        //_fileList.push(
        //    {fileselect: true, filename: "add", filesize: "1024k", filedate: "2015-7-2"}
        //);
        if (!_isPermissible(_permissionID.makedirFile)) {
            _permissionError("新建文件夹");
            return;
        }
        var name = prompt("文件夹名");
        if (name == null) {
            return;
        }

        ajax({
            url: _route.makedirFile,
            data: manager._newPack(_filePath, name),
            success: function (result) {
                var rel = _parseAndCheck(result);
                if (rel) {
                    var obj = JSON.parse(rel.content);
                    _fileList.push(manager._newFileInfo(false, obj.filename, "--", rel.filedate, "--"));
                }
            },
            error: _errorHandler
        });
    };

    //移动到
    var movetoBtnClick = function () {
        trace("movetoBtnClick");
        if (!_isPermissible(_permissionID.moveFile)) {
            _permissionError("移动文件");
            return;
        }
        manager._setModalType(manager._modalType.movefile);
        $("#modalidentifier").modal();
    };

    //复制到
    var copytoBtnClick = function () {
        trace("copytoBtnClick");
        if (!_isPermissible(_permissionID.copyFile)) {
            _permissionError("复制文件");
            return;
        }
        manager._setModalType(manager._modalType.copyfile);
        $("#modalidentifier").modal();
    };

    //重命名文件
    var renameBtnClick = function () {
        trace("renameBtnClick");
        if (!_isPermissible(_permissionID.renameFile)) {
            _permissionError("重命名文件");
            return;
        }

        var len = _fileList.length;
        var selectleng = 0;
        var renameIndex = -1;
        for (var i = 0; i < len; i++) {
            if (_fileList[i].fileselect) {
                selectleng++;
                renameIndex = i;
            }
        }
        if (selectleng == 0) {
            return;
        } else if (selectleng > 1) {
            _warn("只能对一个文件进行重命名操作");
            return;
        }

        ajax({
            url: _route.renameFile,  //重命名请求路径
            data: manager._newPack(_filePath, _fileList[renameIndex].fileName),//{currentFilePath: _filePath, fileName: _fileList[renameIndex].fileName},
            success: function (result) {
                var rel = _parseAndCheck(result);
                if (rel) {
                    _fileList[renameIndex].filename = rel.content;
                }
            },
            error: _errorHandler
        });
    };

    //删除文件
    var removeBtnClick = function () {
        trace("removeBtnClick");
        if (!_isPermissible(_permissionID.removeFile)) {
            _permissionError("删除文件");
            return;
        }

        var len = _fileList.length;
        var delfile = [];
        var isHasFile = true;
        for (var i = 0; i < len;) {
            if (_fileList[i].fileselect) {
                if (isHasFile) {
                    if (!confirm("删除是不可恢复的，你确认要删除吗？")) {
                        return;
                    }
                    isHasFile = false;
                }
                delfile.push(_fileList.filename);
                //_fileList.splice(i, 1);
                //len--;
                //continue;
            }
            i++;
        }
        if (isHasFile) {
            return;
        }

        ajax({
            url: _route.removeFile,  //删除请求路径
            data: manager._newPack(_filePath, null, delfile),//{currentFilePath: _filePath, fileNameList: delfile},
            success: function (result) {
                var rel = _parseAndCheck(result);
                if (rel) {
                    var arr = JSON.parse(rel.content);
                    if (!arr || arr.length == undefined) {
                        trace("删除请求返回失败，返回信息：" + rel, "解析错误:" + arr);
                        return;
                    }
                    _fileList.length = 0;
                    for (var i = 0; i < arr.length; i++) {
                        _fileList.push(arr[i]);
                    }
                }
            },
            error: _errorHandler
        });
    };

    _fileApp.controller("fileBtnCtrl", function ($scope) {
        $scope.uploadBtnClick = uploadBtnClick;
        $scope.downloadBtnClick = downloadBtnClick;
        $scope.makedirBtnClick = makedirBtnClick;
        $scope.movetoBtnClick = movetoBtnClick;
        $scope.copytoBtnClick = copytoBtnClick;
        $scope.renameBtnClick = renameBtnClick;
        $scope.removeBtnClick = removeBtnClick;
    });

})(_fileManager);