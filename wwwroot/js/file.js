/**
 * Created by PCXS on 2015/8/31.
 */

(function () {
    var _fileApp = angular.module("fileApp", []);
    var _fileList;   //文件列表内容
    var _filePath;  //当前文件列表路径

    _currentPath = function () {
        return _filePath;
    };

    //路由设置
    (function () {
        _route.removeFile = "/removefile";    //删除文件路由
        _route.renameFile = "/renamefile";    //重命名文件
        _route.makedirFile = "/makedirfile";  //新建文件夹
    })();

    //权限定义
    (function () {
        _permissionID.removeFile = 0;   //删除文件
        _permissionID.renameFile = 1;   //重命名文件
        _permissionID.makedirFile = 2;    //新建文件夹
        _permissionID.downloadFile = 3;   //下载文件
        _permissionID.uploadFile = 4; //上传文件
    })();

    //按钮行为控制
    (function () {
        //数据包
        var newPack = function (currentpath, filename, filelist) {
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
        _newPack = newPack;

        //文件信息
        var newFileInfo = function (selected, name, size, date, md5) {
            var file = {
                fileselect: selected,
                filename: name,
                filesize: size + "bytes",
                filedate: date,
                filemd5: md5
            };
            return file;
        };

        //上传文件
        var uploadBtnClick = function () {
            trace("uploadBtnClick");
            if (!_isPermissible(_permissionID.uploadFile)) {
                _permissionError("上传文件");
                return;
            }
            if (window.File && window.FileReader && window.FileList && window.Blob) {
                _setModalType(_modalType.uploadfile);
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
                a.href = "js/file.js";
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
                data: newPack(_filePath, name),
                success: function (result) {
                    var rel = _parseAndCheck(result);
                    if (rel) {
                        var obj = JSON.parse(rel.content);
                        _fileList.push(newFileInfo(false, obj.filename, "--", rel.filedate, "--"));
                    }
                },
                error: _errorHandler
            });
        };

        //移动到
        var movetoBtnClick = function () {
            trace("movetoBtnClick");
        };

        //复制到
        var copytoBtnClick = function () {
            trace("copytoBtnClick");
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
                data: newPack(_filePath, _fileList[renameIndex].fileName),//{currentFilePath: _filePath, fileName: _fileList[renameIndex].fileName},
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
                data: newPack(_filePath, null, delfile),//{currentFilePath: _filePath, fileNameList: delfile},
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
    })();

    //面包屑路径控制
    (function () {
        _fileApp.controller("breadPathCtrl", function ($scope) {
        });
    })();

    (function () {
        //文件列表控制
        var files = [{fileselect: false, filename: "test11", filesize: "64k", filedate: "2015-7-1"},
            {fileselect: false, filename: "test22", filesize: "64k", filedate: "2015-7-1"},
            {fileselect: false, filename: "test33", filesize: "64k", filedate: "2015-7-1"},
            {fileselect: true, filename: "test44", filesize: "64k", filedate: "2015-7-1"},
            {fileselect: true, filename: "test55", filesize: "64k", filedate: "2015-7-1"}];

        _fileList = files;
        _fileApp.controller("fileListCtrl", function ($scope) {
            $scope.filelist = files;
        });
    })();

    //模态框控制
    var _modalType;
    var _setModalType;

    (function () {
        var modalScope;

        _modalType = (function () {
            var type = {};

            type.uploadfile = 0;  //上传文件模态框

            return type;
        })();

        _setModalType = function (type) {
            if (type == _modalType.uploadfile) {
                modalScope.title = "上传文件";
                modalScope.showmanage [type] = true;
                modalScope.leftbtn = "选择文件";
                modalScope.rightbtn = "上传";

                modalScope.leftBtnClick = function () {
                    $("#modalidentifier").on("hidden.bs.modal", function (e) {
                        var k = modalScope.filelist.length;
                        if (k > 0) {
                            modalScope.filelist.length = 0;
                        }
                    }, null, null, 1);
                    $("#fileselect").get(0).click();
                };

                modalScope.rightBtnClick = function () {

                };
            }
        };

        _fileApp.controller("modalCtrl", function ($scope) {
            modalScope = $scope;
            $scope.type = _modalType;
            $scope.title = "test title";
            $scope.showmanage = [];
            $scope.leftbtn = "leftbtn";
            $scope.rightbtn = "rightbtn";
            $scope.leftBtnClick = function () {
                trace("leftBtnClick");
            };
            $scope.rightBtnClick = function () {
                trace("rightBtnClick");
            };

            //文件上传
            $scope.showmanage[$scope.type.uploadfile] = false;
            $scope.filelist = [];
            $scope.onFileSelect = function (files) {
                for (var i = 0; i < files.length; i++) {
                    $scope.filelist[i] = {filename: files[i].name, filesize: files[i].size};
                }
                $scope.$apply();
            };
            $("#fileselect").get(0).onchange = function () {
                $scope.onFileSelect(this.files);
            };
        });
    })();
})();