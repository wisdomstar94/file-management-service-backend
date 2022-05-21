package common

import (
	"strings"
)

/*
	패키지 로드시 호출되는 init 함수
*/
func init() {

}

/*
	문자열 합치는 함수
*/
func SumString(v []string, seperator string) string {
	return strings.Join(v, seperator)
}
