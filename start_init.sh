#!/bin/bash

export LANG=ko_KR.UTF-8
export PATH=$PATH:/usr/local/git/bin
export PATH=$PATH:/usr/local/go/bin
service mariadb start
service redis-server start

pushd /golang-project/golang
go run main.go
popd

pushd /home2/file-management-service/file-management-service-backend
npx sequelize db:migrate
popd

pushd /home2/file-management-service/file-management-service-backend
pm2 start pm2.config.js
popd
