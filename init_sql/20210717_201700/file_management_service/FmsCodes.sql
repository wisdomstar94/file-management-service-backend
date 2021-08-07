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

-- 테이블 file_management_service.FmsCodes 구조 내보내기
CREATE TABLE IF NOT EXISTS `FmsCodes` (
  `seq` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '대체키 숫자값',
  `codeGroup` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '코드 그룹',
  `code` varchar(13) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '코드',
  `codeName` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '코드명',
  `codeDescription` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '코드 설명',
  `codeValue1` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '코드 필요값 1',
  `codeValue2` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '코드 필요값 2',
  `sortNo` int(11) NOT NULL DEFAULT 1 COMMENT '코드 표시 순서',
  `createdAt` datetime NOT NULL DEFAULT current_timestamp() COMMENT '생성일',
  `updatedAt` datetime DEFAULT NULL COMMENT '수정일',
  `status` tinyint(1) NOT NULL DEFAULT 1 COMMENT '코드 상태 (1: 사용, 2: 미사용)',
  `isDeletedRow` enum('Y','N') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'N' COMMENT '행 삭제 여부',
  PRIMARY KEY (`code`),
  UNIQUE KEY `seq` (`seq`)
  -- KEY `fms_codes_status` (`status`),
  -- KEY `fms_codes_is_deleted_row` (`isDeletedRow`),
  -- KEY `fc_codeGroup_fk` (`codeGroup`),
  -- CONSTRAINT `fc_codeGroup_fk` FOREIGN KEY (`codeGroup`) REFERENCES `FmsCodeGroups` (`codeGroup`)
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='코드 테이블';

-- 테이블 데이터 file_management_service.FmsCodes:~66 rows (대략적) 내보내기
/*!40000 ALTER TABLE `FmsCodes` DISABLE KEYS */;
INSERT INTO `FmsCodes` (`seq`, `codeGroup`, `code`, `codeName`, `codeDescription`, `codeValue1`, `codeValue2`, `sortNo`, `createdAt`, `updatedAt`, `status`, `isDeletedRow`) VALUES
	(26, 'CMPST', 'CMPST00000001', '정상', NULL, NULL, NULL, 1, '2021-04-11 19:45:57', NULL, 1, 'N'),
	(27, 'CMPST', 'CMPST00000002', '승인대기중', NULL, NULL, NULL, 2, '2021-04-11 19:46:07', NULL, 1, 'N'),
	(28, 'CMPST', 'CMPST00000003', '이용정지', NULL, NULL, NULL, 3, '2021-04-11 19:46:16', NULL, 1, 'N'),
	(44, 'FDUCS', 'FDUCS00000001', '적용', NULL, NULL, NULL, 1, '2021-04-19 13:42:32', NULL, 1, 'N'),
	(45, 'FDUCS', 'FDUCS00000002', '미적용', NULL, NULL, NULL, 2, '2021-04-19 13:42:32', NULL, 1, 'N'),
	(41, 'FDUCT', 'FDUCT00000001', '특정 IP 제한', NULL, NULL, NULL, 1, '2021-04-19 11:25:28', NULL, 1, 'N'),
	(42, 'FDUCT', 'FDUCT00000002', '특정 Header 값 제한', NULL, NULL, NULL, 2, '2021-04-19 11:25:28', NULL, 1, 'N'),
	(43, 'FDUCT', 'FDUCT00000003', '특정 암호 필요', NULL, NULL, NULL, 3, '2021-04-19 11:25:28', NULL, 1, 'N'),
	(81, 'FDUCT', 'FDUCT00000004', '파일 정보 확인 후 다운로드 (URL 직접 다운로드 제한)', NULL, NULL, NULL, 4, '2021-06-19 08:04:39', NULL, 1, 'N'),
	(39, 'FDUST', 'FDUST00000001', '정상', NULL, NULL, NULL, 1, '2021-04-19 10:48:57', NULL, 1, 'N'),
	(40, 'FDUST', 'FDUST00000002', '비공개', NULL, NULL, NULL, 2, '2021-04-19 10:48:57', NULL, 1, 'N'),
	(33, 'FIMSS', 'FIMSS00000001', '정상', NULL, NULL, NULL, 1, '2021-04-12 15:50:52', NULL, 1, 'N'),
	(34, 'FIMSS', 'FIMSS00000002', '사용안함', NULL, NULL, NULL, 2, '2021-04-12 15:51:02', NULL, 1, 'N'),
	(31, 'FIMST', 'FIMST00000001', '스크린샷', NULL, NULL, NULL, 1, '2021-04-12 15:30:00', NULL, 1, 'N'),
	(32, 'FIMST', 'FIMST00000002', '대표 이미지', NULL, NULL, NULL, 2, '2021-04-12 15:30:07', NULL, 1, 'N'),
	(29, 'FISTS', 'FISTS00000001', '정상', NULL, NULL, NULL, 1, '2021-04-12 12:59:24', NULL, 1, 'N'),
	(30, 'FISTS', 'FISTS00000002', '비공개', NULL, NULL, NULL, 2, '2021-04-12 12:59:39', NULL, 1, 'N'),
	(35, 'FVSTS', 'FVSTS00000001', '정상', NULL, NULL, NULL, 1, '2021-04-12 22:18:37', NULL, 1, 'N'),
	(36, 'FVSTS', 'FVSTS00000002', '비공개', NULL, NULL, NULL, 2, '2021-04-12 22:18:37', NULL, 1, 'N'),
	(46, 'LOGTY', 'LOGTY00000001', '미지정', NULL, NULL, NULL, 1, '2021-05-01 12:43:32', NULL, 1, 'N'),
	(47, 'LOGTY', 'LOGTY00000002', '로그인 시도', NULL, NULL, NULL, 2, '2021-05-01 12:43:32', NULL, 1, 'N'),
	(48, 'LOGTY', 'LOGTY00000003', '로그인 성공', NULL, NULL, NULL, 3, '2021-05-01 12:43:32', NULL, 1, 'N'),
	(49, 'LOGTY', 'LOGTY00000004', '회원 정보 수정 시도', NULL, NULL, NULL, 4, '2021-05-01 12:43:32', NULL, 1, 'N'),
	(50, 'LOGTY', 'LOGTY00000005', '회원 정보 수정 성공', NULL, NULL, NULL, 5, '2021-05-01 12:43:32', NULL, 1, 'N'),
	(51, 'LOGTY', 'LOGTY00000006', '아이디 중복 체크 시도', NULL, NULL, NULL, 6, '2021-05-01 12:43:32', NULL, 1, 'N'),
	(52, 'LOGTY', 'LOGTY00000007', '아이디 중복 체크 성공', NULL, NULL, NULL, 7, '2021-05-01 12:43:32', NULL, 1, 'N'),
	(53, 'LOGTY', 'LOGTY00000008', '회원가입 시도', NULL, NULL, NULL, 8, '2021-05-01 12:43:32', NULL, 1, 'N'),
	(54, 'LOGTY', 'LOGTY00000009', '회원가입 성공', NULL, NULL, NULL, 9, '2021-05-01 12:43:32', NULL, 1, 'N'),
	(55, 'LOGTY', 'LOGTY00000010', '회원 생성 시도', NULL, NULL, NULL, 10, '2021-05-01 12:43:32', NULL, 1, 'N'),
	(56, 'LOGTY', 'LOGTY00000011', '회원 생성 성공', NULL, NULL, NULL, 11, '2021-05-01 12:43:32', NULL, 1, 'N'),
	(57, 'LOGTY', 'LOGTY00000012', '회원 삭제 시도', NULL, NULL, NULL, 12, '2021-05-01 12:43:32', NULL, 1, 'N'),
	(58, 'LOGTY', 'LOGTY00000013', '회원 삭제 성공', NULL, NULL, NULL, 13, '2021-05-01 12:43:32', NULL, 1, 'N'),
	(59, 'LOGTY', 'LOGTY00000014', '그룹 권한 등록/수정 시도', NULL, NULL, NULL, 14, '2021-05-01 12:43:32', NULL, 1, 'N'),
	(61, 'LOGTY', 'LOGTY00000015', '그룹 권한 삭제 시도', NULL, NULL, NULL, 15, '2021-05-01 12:43:32', NULL, 1, 'N'),
	(62, 'LOGTY', 'LOGTY00000016', '그룹 권한 삭제 성공', NULL, NULL, NULL, 16, '2021-05-01 12:43:32', NULL, 1, 'N'),
	(63, 'LOGTY', 'LOGTY00000017', '파일 버전 수정 시도', NULL, NULL, NULL, 17, '2021-05-01 12:43:32', NULL, 1, 'N'),
	(64, 'LOGTY', 'LOGTY00000018', '파일 버전 수정 성공', NULL, NULL, NULL, 18, '2021-05-01 12:43:32', NULL, 1, 'N'),
	(65, 'LOGTY', 'LOGTY00000019', '파일 버전 업로드 시도', NULL, NULL, NULL, 19, '2021-05-01 12:43:32', NULL, 1, 'N'),
	(66, 'LOGTY', 'LOGTY00000020', '파일 버전 업로드 성공', NULL, NULL, NULL, 20, '2021-05-01 12:43:32', NULL, 1, 'N'),
	(67, 'LOGTY', 'LOGTY00000021', '파일 다운로드 URL 등록 시도', NULL, NULL, NULL, 21, '2021-05-01 12:43:32', NULL, 1, 'N'),
	(68, 'LOGTY', 'LOGTY00000022', '파일 다운로드 URL 등록 성공', NULL, NULL, NULL, 22, '2021-05-01 12:43:32', NULL, 1, 'N'),
	(69, 'LOGTY', 'LOGTY00000023', '파일 다운로드 URL 수정 시도', NULL, NULL, NULL, 23, '2021-05-01 12:43:32', NULL, 1, 'N'),
	(70, 'LOGTY', 'LOGTY00000024', '파일 다운로드 URL 수정 성공', NULL, NULL, NULL, 24, '2021-05-01 12:43:32', NULL, 1, 'N'),
	(71, 'LOGTY', 'LOGTY00000025', '파일 등록 시도', NULL, NULL, NULL, 25, '2021-05-01 12:43:32', NULL, 1, 'N'),
	(72, 'LOGTY', 'LOGTY00000026', '파일 등록 성공', NULL, NULL, NULL, 26, '2021-05-01 12:43:32', NULL, 1, 'N'),
	(73, 'LOGTY', 'LOGTY00000027', '파일 수정 시도', NULL, NULL, NULL, 27, '2021-05-01 12:43:32', NULL, 1, 'N'),
	(74, 'LOGTY', 'LOGTY00000028', '파일 수정 성공', NULL, NULL, NULL, 28, '2021-05-01 12:43:32', NULL, 1, 'N'),
	(75, 'LOGTY', 'LOGTY00000029', '회사 등록 시도', NULL, NULL, NULL, 29, '2021-05-01 12:43:32', NULL, 1, 'N'),
	(76, 'LOGTY', 'LOGTY00000030', '회사 등록 성공', NULL, NULL, NULL, 30, '2021-05-01 12:43:32', NULL, 1, 'N'),
	(77, 'LOGTY', 'LOGTY00000031', '회사 삭제 시도', NULL, NULL, NULL, 31, '2021-05-01 12:43:32', NULL, 1, 'N'),
	(78, 'LOGTY', 'LOGTY00000032', '회사 삭제 성공', NULL, NULL, NULL, 32, '2021-05-01 12:43:32', NULL, 1, 'N'),
	(79, 'LOGTY', 'LOGTY00000033', '회사 수정 성공', NULL, NULL, NULL, 33, '2021-05-01 12:43:32', NULL, 1, 'N'),
	(80, 'LOGTY', 'LOGTY00000034', '회사 수정 성공', NULL, NULL, NULL, 33, '2021-05-01 12:43:32', NULL, 1, 'N'),
	(82, 'LOGTY', 'LOGTY00000035', '파일 삭제 시도', NULL, NULL, NULL, 34, '2021-07-17 17:10:59', NULL, 1, 'N'),
	(83, 'LOGTY', 'LOGTY00000036', '파일 삭제 성공', NULL, NULL, NULL, 35, '2021-07-17 17:10:59', NULL, 1, 'N'),
	(84, 'LOGTY', 'LOGTY00000037', '파일 버전 삭제 시도', NULL, NULL, NULL, 36, '2021-07-17 17:10:59', NULL, 1, 'N'),
	(85, 'LOGTY', 'LOGTY00000038', '파일 버전 삭제 성공', NULL, NULL, NULL, 37, '2021-07-17 17:10:59', NULL, 1, 'N'),
	(86, 'LOGTY', 'LOGTY00000039', '파일 다운로드 URL 삭제 시도', NULL, NULL, NULL, 38, '2021-07-17 17:10:59', NULL, 1, 'N'),
	(87, 'LOGTY', 'LOGTY00000040', '파일 다운로드 URL 삭제 성공', NULL, NULL, NULL, 39, '2021-07-17 17:10:59', NULL, 1, 'N'),
	(22, 'MENUS', 'MENUS00000001', '정상', NULL, NULL, NULL, 1, '2021-04-04 17:07:01', NULL, 1, 'N'),
	(23, 'MENUS', 'MENUS00000002', '사용안함', NULL, NULL, NULL, 2, '2021-04-04 17:07:08', NULL, 1, 'N'),
	(20, 'MNCAT', 'MNCAT00000001', '정상', NULL, NULL, NULL, 1, '2021-03-30 19:42:52', NULL, 1, 'N'),
	(21, 'MNCAT', 'MNCAT00000002', '사용안함', NULL, NULL, NULL, 2, '2021-03-30 19:43:17', NULL, 1, 'N'),
	(24, 'PEGRS', 'PEGRS00000001', '정상', NULL, NULL, NULL, 1, '2021-04-07 14:06:09', NULL, 1, 'N'),
	(25, 'PEGRS', 'PEGRS00000002', '이용안함', NULL, NULL, NULL, 2, '2021-04-07 14:06:35', NULL, 1, 'N'),
	(37, 'USLEV', 'USLEV00000001', '최고 관리자', NULL, NULL, NULL, 1, '2021-04-13 17:17:59', NULL, 1, 'N'),
	(38, 'USLEV', 'USLEV00000002', '일반 사용자', NULL, NULL, NULL, 2, '2021-04-13 17:18:13', NULL, 1, 'N'),
	(1, 'USRST', 'USRST00000001', '정상', '정상 상태', NULL, NULL, 1, '2021-03-29 09:07:20', '2021-04-04 11:39:05', 1, 'N'),
	(2, 'USRST', 'USRST00000002', '승인대기중', '아직 로그인이 가능하지 않은 상태', NULL, NULL, 1, '2021-03-29 13:03:11', NULL, 1, 'N'),
	(3, 'USRST', 'USRST00000003', '이용정지', '이용이 정지된 상태', NULL, NULL, 1, '2021-03-29 13:06:48', '2021-03-30 11:28:56', 1, 'N'),
	(4, 'USRST', 'USRST00000004', '보류', '보류 상태', NULL, NULL, 1, '2021-03-29 13:09:03', '2021-04-04 11:39:05', 1, 'N'),
	(15, 'USRST', 'USRST00000005', '탈퇴', '탈퇴 처리 상태', '필요값', '필요값', 1, '2021-03-29 22:41:25', '2021-04-04 11:39:05', 1, 'N');
/*!40000 ALTER TABLE `FmsCodes` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
