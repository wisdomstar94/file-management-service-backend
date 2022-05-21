package angular

import "go-useful-project/customLibrarys/common"

func DeleteClientOldFolder() {
	// client-old 폴더가 존재하는지 체크
	if common.IsFileOrFolderExist(clientOldPath) {
		// client-old 폴더가 존재하면 삭제하기
		common.DeleteFile(clientOldPath)
	}
}
