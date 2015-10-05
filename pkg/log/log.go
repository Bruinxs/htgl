package log

import (
	"log"
)

//日志级别划分
const (
	OFF   = iota //级别，用于关闭日志记录
	FATAL        //应用程序提前终止的严重错误
	ERROR        //运行时错误或意外情况
	WARN         //警告
	INFO         //感兴趣的运行时事件（启动/关闭）。一般这些信息将立即呈现在状态控制台上，因而要保守使用，并保持到最低限度。
	DEBUG        //系统的详细信息。一般这些信息只记录到日志文件中。
	TRACE        //最详细的信息。
)

var (
	//日志级别
	level = TRACE
)

//设置日志级别
func SetLevel(l int) {
	if l < OFF {
		l = OFF
	}
	if l > TRACE {
		l = TRACE
	}
	level = l
}

func LogFatal(v ...interface{}) {
	log.Fatalln(v...)
}

func LogError(v ...interface{}) {
	log.Panicln(v...)
}

func LogWarn(v ...interface{}) {
	log.Println(v...)
}

func LogInfo(v ...interface{}) {
	log.Println(v...)
}

func LogDebug(v ...interface{}) {
	log.Println(v...)
}

func LogTrace(v ...interface{}) {
	log.Println(v...)
}
