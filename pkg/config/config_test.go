package config

import (
	"fmt"
	"testing"
)

func Test_read(t *testing.T) {
	err := ParseConfig("F:\\test.config")
	if err != nil {
		fmt.Println("err", err)
	}
	fmt.Println(defaultConf.data)
}
