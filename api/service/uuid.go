package service

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"math/big"

	"github.com/google/uuid"
)

const (
	letterBytes = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
)

func GenerateRandomString(n int) (string, error) {
	b := make([]byte, n)
	max := big.NewInt(int64(len(letterBytes)))

	for i := 0; i < n; i++ {
		num, err := rand.Int(rand.Reader, max)
		if err != nil {
			return "", err
		}
		b[i] = letterBytes[num.Int64()]
	}

	return string(b), nil
}

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
