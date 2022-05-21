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
func DeleteFile(filePath string) bool {
	log.Println("DeleteFile 함수 호출됨.. filePath=", filePath)

	// 먼저 해당 경로의 파일 또는 폴더가 존재하는지를 체크
	if !IsFileOrFolderExist(filePath) {
		// 존재하는 파일 또는 폴더가 아니면 false 를 반환하고 종료
		return false
	}

	// 존재하는 파일 또는 폴더이면, 파일이냐 폴더에 따라 맞는 delete 관련 함수 호출
	if IsFile(filePath) {
		err3 := os.Remove(filePath)
		if err3 != nil {
			return false
		}
	} else {
		os.RemoveAll(filePath)
	}

	return true
}
