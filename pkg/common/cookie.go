package common

import (
	"net/http"
)

//cookie 字段
const (
	id = "_id" //身份标识
)

//从请求中解析出用户名和密码
func ParseIdentityInRequest(r *http.Request) (username, password string) {
	return "", ""
}

//将用户标识添加到cookie中
func AppendIdentityToRequest(r *http.Request, username, password string) {
	c := &http.Cookie{Name: id, Value: ""}
	r.AddCookie(c)
}
