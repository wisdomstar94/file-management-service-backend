package common

import "github.com/google/uuid"

/*
	패키지 로드시 호출되는 init 함수
*/
func init() {

}

/*
	uuid 반환하는 함수
*/
func GetUuid() string {
	uuidWithHyphen := uuid.New()
	return string(uuidWithHyphen.String())
	// uuid := strings.Replace(uuidWithHyphen.String(), "-", "", -1)
}
