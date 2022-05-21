package main

import (
	"go-useful-project/bySituation/database"
	"go-useful-project/customLibrarys/common"
	"log"
)

func main() {
	// angular.Apply()
	// angular.ChangeClientToClientOld()

	// testLogFatal()
	// testUuid()
	database.MariadbStartAndAfter()
	// testCommand()
	// testSumString()
}

func testLogFatal() {
	// log.Fatal 호출되면 멈춤! (그 이후 코드 실행 안됨)
	log.Fatal("Fatal Error!")
	log.Println("This is log?")
}

func testUuid() {
	log.Println("testUuid() 함수 호출됨!")
	var result = common.GetUuid()
	log.Println("result", result)
}

func testCommand() {
	var result = common.Command("netstat", "-nap", "|", "grep", "LISTEN")
	log.Println("result", result)
}

func testSumString() {
	var stringValues = []string{"1", "2"}
	// stringValues = []string{"1", "2"}

	var result = common.SumString(stringValues, ",")
	log.Println(result)
}
