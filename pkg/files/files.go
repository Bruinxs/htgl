package files

import (
	"htgl/pkg/fpath"
	"htgl/pkg/log"
	"htgl/pkg/router"
	"net/http"
	"path/filepath"
)

var (
	//该模块的路由集合
	Rmux = router.NewMux()
)

var (
	//管理的目录
	directorys = []string{}

	//所管理的文件夹名
	dirname = []string{}

	//日志前缀
	logprefix = "filemanager:"
)

//添加所需的路由
func init() {
	//文件列表
	Rmux.Add("/filelist", http.HandlerFunc(filelist))

	//检查要上传的文件
	Rmux.Add("/checkfile", http.HandlerFunc(checkfile))
}

//添加目录给该模块管理
func AddDirectory(dir ...string) {
	l := len(dir)
	for i := 0; i < l; i++ {
		if !fpath.IsExist(dir[i]) {
			fpath.MakeDir(dir[i])
		}
		p := filepath.Clean(dir[i])
		dirname = append(dirname, filepath.Base(p))
		directorys = append(directorys, p)
	}

	if len(dirname) != len(directorys) {
		log.LogError(logprefix, "添加文件管理目录时错误", "文件夹名长度:", len(dirname), "目录长度:", len(directorys), "不相等")
	}
}

//从管理的目录中删除特定目录
func RemoveDirectory(dir ...string) {
	l := len(dir)
	if l > 1 {
		for i := 0; i < l; i++ {
			RemoveDirectory(dir[i])
		}
		return
	}

	s := dir[0]
	l = len(directorys)
	for i := 0; i < l; i++ {
		if s == directorys[i] {
			directorys = append(directorys[:i], directorys[i+1:]...)
			dirname = append(dirname[:i], dirname[i+1:]...)
			return
		}
	}

	if len(dirname) != len(directorys) {
		log.LogError(logprefix, "删除文件管理目录时错误", "文件夹名长度:", len(dirname), "目录长度:", len(directorys), "不相等")
	}
}
