# 우분투 OS로 지정
FROM ubuntu:20.04

# 라벨 지정
LABEL "MAINTAINER"="Shin Jae Hyeon"
LABEL "DESCRIPTION"="This docker is for file management services."

# apt-get update 진행
RUN apt-get update -y

# apt-get upgrade 진행
RUN apt-get upgrade -y

# 기본적인 패키지 설치 및 환경설정 진행
# echo 6 => ASIA 선택한다는 뜻
# ECHO 69 => Seoul 선택한다는 뜻
# 시간대가 Asia/Seoul 로 설정됨
RUN (echo 6 ; echo 69) | apt-get install net-tools cron systemd curl wget vim cmake gcc g++ -y

# 한글 UTF-8 언어팩 설치 및 적용
# 언어셋이 ko_KR.UTF-8 로 설정됨
RUN apt-get install language-pack-ko -y
RUN locale-gen ko_KR.UTF-8
RUN update-locale LANG=ko_KR.UTF-8 LC_MESSAGES=POSIX
RUN export LANG=ko_KR.UTF-8
RUN sed -i'' -r -e "/this file has to be sourced in/a\export LANG=ko_KR.UTF-8" /etc/bash.bashrc

# Node.js 14.x 설치
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs

# git 2.30.x 설치
RUN apt-get install libssl-dev libcurl4-gnutls-dev zlib1g-dev gettext -y
WORKDIR /usr/src
RUN wget https://www.kernel.org/pub/software/scm/git/git-2.30.0.tar.gz
RUN tar -xvzf git-2.30.0.tar.gz
WORKDIR /usr/src/git-2.30.0
RUN ./configure --prefix=/usr/local/git
RUN make && make install
RUN export PATH=\$PATH:/usr/local/git/bin
RUN sed -i'' -r -e "/export LANG=ko_KR.UTF-8/a\export PATH=\$PATH:/usr/local/git/bin" /etc/bash.bashrc

# 필요한 npm 패키지 전역 설치
RUN npm i -g pm2 @angular/core @angular/cli

# MariadbDB 10.5 설치 (mysql_secure_installation 으로 초기 셋팅 필요)
RUN apt-get install software-properties-common -y
RUN apt-key adv --recv-keys --keyserver hkp://keyserver.ubuntu.com:80 0xF1656F24C74CD1D8
RUN add-apt-repository 'deb [arch=amd64,arm64,ppc64el] http://mirror.lstn.net/mariadb/repo/10.5/ubuntu focal main'
RUN apt update -y
RUN apt install mariadb-server -y

# RUN systemctl enable mariadb
RUN sed -i'' -r -e "/\/usr\/local\/git\/bin/a\service mariadb start" /etc/bash.bashrc

# MariaDB 기본 언어셋 UTF-8로 설정
RUN sed -i'' -r -e "/\[mysql\]/a\default-character-set = utf8mb4" /etc/mysql/mariadb.conf.d/50-mysql-clients.cnf \
&& sed -i'' -r -e "/\[mysql_upgrade\]/a\default-character-set = utf8mb4" /etc/mysql/mariadb.conf.d/50-mysql-clients.cnf \
&& sed -i'' -r -e "/\[mysqladmin\]/a\default-character-set = utf8mb4" /etc/mysql/mariadb.conf.d/50-mysql-clients.cnf \
&& sed -i'' -r -e "/\[mysqlbinlog\]/a\default-character-set = utf8mb4" /etc/mysql/mariadb.conf.d/50-mysql-clients.cnf \
&& sed -i'' -r -e "/\[mysqlcheck\]/a\default-character-set = utf8mb4" /etc/mysql/mariadb.conf.d/50-mysql-clients.cnf \
&& sed -i'' -r -e "/\[mysqldump\]/a\default-character-set = utf8mb4" /etc/mysql/mariadb.conf.d/50-mysql-clients.cnf \
&& sed -i'' -r -e "/\[mysqlimport\]/a\default-character-set = utf8mb4" /etc/mysql/mariadb.conf.d/50-mysql-clients.cnf \
&& sed -i'' -r -e "/\[mysqlshow\]/a\default-character-set = utf8mb4" /etc/mysql/mariadb.conf.d/50-mysql-clients.cnf \
&& sed -i'' -r -e "/\[mysqlslap\]/a\default-character-set = utf8mb4" /etc/mysql/mariadb.conf.d/50-mysql-clients.cnf

# MariaDB port 변경
RUN sed -i'' -r -e "/user                    = mysql/a\port            = 47221" /etc/mysql/mariadb.conf.d/50-server.cnf

