package angular

const projectRootPath string = "/home/sample-project"
const clientPath string = projectRootPath + "/client"
const clientNewPath string = projectRootPath + "/client-new"
const clientOldPath string = projectRootPath + "/client-old"

func Apply() {
	DeleteClientOldFolder()   // client-old 폴더 삭제
	ChangeClientToClientOld() // client 폴더명을 client-old 으로 변경
	ChangeClientNewToClient() // client-new 폴더명을 client 으로 변경
}
