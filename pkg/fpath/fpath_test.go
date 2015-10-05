package fpath

import (
	"fmt"
	"testing"
)

func Test_all(t *testing.T) {
	d := "F:\\a\\b\\c"
	fmt.Println("isexist", IsExist(d))
	err := MakeDir(d)
	if err != nil {
		fmt.Println("makedier err", err)
	}
	b, err := IsDir(d)
	fmt.Println("is dir", b)
	if err != nil {
		fmt.Println("is dir err", err)
	}
}
