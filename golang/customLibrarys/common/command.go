package common

import (
	"log"
	"os/exec"
)

/*
	패키지 로드시 호출되는 init 함수
*/
func init() {

}

/*
	커맨드 날리고 결과 받는 함수
*/
func Command(command string, arg ...string) string {
	cmd := exec.Command(command, arg...)
	output, err := cmd.CombinedOutput()
	if err != nil {
		log.Println("Command Error :", err)
		log.Println("Error when running command.  Output:")
		log.Println(string(output))
		log.Printf("Got command status: %s\n", err.Error())
		return "COMMAND_ERROR"
	} else {
		log.Println("Command Result", string(output))
		return string(output)
	}
}
