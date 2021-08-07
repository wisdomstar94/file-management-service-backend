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

-- 테이블 file_management_service.FmsUsers 구조 내보내기
CREATE TABLE IF NOT EXISTS `FmsUsers` (
  `seq` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '대체키 숫자값',
  `parentUserKey` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '부모 회원 고유 식별키',
  `userKey` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '회원 고유 식별키',
  `companyKey` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '회사 고유 식별키',
  `permissionGroupKey` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '권한 그룹 고유 식별키',
  `userLevel` varchar(13) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '회원 등급',
  `userId` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '회원 ID',
  `userPassword` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '회원 비밀번호',
  `userName` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '회원명',
  `userPhone` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '회원 휴대폰번호',
  `userMemo` text COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '회원 메모',
  `createdAt` datetime NOT NULL DEFAULT current_timestamp() COMMENT '생성일',
  `createdIp` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '생성시 요청 IP',
  `updatedAt` datetime DEFAULT NULL COMMENT '수정일',
  `updatedIp` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '수정시 요청 IP',
  `userStatus` varchar(13) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '회원 상태 코드',
  `isDeletedRow` enum('Y','N') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'N' COMMENT '행 삭제 여부',
  PRIMARY KEY (`userKey`),
  UNIQUE KEY `seq` (`seq`),
  UNIQUE KEY `userId` (`userId`)
  -- KEY `fms_users_is_deleted_row` (`isDeletedRow`),
  -- KEY `fu_parentUserKey_fk` (`parentUserKey`),
  -- KEY `fu_companyKey_fk` (`companyKey`),
  -- KEY `fu_permissionGroupKey_fk` (`permissionGroupKey`),
  -- KEY `fu_userLevel_fk` (`userLevel`),
  -- KEY `fu_userStatus_fk` (`userStatus`),
  -- CONSTRAINT `fu_companyKey_fk` FOREIGN KEY (`companyKey`) REFERENCES `FmsCompanys` (`companyKey`),
  -- CONSTRAINT `fu_parentUserKey_fk` FOREIGN KEY (`parentUserKey`) REFERENCES `FmsUsers` (`userKey`),
  -- CONSTRAINT `fu_permissionGroupKey_fk` FOREIGN KEY (`permissionGroupKey`) REFERENCES `FmsPermissionGroups` (`permissionGroupKey`),
  -- CONSTRAINT `fu_userLevel_fk` FOREIGN KEY (`userLevel`) REFERENCES `FmsCodes` (`code`),
  -- CONSTRAINT `fu_userStatus_fk` FOREIGN KEY (`userStatus`) REFERENCES `FmsCodes` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='회원 테이블';

-- 테이블 데이터 file_management_service.FmsUsers:~0 rows (대략적) 내보내기
/*!40000 ALTER TABLE `FmsUsers` DISABLE KEYS */;
INSERT INTO `FmsUsers` (`seq`, `parentUserKey`, `userKey`, `companyKey`, `permissionGroupKey`, `userLevel`, `userId`, `userPassword`, `userName`, `userPhone`, `userMemo`, `createdAt`, `createdIp`, `updatedAt`, `updatedIp`, `userStatus`, `isDeletedRow`) VALUES
	(1, NULL, 'C1618033738099vtEiUg', 'ovau1623568601311tXN', 'T1617773784543MKLRZn', 'USLEV00000001', 'test123', '99f88c13a6d18695db09c2ce0774f4ae088eb4ae6a730f57fa8289ec81d4ed0cea3c853b990932aa611d3dddf0770d0cdd713c453b47c3879f8af5249201a623', '홍길동', '010-1234-1234', 'zzzz', '2021-06-27 13:25:11', '::ffff:172.17.0.1', NULL, '::ffff:172.17.0.1', 'USRST00000001', 'N');
/*!40000 ALTER TABLE `FmsUsers` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
