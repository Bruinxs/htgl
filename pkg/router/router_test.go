package router

import (
	"net/http"
	"testing"
)

func Test_router(t *testing.T) {
	m := NewMux()
	m.Add("/test", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("test router"))
	}))
	AddHandlers(m)
	Listen()
}
