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

-- 테이블 file_management_service.FmsCodeGroups 구조 내보내기
CREATE TABLE IF NOT EXISTS `FmsCodeGroups` (
  `seq` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '대체키 숫자값',
  `codeGroup` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '코드 그룹',
  `codeGroupName` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '코드 그룹명',
  `codeGroupDescription` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '코드 그룹 설명',
  `createdAt` datetime NOT NULL DEFAULT current_timestamp() COMMENT '생성일',
  `updatedAt` datetime DEFAULT NULL COMMENT '수정일',
  `status` tinyint(1) NOT NULL DEFAULT 1 COMMENT '코드 그룹 상태 (1: 사용, 2:미사용)',
  `isDeletedRow` enum('Y','N') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'N' COMMENT '행 삭제 여부',
  PRIMARY KEY (`codeGroup`),
  UNIQUE KEY `seq` (`seq`)
  -- KEY `fms_code_groups_status` (`status`),
  -- KEY `fms_code_groups_is_deleted_row` (`isDeletedRow`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='코드 그룹 테이블';

-- 테이블 데이터 file_management_service.FmsCodeGroups:~14 rows (대략적) 내보내기
/*!40000 ALTER TABLE `FmsCodeGroups` DISABLE KEYS */;
INSERT INTO `FmsCodeGroups` (`seq`, `codeGroup`, `codeGroupName`, `codeGroupDescription`, `createdAt`, `updatedAt`, `status`, `isDeletedRow`) VALUES
	(2, 'CMPST', '회사 상태', NULL, '2021-03-30 11:33:17', '2021-03-30 12:04:59', 1, 'N'),
	(16, 'FDUCS', '파일 다운로드 URL 접근 제한 값 상태', NULL, '2021-04-19 13:38:57', NULL, 1, 'N'),
	(13, 'FDUCT', '파일 다운로드 URL 접근 제한 종류', NULL, '2021-04-19 11:24:33', NULL, 1, 'N'),
	(12, 'FDUST', '파일 다운로드 URL 상태', NULL, '2021-04-19 10:44:55', NULL, 1, 'N'),
	(9, 'FIMSS', '파일 이미지 상태', NULL, '2021-04-12 15:50:37', NULL, 1, 'N'),
	(8, 'FIMST', '파일 이미지 종류', NULL, '2021-04-12 15:29:37', NULL, 1, 'N'),
	(7, 'FISTS', '파일 상태', NULL, '2021-04-12 12:59:04', NULL, 1, 'N'),
	(10, 'FVSTS', '파일 버전 상태', NULL, '2021-04-12 22:18:20', NULL, 1, 'N'),
	(17, 'LOGTY', '로그 종류', NULL, '2021-05-01 12:43:12', NULL, 1, 'N'),
	(5, 'MENUS', '메뉴 상태', NULL, '2021-04-04 17:06:34', NULL, 1, 'N'),
	(3, 'MNCAT', '메뉴 카테고리 상태', NULL, '2021-03-30 19:39:14', NULL, 1, 'N'),
	(6, 'PEGRS', '권한 그룹 상태', NULL, '2021-04-07 14:05:25', NULL, 1, 'N'),
	(11, 'USLEV', '회원 등급', NULL, '2021-04-13 17:17:39', NULL, 1, 'N'),
	(1, 'USRST', '회원 상태', NULL, '2021-03-29 09:04:22', '2021-03-30 12:04:59', 1, 'N');
/*!40000 ALTER TABLE `FmsCodeGroups` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
