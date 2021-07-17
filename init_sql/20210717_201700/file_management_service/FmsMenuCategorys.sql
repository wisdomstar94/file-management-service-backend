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

-- 테이블 file_management_service.FmsMenuCategorys 구조 내보내기
CREATE TABLE IF NOT EXISTS `FmsMenuCategorys` (
  `seq` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '대체키 숫자값',
  `menuCategoryKey` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '메뉴 카테고리 고유 식별키',
  `menuCategoryName` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '메뉴 카테고리명',
  `menuCategoryDescription` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '메뉴 카테고리 설명',
  `sortNo` int(11) NOT NULL DEFAULT 1 COMMENT '순서',
  `createdAt` datetime NOT NULL DEFAULT current_timestamp() COMMENT '생성일',
  `createdIp` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '생성시 요청 IP',
  `updatedAt` datetime DEFAULT NULL COMMENT '수정일',
  `updatedIp` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '수정시 요청 IP',
  `menuCategoryStatus` varchar(13) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '메뉴 카테고리 상태',
  `isDeletedRow` enum('Y','N') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'N' COMMENT '행 삭제 여부',
  PRIMARY KEY (`menuCategoryKey`),
  UNIQUE KEY `seq` (`seq`),
  KEY `fms_menu_categorys_is_deleted_row` (`isDeletedRow`),
  KEY `fmct_menuCategoryStatus_fk` (`menuCategoryStatus`),
  CONSTRAINT `fmct_menuCategoryStatus_fk` FOREIGN KEY (`menuCategoryStatus`) REFERENCES `FmsCodes` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='관리자 메뉴 카테고리 테이블';

-- 테이블 데이터 file_management_service.FmsMenuCategorys:~3 rows (대략적) 내보내기
/*!40000 ALTER TABLE `FmsMenuCategorys` DISABLE KEYS */;
INSERT INTO `FmsMenuCategorys` (`seq`, `menuCategoryKey`, `menuCategoryName`, `menuCategoryDescription`, `sortNo`, `createdAt`, `createdIp`, `updatedAt`, `updatedIp`, `menuCategoryStatus`, `isDeletedRow`) VALUES
	(2, 'mbDP1617174513479Idx', '회원관리', NULL, 200, '2021-03-31 16:08:33', '::ffff:172.17.0.1', '2021-04-04 11:43:48', '::ffff:172.17.0.1', 'MNCAT00000001', 'N'),
	(1, 'QlRJW1617152893906Tx', '대시보드', NULL, 100, '2021-03-31 10:08:13', '::ffff:172.17.0.1', '2021-04-04 11:43:48', '::ffff:172.17.0.1', 'MNCAT00000001', 'N'),
	(3, 'WUSL1617174672133nuR', '파일관리', NULL, 300, '2021-03-31 16:11:12', '::ffff:172.17.0.1', '2021-04-04 11:43:48', '::ffff:172.17.0.1', 'MNCAT00000001', 'N');
/*!40000 ALTER TABLE `FmsMenuCategorys` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
