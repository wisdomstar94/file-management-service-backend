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

-- 테이블 file_management_service.FmsCompanys 구조 내보내기
CREATE TABLE IF NOT EXISTS `FmsCompanys` (
  `seq` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '대체키 숫자값',
  `companyKey` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '회사 고유 식별키',
  `companyName` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '회사명',
  `companyCEOName` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '회사 대표자명',
  `companyCEOTel` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '회사 대표자의 연락처',
  `companyTel` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '회사대표번호',
  `companyBusinessNumber` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '사업자번호',
  `companyAddress` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '사업장주소',
  `memo` text COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '회사 메모',
  `createdAt` datetime NOT NULL DEFAULT current_timestamp() COMMENT '생성일',
  `createdIp` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '생성시 요청 IP',
  `updatedAt` datetime DEFAULT NULL COMMENT '수정일',
  `updatedIp` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '수정시 요청 IP',
  `companyStatus` varchar(13) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '회사 상태',
  `isDeletedRow` enum('Y','N') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'N' COMMENT '행 삭제 여부',
  PRIMARY KEY (`companyKey`),
  UNIQUE KEY `seq` (`seq`),
  KEY `fms_companys_is_deleted_row` (`isDeletedRow`),
  KEY `fcp_companyStatus_fk` (`companyStatus`),
  CONSTRAINT `fcp_companyStatus_fk` FOREIGN KEY (`companyStatus`) REFERENCES `FmsCodes` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='회사 테이블';

-- 테이블 데이터 file_management_service.FmsCompanys:~0 rows (대략적) 내보내기
/*!40000 ALTER TABLE `FmsCompanys` DISABLE KEYS */;
INSERT INTO `FmsCompanys` (`seq`, `companyKey`, `companyName`, `companyCEOName`, `companyCEOTel`, `companyTel`, `companyBusinessNumber`, `companyAddress`, `memo`, `createdAt`, `createdIp`, `updatedAt`, `updatedIp`, `companyStatus`, `isDeletedRow`) VALUES
	(1, 'ovau1623568601311tXN', '선택안함', NULL, NULL, NULL, NULL, NULL, NULL, '2021-06-27 13:25:11', '::ffff:172.17.0.1', NULL, NULL, 'CMPST00000001', 'N');
/*!40000 ALTER TABLE `FmsCompanys` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
