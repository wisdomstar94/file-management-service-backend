package database

import (
	"go-useful-project/customLibrarys/common"
	"log"
)

const initCheckFile string = "/golang/init_success.txt"
const initRootPassword string = "112233abc"

/*
	커맨드로 mariadb 를 실행시키고 이후 설정해야 할 커맨드 추가 입력
*/
func MariadbStartAndAfter() {
	log.Println("MariadbStartAndAfter 함수 시작")

	// mariadb 실행
	var _ = common.Command("service", "mariadb", "start")

	// 최초 초기화 작업이 이루어졌는지 아닌지 체크
	if !isInit() {
		log.Println("init 되지 않음.. init 시작!")
		startInit()
	} else {
		log.Println("init 된 상태!")
	}
}

func startInit() {
	log.Println("startInit() 함수 호출됨!")

	// mariadb 의 root 계정 비밀번호를 112233abc 으로 변경
	var result2 = common.Command("mysql", "-e", common.SumString([]string{
		common.SumString([]string{"set password=password('", initRootPassword, "');"}, ""),
		"FLUSH PRIVILEGES;",
	}, ""))
	log.Println("result2", result2)

	// mariadb 의 계정 추가
	var result3 = common.Command("mysql", "-e", common.SumString([]string{
		common.SumString([]string{"CREATE USER 'root'@'172.17.0.1' IDENTIFIED BY '", initRootPassword, "';"}, ""),
		common.SumString([]string{"ALTER USER 'root'@'localhost' IDENTIFIED BY '", initRootPassword, "';"}, ""),
		common.SumString([]string{"GRANT ALL PRIVILEGES ON *.* TO 'root'@'172.17.0.1' IDENTIFIED BY '", initRootPassword, "' WITH GRANT OPTION;"}, ""),
		"FLUSH PRIVILEGES;",
	}, ""))
	log.Println("result3", result3)

	// default db 생성
	var result4 = common.Command("mysql", "-e", common.SumString([]string{
		"CREATE DATABASE file_management_service default CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",
	}, ""))
	log.Println("result4", result4)

	// 폴더 생성 (이미 존재하는 폴더면 생성하지 않음)
	common.CreateFolder("/golang")

	// 파일 생성 (이미 존재하는 파일이면 생성하지 않음)
	common.CreateFile(initCheckFile)
}

func isInit() bool {
	var isInit = common.IsFileOrFolderExist(initCheckFile)
	return isInit
}
