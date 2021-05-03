const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const myValueLog = require('../../../librarys/myValueLog');
const myResultCode = require('../../../librarys/myResultCode');
const myDate = require('../../../librarys/myDate');
const myGetMakeToken = require('../../../librarys/myGetMakeToken').myGetMakeToken;
const { Op } = require('sequelize');

const getUserMenu = wrapper(async(req, res, next) => {
  const loginInfo = req.loginInfo;
  /*
    loginInfo.userKey: 'C1618033738099vtEiUg',
    loginInfo.userId: 'test123',
    loginInfo.userName: '홍길동',
    loginInfo.ip: '::ffff:172.17.0.1'
  */
  loginInfo.userLevel = await db.FmsUsers.getUserLevel(loginInfo.userKey);



  // 대시보드 메뉴 체크
  const isDashboardMenuAccessPossible = await db.isActivePermission(loginInfo.userKey, 'JB1617682637993GaPCK');

  // 회사관리 메뉴 체크
  const isCompanyManagementMenuAccessPossible = await db.isActivePermission(loginInfo.userKey, 'U1617683411475etYgFO');

  // 회원관리 메뉴 체크
  const isUserManagementMenuAccessPossible = await db.isActivePermission(loginInfo.userKey, 'ku1617685799109yKitW');

  // 권한 그룹 관리 메뉴 체크
  const isPermissionGroupManagementMenuAccessPossible = await db.isActivePermission(loginInfo.userKey, 'CZp1617688337684iIEj');

  // 파일 관리 메뉴 체크
  const isFileManagementMenuAccessPossible = await db.isActivePermission(loginInfo.userKey, 'qVZe1617688959308fKJ');

  // 파일 다운로드 현황 메뉴 체크
  const isFileDownloadStatusMenuAccessPossible = await db.isActivePermission(loginInfo.userKey, 'gaXltl1617692064737B');



  // 메뉴 카테고리 불러오기
  const menuCategoryList = await db.FmsMenuCategorys.findAll({
    attributes: [
      'menuCategoryKey', 'menuCategoryName',
    ],
    where: {
      isDeletedRow: 'N',
      menuCategoryStatus: 'MNCAT00000001',
    },
    order: [
      ['sortNo', 'ASC'],
    ],
  });
  /*
    "menuCategoryList": [
      {
        "menuCategoryKey": "QlRJW1617152893906Tx",
        "menuCategoryName": "대시보드"
      },
      {
        "menuCategoryKey": "mbDP1617174513479Idx",
        "menuCategoryName": "회원관리"
      },
      {
        "menuCategoryKey": "WUSL1617174672133nuR",
        "menuCategoryName": "파일관리"
      }
    ]
  */
  const menuCategoryListReal = menuCategoryList.map((x) => { return x.dataValues; });

  for (let i = 0; i < menuCategoryListReal.length; i++) {
    const item = menuCategoryListReal[i];
    const menuCategoryKey = item.menuCategoryKey;

    const menuKeyNotIns = [];

    if (!isDashboardMenuAccessPossible) {
      menuKeyNotIns.push('khPJl1617523858875yO');
    }

    if (!isCompanyManagementMenuAccessPossible) {
      menuKeyNotIns.push('kmRQ1617524080387RwV');
    }

    if (!isUserManagementMenuAccessPossible) {
      menuKeyNotIns.push('wjajq1617524117533xg');
    }

    if (!isPermissionGroupManagementMenuAccessPossible) {
      menuKeyNotIns.push('ZCjC1617524137491OCy');
    }

    if (!isFileManagementMenuAccessPossible) {
      menuKeyNotIns.push('Ig1617524166484wTSHK');
    }

    if (!isFileDownloadStatusMenuAccessPossible) {
      menuKeyNotIns.push('njHLKh1617524193166T');
    }

    const where = {
      menuKey: {
        [Op.notIn]: menuKeyNotIns,
      },
      menuCategoryKey: menuCategoryKey,
      isDeletedRow: 'N',
      menuStatus: 'MENUS00000001',
    };

    const menuList = await db.FmsMenus.findAll({
      attributes: [
        'menuCategoryKey', 'menuKey', 'menuName',
      ],
      where: where,
      order: [
        ['sortNo', 'ASC'],
      ],
    });

    menuCategoryListReal[i].menuList = menuList.map((x) => { return x.dataValues; });
  }



  res.status(200).json(myValueLog({
    req: req,
    obj: {
      result: 'success',
      headTail: req.accessUniqueKey,
      code: 10001000,
      menuCategoryListReal: menuCategoryListReal,
    },
  }));
  return;
});

module.exports = getUserMenu;