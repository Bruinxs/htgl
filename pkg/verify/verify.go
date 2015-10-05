package verify

import (
	"htgl/pkg/log"
	"net/http"
)

//用户验证
//返回 0 验证成功
//返回 1 用户不存在
//返回 2 密码错误
func VerifyIndentity(name, password string) int {
	return 0
}

func VerifyIndentityAndHandle(w http.ResponseWriter, action, username, password string) bool {
	if k := VerifyIndentity(username, password); k != 0 {
		err := ""
		if k == 1 {
			err = "用户不存在"
		} else {
			err = "密码错误"
		}
		log.LogWarn(action, "用户验证失败", "用户：", username, "错误信息：", err)
		w.Write([]byte("请求失败"))
		return false
	}
	return true
}

type PermitType uint32

//权限类型
const (
	FILE_PAGE PermitType = 1 << iota //文件管理页面
)

//权限验证
func VerifyPermission(name string, permission PermitType) bool {
	return true
}

//附带信息的权限验证
func VerifyPermissionWithInfo(name string, permission PermitType, info interface{}) bool {
	return VerifyPermission(name, permission)
}
