package angular

import "go-useful-project/customLibrarys/common"

func ChangeClientToClientOld() {
	// client 폴더가 존재하는지 체크
	if common.IsFileOrFolderExist(clientPath) {
		// client 폴더가 존재하면 client-old 로 폴더명 변경하기
		common.ChangeFileOrFolderName(clientPath, clientOldPath)
	}
}
