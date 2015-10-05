/**
 * Created by PCXS on 2015/8/31.
 */
var _fileManager = _fileManager || {};

//模态框控制
(function (manager) {
    manager._fileApp = manager._fileApp || angular.module("fileApp", []);
    var _fileApp = manager._fileApp;

    //路由设置
    _route.fileList = "/filelist";    //文件列表

    var modalScope;

    manager._modalType = (function () {
        var type = {};

        type.uploadfile = 0;  //上传文件模态框
        type.directorytree = 1;   //目录树模态框
        type.movefile = 2;
        type.copyfile = 3;

        return type;
    })();

    manager._setModalType = function (type) {
        var _modalType = this._modalType;
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
                    modalScope.showmanage[_modalType.uploadfile] = false;
                }, null, null, 1);
                $("#fileselect").get(0).click();
            };

            modalScope.rightBtnClick = function () {
                manager._uploadFiles($("#fileselect").get(0).files);
            };
        } else if (type == _modalType.copyfile || type == _modalType.movefile) {
            modalScope.title = type == _modalType.copyfile ? "复制到" : "移动到";
            modalScope.showmanage [_modalType.directorytree] = true;
            modalScope.leftbtn = "取消";
            modalScope.rightbtn = "确定";

            modalScope.leftBtnClick = function () {
                var o = $("#modalidentifier");
                o.on("hidden.bs.modal", function (e) {
                    modalScope.showmanage[_modalType.directorytree] = false;
                }, null, null, 1);
                //o.hide();
                o.modal('hide');
            };

            modalScope.rightBtnClick = function () {
                $("#modalidentifier").on("hidden.bs.modal", function (e) {
                    modalScope.showmanage[_modalType.directorytree] = false;
                }, null, null, 1);
            };
        }
    };

    //请求目录列表
    var requestChildDir = function (path) {

        this._list = [newDir({}, "a/b", "name_fiel_1"),
            newDir({}, "a/b", "name_fiel_2"),
            newDir({}, "a/b", "name_fiel_3"),
            newDir({}, "a/b", "name_fiel_4"),
            newDir({}, "a/b", "name_fiel_5")
        ];
        return;

        path = path || this._path;
        ajax({
            url: _route.fileList,
            data: {path: path},
            context: this,
            success: function (result) {
                var rel = _parseAndCheck(result);
                if (rel) {
                    var arr = JSON.parse(rel.content);
                    var len = arr.length;
                    if (!len) {
                        trace("requestChildDir success arr is not array");
                    }
                    !this._list && (this._list = []);
                    this._list.length = len;
                    for (var i = 0; i < len; i++) {
                        this._list[i] = newDir({}, this._path + "/" + arr[i], arr[i]);
                    }
                    //modalScope.$apply();
                }
            },
            error: _errorHandler
        })
    };

    var drawTree = function (element) {
        var list = this._list;
        if (!list) {
            return null;
        }

        var p = $(element).children().get(0) || document.createElement("div");

        if (!this._isshow) {
            //p && (p.style.visibility = "collapse");   //性能好，但不知道为什么实现不了
            //p && (p.style.visibility = "hidden");
            element.removeChild(p); //性能很差
            return null;
        }

        p.className = "list-group";
        p.style.visibility = "visible";

        var children = $(p).children() || [];
        var c;
        for (var i = 0, len = list.length; i < len; i++) {
            c = children[i];
            if (!c) {
                c = document.createElement("li");
                c.type = "button";
                c.className = "list-group-item btn btn-default";
                c.style.textAlign = "left";

                p.appendChild(c);
            }

            (function (dir, ele) {
                ele.onclick = function (e) {
                    dir._onclick(this);
                    e.stopImmediatePropagation();
                };
                ele.innerHTML = dir._name;
                //ele.appendChild(dir._drawList());
                dir._drawList(ele);
            })(list[i], c);
        }

        if (element) {
            if (typeof(element) == "string") {
                element = $("#" + element).get(0);
            }
            element.appendChild(p);
        }

        return p;
    };

    var selectTab = {};

    var onclick = function (ele) {
        this._childDir();
        this._isshow = !this._isshow;
        this._drawList(ele);

        selectTab.dir = this;
        selectTab.elem && (selectTab.elem.className = "list-group-item btn btn-default");
        ele.className = "list-group-item active btn btn-default"
        selectTab.elem = ele;
    };

    var newDir = function (o, path, name) {
        o = o || {};
        o._path = path || "/";
        o._list = null;
        o._name = name || "";
        o._isshow = false;
        o._childDir = requestChildDir;
        o._drawList = drawTree;
        o._onclick = onclick;
        return o;
    };

    var rootdir = newDir();
    rootdir._isshow = true;
    rootdir._childDir();
    rootdir._drawList("rootdirectory");

    _fileApp.controller("modalCtrl", function ($scope) {
        modalScope = $scope;
        $scope.type = manager._modalType;
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

        //目录树
        $scope.showmanage[$scope.type.directorytree] = false;
        //$scope.rootdir = rootdir;
    });

})(_fileManager);
