package common

import (
	"log"
	"os"
)

/*
	패키지 로드시 호출되는 init 함수
*/
func init() {

}

/*
	파일 또는 폴더의 전체 경로를 받아 해당 파일이 존재하는지 체크하는 함수
*/
func IsFileOrFolderExist(fullPath string) bool {
	log.Println("IsFileOrFolderExist 함수 호출됨.. fullPath=", fullPath)
	if _, err := os.Stat(fullPath); os.IsNotExist(err) {
		log.Println("err", err)
		return false
	}
	return true
}
