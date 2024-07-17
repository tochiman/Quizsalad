package service

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"

	"github.com/google/uuid"
)

func Generate_uuid() string {
	u, err := uuid.NewUUID()
	if err != nil {
		fmt.Println(err)
		return ""
	}
	uu := u.String()

	return uu
}

// Token生成用の関数。ランダムな文字列を返却
func Generate_token(length int) string {
	bytes := make([]byte, length)
	rand.Read(bytes)
	return base64.URLEncoding.EncodeToString(bytes)
}
