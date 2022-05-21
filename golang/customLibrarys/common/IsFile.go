package common

import (
	"fmt"
	"log"
	"os"
)

/*
	패키지 로드시 호출되는 init 함수
*/
func init() {

}

/*
	파일 또는 폴더의 전체 경로를 받아 그것이 파일인지 체크하는 함수
*/
func IsFile(fullPath string) bool {
	log.Println("IsFile 함수 호출됨.. fullPath=", fullPath)

	fdir, err := os.Open(fullPath)
	if err != nil {
		return false
	}
	defer fdir.Close()

	finfo, err := fdir.Stat()

	if err != nil {
		fmt.Println(err)
		return false
	}

	mode := finfo.Mode()
	return !mode.IsDir()
}
