package router

import (
	"log"
	"net/http"
	"strconv"
	"time"
)

/**
管理主机上的路由
不同端口管理不同路由器
并使http服务器透明
*/

var (
	//端口列表，每个端口对应一个路由管理器
	portList = make(map[int]*Router)
)

//路由管理器
type Router struct {
	server *http.Server
	mux    *http.ServeMux
}

//根据端口获得对应路由管理器
func NewRouter() *Router {
	m := http.NewServeMux()
	addr := ":80"
	s := &http.Server{
		Addr:           addr,
		Handler:        m,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 0,
	}

	r := &Router{
		server: s,
		mux:    m,
	}

	return r
}

// var (
// 	defaultRouter = GetRouter(80)
// )

//指定该路由器一个可选的错误日志记录器，用于记录接收连接时的错误和处理器不正常的行为。
func (this *Router) SetErrLog(l *log.Logger) {
	this.server.ErrorLog = l
}

//设置端口
//在 Listen 前调用
func (this *Router) SetPort(p int64) {
	this.server.Addr = ":" + strconv.FormatInt(p, 10)
}

// //设置默认路由器的错误日志记录器
// func SetErrLog(l *log.Logger) {
// 	defaultRouter.SetErrLog(l)
// }

//添加路由集合到该路由器
func (this *Router) AddHandlers(mux RouterMux) {
	m := mux.Routers()
	for s, h := range m {
		this.mux.Handle(s, h)
	}
}

// //添加路由集合到默认路由器
// func AddHandlers(mux RouterMux) {
// 	defaultRouter.AddHandlers(mux)
// }

// 添加一条路由到该路由器
func (this *Router) AddHandle(pattern string, handler http.Handler) {
	this.mux.Handle(pattern, handler)
}

// //添加一条路由到默认路由器
// func AddHandle(pattern string, handler http.Handler) {
// 	defaultRouter.AddHandle(pattern, handler)
// }

//监听设置了路由的端口
func (this *Router) Listen() {
	this.server.ListenAndServe()
}
