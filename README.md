# 파일 관리 서비스, File Management Service
개인 프로젝트이며, 파일을 등록하고 버전 별로 관리 및 배포할 수 있는 서비스에 대한 백엔드 프로젝트 입니다. (프론트엔드 프로젝트는 별도 존재) <br>
블로그 : https://funveloper.tistory.com/15
<br>
<br>
# 백엔드 기술 스택
* Node.js (https://nodejs.org/ko/)
  - 개발 언어는 Node.js를 사용하였습니다. 실무에서도 Node.js 를 사용하였고 그만큼 익숙한 언어입니다.
  <br>
* Express (https://www.npmjs.com/package/express)
  - Node.js 웹프레임워크인 Express 를 사용하였습니다. 
  <br>
* Sequelize (https://www.npmjs.com/package/sequelize)
  - 실무에서는 raw 쿼리를 사용하였지만 이번 프로젝트에서는 ORM 을 사용해보고자 Sequelize 를 적용해보았습니다.
  <br>
* MariaDB (https://go.mariadb.com/)
  - 무료 DB 중에서 가장 범용적으로 많이 사용되는 MariaDB 를 사용하였습니다.
  <br>
* Docker (https://www.docker.com/)
  - 이 백엔드 프로젝트를 개발할 때, 테스트용 DB를 Docker 컨테이너로 구동하여 로컬에서 작업을 진행하였습니다.
  <br>
* Vscode (https://code.visualstudio.com/)
  - 개발할 때 사용한 에디터 툴입니다.
  <br>
* Heidisql (https://www.heidisql.com/)
  - 로컬에서 Docker로 구동한 DB에 접속할 때 사용한 툴입니다.
  <br>
* Git (https://git-scm.com/)
  - 작업 이력 관리를 위해 사용한 Git 입니다. 저 혼자 작업을 한 것이기 때문에 브랜치는 별도로 생성하지 않고 master 브랜치에서만 작업을 하고 커밋 및 푸쉬를 하였습니다.
  <br>
* Sourcetree (https://www.sourcetreeapp.com/)
  - Git 을 통해 형상관리를 할 때 사용한 툴입니다.
  <br>
* Staruml (https://staruml.io/)
  - 초창기 파일 관리 서비스를 생각하고 DB 설계를 해야할 때 ERD를 그리기 위해 사용한 툴입니다.
  <br>
* 설치형 Gitlab (https://about.gitlab.com/)
  - Git을 사용할 때 원격저장소로 사용한 Gitlab 입니다. AWS Ec2에 설치하여 사용을 하였습니다.
  <br>
* Github (https://github.com/)
  - 본 프로젝트를 공유할 목적으로 사용하였습니다.
  <br>
* AWS (https://aws.amazon.com/)
  - EC2 서비스를 통해 인스턴스를 생성 후, Gitlab을 설치하여 필요할 때마다 인스턴스를 실행하여 로컬 PC에서 커밋 및 푸쉬를 진행하였습니다.
  <br>
* JWT (https://jwt.io/)
  - 파일 관리 서비스의 로그인은 JWT (Json Web Token) 으로 구현하였습니다. 
  <br>
* multer (https://www.npmjs.com/package/multer)
  - 파일 업로드 기능을 위해 multer 패키지를 사용하였습니다.
  <br>
* winston (https://www.npmjs.com/package/winston)
  - 로그를 효율적으로 남기기 위해 winston 패키지를 사용하였습니다. 모든 요청에 대해 요청 Method, 요청 IP, 요청 Header, 요청 Body 등이 로그에 쌓이도록 하였습니다.
<br>
<br>

<br>

# 프론트엔드 <br>
https://github.com/wisdomstar94/file-management-service-frontend

<br>
<br>

# 기본 사용방법
<br>
1) 도커 이미지를 pull 받는다.<br>
docker pull wisdomstar94/file-management-service-image:latest<br>
<br>
2) 컨테이너를 생성한다. (이미 이용중인 포트라면 호스트의 다른 가용 포트를 연결하시면 됩니다.)<br>
docker run -i -t -d --privileged -p 47220:47220 -p 47221:47221 --name 컨테이너명 wisdomstar94/file-management-service-image:latest<br>
<br>
3) 컨테이너를 실행한다.<br>
docker exec -it 컨테이너명 bash<br>
<br>
4) /home2/file-management-service/file-management-service-backend/.env 파일에서 아래에 명시된 key 값들을 변경한다. (원래 입력된 key의 자리수와 동일한 자리수로)<br>
(ENCRYPT_KEY, ONE_ROOT_ENCRYPT_SALT, COOKIE_SECRET_KEY, JWT_SECRET, JWT_FILE_DOWNLOAD_URL_SECRET)<br>
<br>
5) /home2/file-management-service/file-management-service-backend 경로로 가서<br>
node user_password_init.js 명령어를 실행한다.<br>
<br>
6) /home2/file-management-service/file-management-service-backend 경로에서<br>
pm2 delete FileManagementService && pm2 start pm2.config.js 명령어를 실행한다.<br>
<br>
7) 아래 주소로 접근한다. (로컬용)<br>
http://127.0.0.1:47220<br>
<br>
8) 아래 기본 계정으로 로그인 한 후, 회원 관리에서 비밀번호를 변경하여 이용한다.<br>
ID : test123<br>
PW : 123456<br>
(로그인은 30초에 최대 10번의 request 만 허용되므로, 만약 응답코드가 20067010 으로 표시된다면 30초 후에 다시 로그인을 시도해주세요.)

<br>
9) 외부에서 공인 IP 주소:PORT나 nginx의 프록시패스 등을 활용하여 도메인 등으로 접근되게 셋팅도 가능.
<br>
<br>

# 참고 및 주의 사항
<br>
1) 컨테이너 내부의 /home2/file-management-service 경로에 가면 프로젝트 파일이 존재합니다. 원하시는 대로 커스터마이징 가능합니다.<br>
<br>
2) 파일 관리 서비스의 버전 업된 이미지를 사용 하실 경우에 데이터 마이그레이션 작업은 직접 고려 및 작업하셔야 합니다.<br>
<br>
3) 실제로 다운로드 URL 링크를 외부에 공유하는 등 실무에서 사용하시려면 아래와 같은 작업을 반드시 진행해주세요.<br>
- mariadb 포트 및 redis 포트 변경 (47221 -> 다른 포트, 6379 -> 다른 포트)<br>
- 프로젝트 포트 변경 (47220 -> 다른 포트)<br>
- 기본 test123 계정의 비밀번호 변경 (되도록이면 ID도 DB에 직접 접근하여 변경)<br>
- .env 파일에 있는 secret key 값 및 포트 변경<br>
- 도메인을 연결하여 사용 및 https 적용 (프록시패스 이용 등)<br>
- 특정 파일 확장자만 업로드 되게 수정 (routes/api/fileVersion/index.js 파일을 수정하면 됨)
<br>
<br>
4) 파일 관리 서비스를 이용 중에 발생한 문제에 대해서는 책임지지 않습니다. <br>
<br>
5) 백엔드는 node (express), 프론트엔드는 angular 로 만들어져 있습니다.<br>
<br>
6) 버그나 기타 의견이 있으시면 wisdomstar94@gmail.com 으로 보내주시면 됩니다.<br>
<br>
<br>
감사합니다.
<br>
