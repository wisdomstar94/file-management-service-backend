package database

import (
	"log"
)

/*
	로그 내용을 파일에 기록해야 할 때
*/
func LoggingInFile() {
	log.Println("LoggingInFile 함수 시작")
	/*
		다음과 같은 명령어처럼 실행 명령어 옆에 2>> 로그파일경로
		를 명시해주면 해당 로그파일경로에 로그가 기록됨

		go run ./main.go 2>> /golang/log.txt
	*/
}
