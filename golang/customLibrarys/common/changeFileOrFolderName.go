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
	파일명 또는 폴더명 변경하는 함수
*/
func ChangeFileOrFolderName(oldPath string, newPath string) bool {
	log.Println("ChangeFileOrFolderName 함수 호출됨.. oldPath=", oldPath)

	// 먼저 해당 경로의 파일 또는 폴더가 존재하는지를 체크
	if !IsFileOrFolderExist(oldPath) {
		// 존재하는 파일 또는 폴더가 아니면 false 를 반환하고 종료
		return false
	}

	log.Println("Rename 함수 호출됨..")
	err := os.Rename(oldPath, newPath)
	if err != nil {
		// log.Fatal(err)
		return false
	}

	return true
}
