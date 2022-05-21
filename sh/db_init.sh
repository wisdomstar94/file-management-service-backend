#!/bin/bash

(echo "set password = password('$1');"; echo "CREATE USER 'root'@'172.17.0.1' IDENTIFIED BY '$1';"; echo "GRANT ALL PRIVILEGES ON *.* TO 'root'@'172.17.0.1' IDENTIFIED BY '$1' WITH GRANT OPTION;"; echo "CREATE DATABASE file_management_service default CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;"; echo "FLUSH PRIVILEGES;") | mysql;