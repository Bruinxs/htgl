package ctr

import (
	"flag"
	"htgl/pkg/config"
	"htgl/pkg/files"
	"htgl/pkg/log"
	"htgl/pkg/router"
	"net/http"
)

//配置文件字段
var (
	wwwroot = "wwwroot" //静态资源根目录
	filedir = "filedir" //文件管理目录
)

var (
	//日志前缀
	logprefix = "schedule:"
)

//开始程序
func Start() {
	flag.Parse()

	err := config.ParseConfig(configFile)
	if err != nil {
		log.LogFatal(logprefix, "解析配置文件时发生错误，", err)
	}

	initWwwroot()
	initFileManager()

	router.Listen()
}

//初始化根目录
func initWwwroot() {
	s := config.Value(wwwroot)
	root := ""
	if s == nil {
		root = "./wwwroot"
	} else {
		root = s.(string)
	}
	router.AddHandle("/", http.FileServer(http.Dir(root)))
}

//初始化文件管理模块
func initFileManager() {
	s := config.Value(filedir)
	if d, k := s.([]interface{}); k {
		for _, v := range d {
			if ss, ok := v.(string); ok {
				files.AddDirectory(ss)
			}
		}
	} else {
		log.LogError(logprefix, "获取文件管理目录失败")
	}
	router.AddHandlers(files.Rmux)
}
