/**
 * Created by PCXS on 2015/9/30.
 */
var _fileManager = _fileManager || {};

//面包屑路径控制
(function (manager) {
    manager._fileApp = manager._fileApp || angular.module("fileApp", []);
    var _fileApp = manager._fileApp;

    manager._currentPath = "/";   //当前文件列表路径

    _fileApp.controller("breadPathCtrl", function ($scope) {
    });

})(_fileManager);