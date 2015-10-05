package files

import (
	"fmt"
	"testing"
)

func Test_Dir(t *testing.T) {
	fmt.Println("0", directorys)
	AddDirectory("dkfj", "jdif", "ccc", "ddd", "eee")
	fmt.Println(1, directorys)
	RemoveDirectory("ccc", "eee")
	fmt.Println(2, directorys)
}
