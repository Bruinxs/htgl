package fpath

import (
	"os"
)

//判断路径是否存在
func IsExist(dir string) bool {
	info, err := os.Stat(dir)
	return info != nil || os.IsExist(err)
}

//是否目录
func IsDir(path string) (b bool, err error) {
	info, err := os.Stat(path)
	if info != nil {
		b = info.IsDir()
	}
	return
}

//创建文件夹
func MakeDir(dir string) error {
	return os.MkdirAll(dir, os.ModeDir)
}
