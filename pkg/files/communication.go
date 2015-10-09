package files

import (
	"encoding/json"
	"htgl/pkg/log"
	"os"
	"strconv"
)

//请求数据包字段
var (
	currentFilePath = "currentFilePath"
	fileName        = "fileName"
	fileNameList    = "fileNameList"
)

//发送给客户端的数据包字段
var (
	status  = "status"  //整数，表示返回状态，其中 0 表示请求失败
	content = "content" //附带信息
)

//文件信息字段
var (
	filename = "filename"
	filesize = "filesize"
	filedate = "filedate"
	filemd5  = "filemd5"
)

//创建发送包
func newPackWithInfo(sta int, con interface{}) []byte {
	m := make(map[string]interface{})
	m[status] = sta

	conjs, err := json.Marshal(con)
	if err != nil {
		log.LogWarn(logprefix, "警告，编码发送数据包的附带信息时发生小错误", err)
	}
	m[content] = string(conjs)

	pake, err := json.Marshal(m)
	if err != nil {
		log.LogWarn(logprefix, "警告，编码发送数据包时发生小错误", err)
	}
	return pake
}

func newPackWithString(sta int, con string) []byte {
	m := make(map[string]interface{})
	m[status] = sta
	m[content] = con

	pake, err := json.Marshal(m)
	if err != nil {
		log.LogWarn(logprefix, "警告，编码发送数据包时发生小错误", err)
	}
	return pake
}

//生成文件列表
func newFileList(infos []os.FileInfo) []map[string]string {
	list := []map[string]string{}
	l := len(infos)
	for i := 0; i < l; i++ {
		m := make(map[string]string)
		f := infos[i]

		size := "--"
		if !f.IsDir() {
			size = strconv.FormatInt(f.Size(), 10)
		}
		m[filename] = f.Name()
		m[filesize] = size
		m[filedate] = f.ModTime().String()
		m[filemd5] = "--"

		list = append(list, m)
	}
	return list
}
