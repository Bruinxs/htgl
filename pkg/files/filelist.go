package files

import (
	"htgl/pkg/common"
	"htgl/pkg/fpath"
	"htgl/pkg/log"
	"htgl/pkg/verify"
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

//请求文件列表
func filelist(w http.ResponseWriter, r *http.Request) {
	username, password := common.ParseIdentityInRequest(r)

	if ok := verify.VerifyIndentityAndHandle(w, "请求文件列表", username, password); !ok {
		return
	}

	r.ParseForm()
	path := r.Form[currentFilePath][0]
	log.LogTrace(logprefix, "filelist request", "user:", username, "path:", path)

	path = transformPath(path)

	if path != "/" {
		b, err := fpath.IsDir(path)
		if !b || err != nil {
			w.Write(newPackWithString(0, "目录不存在或不是文件夹"))
			return
		}
	}

	infos := getFileInfos(path)
	con := newFileList(infos)
	w.Write(newPackWithInfo(1, con))
}

//将请求路径转换成主机路径，"/"表示管理的目录
func transformPath(p string) (path string) {
	path = "/"
	if p != "/" && len(p) > 1 && p[0] == '/' {
		slice := strings.SplitN(p, "/", 3)
		p = slice[1]
		path = ""
		if len(slice) >= 3 {
			path = slice[2]
		}
		l := len(dirname)
		for i := 0; i < l; i++ {
			if p == dirname[i] {
				path = filepath.Join(directorys[i], path)
				return
			}
		}
	}
	return
}

//获得目录下所有文件信息
func getFileInfos(path string) []os.FileInfo {
	if path == "/" {
		infos := []os.FileInfo{}
		l := len(directorys)
		for i := 0; i < l; i++ {
			f, err := os.Stat(directorys[i])
			if err != nil {
				log.LogError(logprefix, "获取文件信息时发生错误", "路径:", directorys[i], "错误:", err)
			}
			if f != nil {
				infos = append(infos, f)
			}
		}
		return infos
	}

	infos, err := ioutil.ReadDir(path)
	if err != nil {
		log.LogError(logprefix, "获取目录下文件信息是发生错误", "路径:", path, "错误:", err)
	}
	return infos
}
