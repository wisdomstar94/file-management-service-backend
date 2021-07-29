package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"os/exec"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	// db 접속
	fmt.Println("db 접속 시작")
	db, err := sql.Open("mysql", "root:112233!@#@tcp(host.docker.internal:47221)/mysql")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("db 접속 성공")

	// db test
	// var result string
	// rows, err := db.Query("SELECT NOW();")
	// if err != nil {
	// 	fmt.Println("SELECT NOW(); 에러...")
	// 	log.Fatal(err)
	// }
	// fmt.Println("여기 까진 정상 작동 1")
	// fmt.Println(rows)
	// fmt.Println("여기 까진 정상 작동 2")

	// // file_management_service 데이터베이스 생성하기
	// rows5, err := db.Query("CREATE DATABASE file_management_service default CHARACTER SET UTF8;")
	// if err != nil {
	// 	log.Fatal(err)
	// }
	// fmt.Println(rows5)

	// // file_management_service 데이터베이스 선택하기
	// rows3, err := db.Query("USE file_management_service;")
	// if err != nil {
	// 	log.Fatal(err)
	// }
	// fmt.Println(rows3)

	// /home2/file-management-service/file-management-service-backend/init_sql/20210717_201700/file_management_service 폴더에 있는 파일명 목록 가져오기
	targetDir := "/home2/file-management-service/file-management-service-backend/init_sql/20210717_201700/file_management_service"
	// files, err := ioutil.ReadDir(targetDir)
	// if err != nil {
	// 	log.Fatal(err)
	// }

	targetSql := []string{"FmsCodeGroups.sql", "FmsCodes.sql", "FmsPermissionGroups.sql", "FmsMenuCategorys.sql", "FmsMenus.sql", "FmsCompanys.sql", "FmsPermissions.sql", "FmsUsers.sql", "FmsPermissionGroupUploads.sql", "FmsCompanyInfos.sql", "FmsPermissionGroupInfos.sql"}

	for _, fileName := range targetSql {
		cmd := exec.Command("sh", "-c", "mysql -h localhost -u root file_management_service < "+targetDir+"/"+fileName)
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr
		cmd.Run()
		cmd.Wait()
		fmt.Println(cmd.Output())
	}

	// for _, file := range files {
	// 	// 파일명
	// 	fmt.Println(file.Name())
	// 	cmd := exec.Command("sh", "-c", "mysql -h localhost -u root file_management_service < "+targetDir+"/"+file.Name())
	// 	cmd.Stdout = os.Stdout
	// 	cmd.Stderr = os.Stderr
	// 	cmd.Run()
	// 	cmd.Wait()
	// 	fmt.Println(cmd.Output())
	// 	// rows2, err := db.Exec("source " + targetDir + "/" + file.Name())
	// 	// if err != nil {
	// 	// 	log.Fatal(err)
	// 	// }
	// 	// fmt.Println(rows2)

	// 	// 파일의 절대경로
	// 	// fmt.Println(fmt.Sprintf("%v/%v", targetDir, file.Name()))
	// }

	db.Close()
}
