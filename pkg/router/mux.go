package router

import (
	"net/http"
)

//实现RouterMux接口的对象可以获得路由集合
type RouterMux interface {
	Routers() map[string]http.Handler
}

//一种路由集合类型
type Mux map[string]http.Handler

//获得一个路由集合对象
func NewMux() Mux {
	return make(Mux)
}

//添加一条路由到该路由集合
func (this Mux) Add(pattern string, handler http.Handler) {
	this[pattern] = handler
}

//实现RouterMux接口
func (this Mux) Routers() map[string]http.Handler {
	return this
}
