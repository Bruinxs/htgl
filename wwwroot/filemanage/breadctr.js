/**
 * Created by PCXS on 2015/9/30.
 */
var _fileManager = _fileManager || {};

//面包屑路径控制
(function (manager) {
    manager._fileApp = manager._fileApp || angular.module("fileApp", []);
    var _fileApp = manager._fileApp;

    manager._currentPath = "/";   //当前文件列表路径

    manager._setCurrentPath = function (path) {
        if (!path) {
            return;
        }
        var sclice = path.split("/");
        var len = sclice.length;
        if (len < 2) {
            return;
        }
        manager._currentPath = path;

        breadScope.paths.length = len - 2;
        for (var i = 1; i < len - 1; i++) {
            breadScope.paths[i - 1] = sclice[i]
        }
        breadScope.current = sclice[len - 1];
        breadScope.$apply();
    };

    var breadScope;
    _fileApp.controller("breadPathCtrl", function ($scope) {
        $scope.paths = [];
        $scope.current = "";
        $scope.onItemClick = function (i) {
            if (isNaN(i)) {
                return;
            }
            var path = "";
            var len = $scope.paths.length;
            for (var j = 0; j < i; j++) {
                path += $scope.paths[j] + "/";
            }
            path = "/" + path + $scope.paths[i];
            manager._requestFileList(path);
        };
        $scope.onHomeClick = function () {
            manager._requestFileList("/");
        };

        breadScope = $scope
    });

})(_fileManager);