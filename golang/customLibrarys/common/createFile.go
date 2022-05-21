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
	파일 생성하는 함수 (이미 존재하는 파일이면 생성하지 않음)
*/
func CreateFile(filePath string) bool {
	log.Println("CreateFile 함수 호출됨.. filePath=", filePath)

	if IsFileOrFolderExist(filePath) {
		return false
	}

	_, err := os.Create(filePath)
	if err != nil {
		log.Println(err)
	}
	return true
}
