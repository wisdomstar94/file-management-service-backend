-- --------------------------------------------------------
-- 호스트:                          127.0.0.1
-- 서버 버전:                        10.5.11-MariaDB-1:10.5.11+maria~focal - mariadb.org binary distribution
-- 서버 OS:                        debian-linux-gnu
-- HeidiSQL 버전:                  11.2.0.6213
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- 테이블 file_management_service.FmsPermissionGroupInfos 구조 내보내기
CREATE TABLE IF NOT EXISTS `FmsPermissionGroupInfos` (
  `seq` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '대체키 숫자값',
  `permissionGroupInfoKey` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '권한 그룹 정보 식별키',
  `permissionGroupKey` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '권한 그룹 고유 식별키',
  `createrUserKey` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '회원 고유 식별키',
  `createdAt` datetime NOT NULL DEFAULT current_timestamp() COMMENT '생성일',
  `updatedAt` datetime DEFAULT NULL COMMENT '수정일',
  PRIMARY KEY (`permissionGroupInfoKey`),
  UNIQUE KEY `seq` (`seq`),
  UNIQUE KEY `permissionGroupKey` (`permissionGroupKey`),
  KEY `fpgis_createrUserKey_fk` (`createrUserKey`),
  CONSTRAINT `fpgis_createrUserKey_fk` FOREIGN KEY (`createrUserKey`) REFERENCES `FmsUsers` (`userKey`),
  CONSTRAINT `fpgis_permissionGroupKey_fk` FOREIGN KEY (`permissionGroupKey`) REFERENCES `FmsPermissionGroups` (`permissionGroupKey`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='권한 그룹 부가 정보 테이블';

-- 테이블 데이터 file_management_service.FmsPermissionGroupInfos:~0 rows (대략적) 내보내기
/*!40000 ALTER TABLE `FmsPermissionGroupInfos` DISABLE KEYS */;
INSERT INTO `FmsPermissionGroupInfos` (`seq`, `permissionGroupInfoKey`, `permissionGroupKey`, `createrUserKey`, `createdAt`, `updatedAt`) VALUES
	(1, 'Nuv1624752918473GPPU', 'T1617773784543MKLRZn', 'C1618033738099vtEiUg', '2021-06-27 13:26:56', NULL);
/*!40000 ALTER TABLE `FmsPermissionGroupInfos` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
