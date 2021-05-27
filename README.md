# 파일 관리 서비스, File Management Service
개인 프로젝트이며, 파일을 등록하고 관리 및 배포할 수 있는 서비스에 대한 백엔드 프로젝트 입니다.
<br>
<br>
# 이 프로젝트에 사용한 모든 것
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