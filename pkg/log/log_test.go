package log

import (
	"testing"
)

func Test_LogInfo(t *testing.T) {
	LogInfo("test info")
}

func Test_LogFatal(t *testing.T) {
	LogFatal("test fatal")
}
