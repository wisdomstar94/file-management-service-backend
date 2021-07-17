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

-- 테이블 file_management_service.FmsPermissionGroups 구조 내보내기
CREATE TABLE IF NOT EXISTS `FmsPermissionGroups` (
  `seq` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '대체키 숫자값',
  `permissionGroupKey` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '권한 그룹 고유 식별키',
  `permissionGroupName` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '권한 그룹명',
  `permissionGroupDescription` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '권한 그룹 설명',
  `sortNo` int(11) NOT NULL DEFAULT 1 COMMENT '권한 그룹 순서',
  `createdAt` datetime NOT NULL DEFAULT current_timestamp() COMMENT '생성일',
  `createdIp` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '생성시 요청 IP',
  `updatedAt` datetime DEFAULT NULL COMMENT '수정일',
  `updatedIp` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '수정시 요청 IP',
  `permissionGroupStatus` varchar(13) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '권한 그룹 상태',
  `isDeletedRow` enum('Y','N') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'N' COMMENT '행 삭제 여부',
  PRIMARY KEY (`permissionGroupKey`),
  UNIQUE KEY `seq` (`seq`),
  KEY `fms_permission_groups_is_deleted_row` (`isDeletedRow`),
  KEY `fpg_permissionGroupStatus_fk` (`permissionGroupStatus`),
  CONSTRAINT `fpg_permissionGroupStatus_fk` FOREIGN KEY (`permissionGroupStatus`) REFERENCES `FmsCodes` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='권한 그룹 테이블';

-- 테이블 데이터 file_management_service.FmsPermissionGroups:~0 rows (대략적) 내보내기
/*!40000 ALTER TABLE `FmsPermissionGroups` DISABLE KEYS */;
INSERT INTO `FmsPermissionGroups` (`seq`, `permissionGroupKey`, `permissionGroupName`, `permissionGroupDescription`, `sortNo`, `createdAt`, `createdIp`, `updatedAt`, `updatedIp`, `permissionGroupStatus`, `isDeletedRow`) VALUES
	(1, 'T1617773784543MKLRZn', '최고 관리자 권한', '최고 관리자 권한 입니다.', 1, '2021-06-27 13:25:11', '::ffff:172.17.0.1', '2021-07-17 17:26:51', '::ffff:172.17.0.1', 'PEGRS00000001', 'N');
/*!40000 ALTER TABLE `FmsPermissionGroups` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
