'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('FmsFileVersions', {
      seq: {
        type: Sequelize.BIGINT.UNSIGNED,
        unique: true,
        allowNull: false,
        autoIncrement: true,
        comment: '대체키 숫자값',
      },
      fileVersionKey: {
        type: Sequelize.STRING(20),
        primaryKey: true,
        allowNull: false,
        comment: '파일 버전 고유 식별키',
      },
      fileKey: {
        type: Sequelize.STRING(20),
        allowNull: false,
        comment: '파일 고유 식별키',
        // FK
      },
      fileVersionName: {
        type: Sequelize.STRING(30),
        allowNull: false,
        comment: '파일 버전명',
      },
      fileVersionCode: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '파일 버전 코드',
      },
      fileOriginalName: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: '업로드 당시의 파일의 원래 이름(확장자 포함)',
      },
      fileDownloadName: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: '다운로드 될 때의 파일 이름 지정',
      },
      fileVersionMemo: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: '파일 버전에 대한 메모',
      },
      fileVersionDescription: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: '파일 버전에 대한 설명글 (외부에 공개될 내용)',
      },
      filePath: {
        type: Sequelize.STRING(500),
        allowNull: false,
        comment: '저장된 파일 경로',
      },
      fileSize: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '저장된 파일 용량 (byte)',
      },
      fileMimeType: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: '저장된 파일 종류',
      },
      createrUserKey: {
        type: Sequelize.STRING(20),
        allowNull: false,
        comment: '생성자 회원 고유 식별키',
        // FK
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: '생성일',
      },
      createdIp: {
        type: Sequelize.STRING(40),
        allowNull: false,
        comment: '생성시 요청 IP',
      },
      updaterUserKey: {
        type: Sequelize.STRING(20),
        allowNull: true,
        comment: '수정자 회원 고유 식별키',
        // FK
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: '수정일',
      },
      updatedIp: {
        type: Sequelize.STRING(40),
        allowNull: true,
        comment: '수정시 요청 IP',
      },
      fileVersionStatus: {
        type: Sequelize.STRING(13),
        allowNull: false,
        comment: '파일 버전 상태',
        // FK
      },
      isDeletedRow: {
        type: Sequelize.ENUM(['Y', 'N']),
        allowNull: false,
        defaultValue: 'N',
        comment: '행 삭제 여부',
      },
    }, {
      comment: '파일 버전 테이블',
    });
    await queryInterface.addIndex('FmsFileVersions', ['isDeletedRow']);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('FmsFileVersions');
  }
};