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

-- 테이블 file_management_service.FmsCompanyInfos 구조 내보내기
CREATE TABLE IF NOT EXISTS `FmsCompanyInfos` (
  `seq` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '대체키 숫자값',
  `companyInfoKey` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '회사 정보 식별키',
  `companyKey` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '회사 고유 식별키',
  `createrUserKey` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '회원 고유 식별키',
  `createdAt` datetime NOT NULL DEFAULT current_timestamp() COMMENT '생성일',
  `updatedAt` datetime DEFAULT NULL COMMENT '수정일',
  PRIMARY KEY (`companyInfoKey`),
  UNIQUE KEY `seq` (`seq`),
  UNIQUE KEY `companyKey` (`companyKey`)
  -- KEY `fcis_createrUserKey_fk` (`createrUserKey`),
  -- CONSTRAINT `fcis_companyKey_fk` FOREIGN KEY (`companyKey`) REFERENCES `FmsCompanys` (`companyKey`),
  -- CONSTRAINT `fcis_createrUserKey_fk` FOREIGN KEY (`createrUserKey`) REFERENCES `FmsUsers` (`userKey`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='회사 부가 정보 테이블';

-- 테이블 데이터 file_management_service.FmsCompanyInfos:~0 rows (대략적) 내보내기
/*!40000 ALTER TABLE `FmsCompanyInfos` DISABLE KEYS */;
INSERT INTO `FmsCompanyInfos` (`seq`, `companyInfoKey`, `companyKey`, `createrUserKey`, `createdAt`, `updatedAt`) VALUES
	(1, 'tEZl1624718677168DhM', 'ovau1623568601311tXN', 'C1618033738099vtEiUg', '2021-06-27 13:26:56', NULL);
/*!40000 ALTER TABLE `FmsCompanyInfos` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
