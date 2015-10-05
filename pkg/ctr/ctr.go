package ctr

import (
	"flag"
)

/**
命令控制模块
*/

//1，重读配置文件

//开始程序的参数
var (
	//配置文件路径
	configFile = ""
)

func init() {
	flag.StringVar(&configFile, "c", "default.config", "配置文件路径")
}