# MariaDB bind-address 를 0.0.0.0 으로 변경 (호스트OS에서 컨테이너의 MariaDB에 HeidiSQL 같은 툴로 접근하기 위함)
RUN sed -i'' -r -e "s/bind-address/\# bind-address/" /etc/mysql/mariadb.conf.d/50-server.cnf
RUN sed -i'' -r -e "/bind-address            = 127.0.0.1/a\bind-address            = 0.0.0.0" /etc/mysql/mariadb.conf.d/50-server.cnf

# Redis 설치
RUN apt install redis-server -y

# Redis 비밀번호 설정
RUN sed -i'' -r -e "/requirepass foobared/a\requirepass 112233\!\@\#" /etc/redis/redis.conf

# Redis 실행
RUN service redis-server stop && service redis-server start

# Redis 자동 실행 등록
RUN sed -i'' -r -e "/export LANG=ko_KR.UTF-8/a\service redis-server start" /etc/bash.bashrc

# 파일 관리 서비스가 위치할 폴더 생성하기
RUN mkdir /home2 && mkdir /home2/file-management-service

# 파일 관리 서비스 git 내려받기
WORKDIR /home2/file-management-service
RUN /usr/local/git/bin/git clone https://github.com/wisdomstar94/file-management-service-backend.git
RUN /usr/local/git/bin/git clone https://github.com/wisdomstar94/file-management-service-frontend.git

# .env.sample 파일을 /home2/file-management-service/file-management-service-backend/.env 파일로 복사
COPY .env.sample /home2/file-management-service/file-management-service-backend/.env

# allow_ip.js.sample 파일을 /home2/file-management-service/file-management-service-backend/allow_ip.js 파일로 복사
COPY allow_ip.js.sample /home2/file-management-service/file-management-service-backend/allow_ip.js

# npm 패키지 모듈 설치하기
WORKDIR /home2/file-management-service/file-management-service-backend
RUN npm i
WORKDIR /home2/file-management-service/file-management-service-frontend
RUN npm i
RUN ng build --configuration production --deploy-url=sync/port/

# MariaDB 초기설정
# RUN service mariadb start
# COPY mariadb.sh /home2/file-management-service/file-management-service-backend/mariadb.sh
# WORKDIR /home2/file-management-service/file-management-service-backend
# RUN sed -i 's/\r$//' mariadb.sh
# RUN sh mariadb.sh 
RUN mkdir /golang-project
COPY golang /golang-project/golang


# 컨테이너가 LISTEN 할 포트 지정
EXPOSE 6379
EXPOSE 47220
EXPOSE 47221

# golang 설치하기
WORKDIR /usr/src
RUN wget https://golang.org/dl/go1.16.6.linux-amd64.tar.gz
RUN tar -C /usr/local -xzf go1.16.6.linux-amd64.tar.gz
RUN export PATH=$PATH:/usr/local/go/bin
RUN sed -i'' -r -e "/export LANG=ko_KR.UTF-8/a\export PATH=\$PATH:/usr/local/go/bin" /etc/bash.bashrc

# 필요한 golang package 설치
WORKDIR /home2/file-management-service/file-management-service-backend
RUN /usr/local/go/bin/go get -u github.com/go-sql-driver/mysql

# db init
# COPY db_init.go /home2/file-management-service/file-management-service-backend/db_init.go
# COPY go.mod /home2/file-management-service/file-management-service-backend/go.mod
# COPY go.sum /home2/file-management-service/file-management-service-backend/go.sum
# WORKDIR /home2/file-management-service/file-management-service-backend

# 컨테이너 실행시 npx sequelize db:migrate 실행되도록 설정
RUN sed -i'' -r -e "/service mariadb start/a\pushd /home2/file-management-service/file-management-service-backend\nnpx sequelize db:migrate\npopd\n\# t20210812213400" /etc/bash.bashrc

# 컨테이너 실행시 file-management-service 가 자동 실행되도록 설정
RUN sed -i'' -r -e "/t20210812213400/a\pushd /home2/file-management-service/file-management-service-backend\npm2 start pm2.config.js\npopd\n\# t20220521145100" /etc/bash.bashrc

# 컨테이너 실행시 /golang-project/golang/main.go 가 실행되도록 설정
RUN sed -i'' -r -e "/t20220521145100/a\pushd /golang-project/golang\ngo run main.go\npopd" /etc/bash.bashrc

# 루트 경로로 이동
WORKDIR /

# 컨테이너가 시작될 때마다 실행할 명령어(커맨드) 설정
CMD ["/bin/bash"]