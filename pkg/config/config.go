package config

import (
	"bufio"
	"encoding/json"
	"errors"
	"htgl/pkg/fpath"
	"os"
	"strings"
)

/**
配置模块，从配置文件中读取配置数据并解析
配置文件为json格式，其中只能有一个json对象。允许有注释，但必须独占一行或多行
*/

type conf struct {
	//配置文件
	file string

	//配置数据
	data map[string]interface{}
}

var (
	defaultConf = &conf{
		file: "default.config",
		data: make(map[string]interface{}),
	}
)

//读取配置信息
func (this *conf) read() (err error) {
	if !fpath.IsExist(this.file) {
		return errors.New("配置文件不存在")
	}

	f, err := os.Open(this.file)
	if err != nil {
		if f != nil {
			f.Close()
		}
		return errors.New("打开配置文件 " + this.file + " 时发生错误，" + err.Error())
	}

	scaner := bufio.NewScanner(f)
	js := ""
	line := ""
	annotation := false
	for scaner.Scan() {
		line = scaner.Text()

		if annotation {
			if strings.HasSuffix(line, "*/") {
				annotation = false
			}
			continue
		}

		line = strings.Trim(line, " ")
		line = strings.Trim(line, "\t")
		if strings.HasPrefix(line, "//") {
			continue
		}

		if strings.HasPrefix(line, "/*") {
			annotation = true
			continue
		}

		js += line
	}

	err = json.Unmarshal([]byte(js), &this.data)
	return
}

//解析默认的配置文件
func ParseDefault() error {
	if !fpath.IsExist(defaultConf.file) {
		os.Create(defaultConf.file)
	}
	return defaultConf.read()
}

//解析对应的配置文件
func ParseConfig(path string) error {
	if !fpath.IsExist(path) {
		return ParseDefault()
	}
	defaultConf.file = path
	return defaultConf.read()
}

//根据关键字返回配置值
func Value(key string) interface{} {
	return defaultConf.data[key]
}
