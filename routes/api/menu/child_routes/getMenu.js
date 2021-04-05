const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const myValueLog = require('../../../librarys/myValueLog');
const myResultCode = require('../../../librarys/myResultCode');
const myDate = require('../../../librarys/myDate');
const myGetMakeToken = require('../../../librarys/myGetMakeToken').myGetMakeToken;
const { Op } = require('sequelize');

const getMenu = wrapper(async(req, res, next) => {
  const {
    parentMenuKey, // 부모 메뉴 고유 식별키 (undefined 또는 string 또는 string[])
    parentMenuName, // 부모 메뉴명 (undefined 또는 string 또는 string[])

    menuCategoryKey, // 메뉴 카테고리 고유 식별키 (undefined 또는 string 또는 string[])
    menuCategoryName, // 메뉴 카테고리명 (undefined 또는 string 또는 string[])

    menuKey, // 메뉴 고유 식별키 (undefined 또는 string 또는 string[])
    menuName, // 메뉴명 (undefined 또는 string 또는 string[]) 

    menuDescription, // 메뉴설명 (undefined 또는 string 또는 string[]) 

    createdAtStart, // 메뉴 등록일 시작일
    createdAtEnd, // 메뉴 등록일 종료일

    updatedAtStart, // 메뉴 수정일 시작일
    updatedAtEnd, // 메뉴 수정일 종료일

    menuStatus, // 메뉴 상태
  } = req.body;


  // 메뉴 카테고리 리스트 가져오기
  const OpAndArray = [];
  const parentMenuWhereOpAndArray = [];
  const menuCategoryWhereOpAndArray = [];

  // parentMenuKey : optional
  if (typeof parentMenuKey === 'string') {
    if (parentMenuKey.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20009010,
          msg: myResultCode[20009010].msg,
        },
      }));
      return;
    }

    if (parentMenuKey.length !== 20) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20009020,
          msg: myResultCode[20009020].msg,
        },
      }));
      return;
    }

    OpAndArray.push({
      parentMenuKey: {
        [Op.eq]: parentMenuKey,
      },
    });
  } else if (Array.isArray(parentMenuKey)) {
    if (parentMenuKey.length === 0) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20009030,
          msg: myResultCode[20009030].msg,
        },
      }));
      return;
    }

    for (let i = 0; i < parentMenuKey.length; i++) {
      if (typeof parentMenuKey[i] !== 'string') {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20009040,
            msg: myResultCode[20009040].msg,
          },
        }));
        return;
      }

      if (parentMenuKey[i].trim() === '') {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20009050,
            msg: myResultCode[20009050].msg,
          },
        }));
        return;
      }

      if (parentMenuKey[i].length !== 20) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20009060,
            msg: myResultCode[20009060].msg,
          },
        }));
        return;
      }
    }

    OpAndArray.push({
      parentMenuKey: {
        [Op.in]: parentMenuKey,
      },
    });
  }

  // parentMenuName : optional
  if (typeof parentMenuName === 'string') {
    parentMenuWhereOpAndArray.push({
      menuName: {
        [Op.substring]: parentMenuName,
      },
    });
  } else if (Array.isArray(parentMenuName)) {
    if (parentMenuName.length === 0) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20009070,
          msg: myResultCode[20009070].msg,
        },
      }));
      return;
    } 

    for (let i = 0; i < parentMenuName.length; i++) {
      if (typeof parentMenuName[i] !== 'string') {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20009080,
            msg: myResultCode[20009080].msg,
          },
        }));
        return;
      }
    }

    parentMenuWhereOpAndArray.push({
      [Op.or]: parentMenuName.map((x) => { 
        return { menuName: { [Op.substring]: x } }; 
      }),
    });
  }

  // menuCategoryKey : optional
  if (typeof menuCategoryKey === 'string') {
    if (menuCategoryKey.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20009090,
          msg: myResultCode[20009090].msg,
        },
      }));
      return;
    }

    if (menuCategoryKey.length !== 20) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20009100,
          msg: myResultCode[20009100].msg,
        },
      }));
      return;
    }

    OpAndArray.push({
      menuCategoryKey: {
        [Op.eq]: menuCategoryKey,
      },
    });
  } else if (Array.isArray(menuCategoryKey)) {
    if (menuCategoryKey.length === 0) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20009110,
          msg: myResultCode[20009110].msg,
        },
      }));
      return;
    }

    for (let i = 0; i < menuCategoryKey.length; i++) {
      if (typeof menuCategoryKey[i] !== 'string') {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20009120,
            msg: myResultCode[20009120].msg,
          },
        }));
        return;
      }

      if (menuCategoryKey[i].trim() === '') {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20009130,
            msg: myResultCode[20009130].msg,
          },
        }));
        return;
      }

      if (menuCategoryKey[i].length !== 20) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20009140,
            msg: myResultCode[20009140].msg,
          },
        }));
        return;
      }
    }

    OpAndArray.push({
      menuCategoryKey: {
        [Op.in]: menuCategoryKey,
      },
    });
  }

  // menuCategoryName : optional
  if (typeof menuCategoryName === 'string') {
    menuCategoryWhereOpAndArray.push({
      menuCategoryName: {
        [Op.substring]: menuCategoryName,
      },
    });
  } else if (Array.isArray(menuCategoryName)) {
    if (menuCategoryName.length === 0) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20009150,
          msg: myResultCode[20009150].msg,
        },
      }));
      return;
    } 

    for (let i = 0; i < menuCategoryName.length; i++) {
      if (typeof menuCategoryName[i] !== 'string') {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20009160,
            msg: myResultCode[20009160].msg,
          },
        }));
        return;
      }
    }

    menuCategoryWhereOpAndArray.push({
      [Op.or]: menuCategoryName.map((x) => { 
        return { menuCategoryName: { [Op.substring]: x } }; 
      }),
    });
  }

  // menuKey : optional
  if (typeof menuKey === 'string') {
    if (menuKey.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20009170,
          msg: myResultCode[20009170].msg,
        },
      }));
      return;
    }

    if (menuKey.length !== 20) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20009180,
          msg: myResultCode[20009180].msg,
        },
      }));
      return;
    }

    OpAndArray.push({
      menuKey: {
        [Op.eq]: menuKey,
      },
    });
  } else if (Array.isArray(menuKey)) {
    if (menuKey.length === 0) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20009190,
          msg: myResultCode[20009190].msg,
        },
      }));
      return;
    }

    for (let i = 0; i < menuKey.length; i++) {
      if (typeof menuKey[i] !== 'string') {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20009200,
            msg: myResultCode[20009200].msg,
          },
        }));
        return;
      }

      if (menuKey[i].trim() === '') {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20009210,
            msg: myResultCode[20009210].msg,
          },
        }));
        return;
      }

      if (menuKey[i].length !== 20) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20009220,
            msg: myResultCode[20009220].msg,
          },
        }));
        return;
      }
    }

    OpAndArray.push({
      menuKey: {
        [Op.in]: menuKey,
      },
    });
  }

  // menuName : optional
  if (typeof menuName === 'string') {
    OpAndArray.push({
      menuName: {
        [Op.substring]: menuName,
      },
    });
  } else if (Array.isArray(menuName)) {
    if (menuName.length === 0) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20009230,
          msg: myResultCode[20009230].msg,
        },
      }));
      return;
    } 

    for (let i = 0; i < menuName.length; i++) {
      if (typeof menuName[i] !== 'string') {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20009240,
            msg: myResultCode[20009240].msg,
          },
        }));
        return;
      }
    }

    OpAndArray.push({
      [Op.or]: menuName.map((x) => { 
        return { menuName: { [Op.substring]: x } }; 
      }),
    });
  }

  // menuDescription : optional
  if (typeof menuDescription === 'string') {
    OpAndArray.push({
      menuDescription: {
        [Op.substring]: menuDescription,
      },
    });
  } else if (Array.isArray(menuDescription)) {
    if (menuDescription.length === 0) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20009250,
          msg: myResultCode[20009250].msg,
        },
      }));
      return;
    } 

    for (let i = 0; i < menuDescription.length; i++) {
      if (typeof menuDescription[i] !== 'string') {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20009260,
            msg: myResultCode[20009260].msg,
          },
        }));
        return;
      }
    }

    OpAndArray.push({
      [Op.or]: menuDescription.map((x) => { 
        return { menuDescription: { [Op.substring]: x } }; 
      }),
    });
  }

  // createdAtStart : optional
  if (typeof createdAtStart === 'string') {
    if (myDate(createdAtStart).isValid()) {
      OpAndArray.push({
        createdAt: {
          [Op.gte]: createdAtStart,
        },
      });
    } else {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20009270,
          msg: myResultCode[20009270].msg,
        },
      }));
      return;
    }
  }

  // createdAtEnd : optional
  if (typeof createdAtEnd === 'string') {
    if (myDate(createdAtEnd).isValid()) {
      OpAndArray.push({
        createdAt: {
          [Op.lte]: createdAtEnd,
        },
      });
    } else {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20009280,
          msg: myResultCode[20009280].msg,
        },
      }));
      return;
    }
  }

  // updatedAtStart : optional
  if (typeof updatedAtStart === 'string') {
    if (myDate(updatedAtStart).isValid()) {
      OpAndArray.push({
        updatedAt: {
          [Op.gte]: updatedAtStart,
        },
      });
    } else {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20009290,
          msg: myResultCode[20009290].msg,
        },
      }));
      return;
    }
  }

  // updatedAtEnd : optional
  if (typeof updatedAtEnd === 'string') {
    if (myDate(updatedAtEnd).isValid()) {
      OpAndArray.push({
        updatedAt: {
          [Op.lte]: updatedAtEnd,
        },
      });
    } else {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20009300,
          msg: myResultCode[20009300].msg,
        },
      }));
      return;
    }
  }

  // menuStatus : optional
  if (typeof menuStatus === 'string') {
    OpAndArray.push({
      menuStatus: {
        [Op.substring]: menuStatus,
      },
    });
  } else if (Array.isArray(menuStatus)) {
    if (menuStatus.length === 0) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20009310,
          msg: myResultCode[20009310].msg,
        },
      }));
      return;
    } 

    for (let i = 0; i < menuStatus.length; i++) {
      if (typeof menuStatus[i] !== 'string') {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20009320,
            msg: myResultCode[20009320].msg,
          },
        }));
        return;
      }
    }

    OpAndArray.push({
      [Op.or]: menuStatus.map((x) => { 
        return { menuStatus: { [Op.substring]: x } }; 
      }),
    });
  }

  // required
  OpAndArray.push({
    isDeletedRow: 'N',
  });

  const where = {
    [Op.and]: OpAndArray,
  };
  const list = await db.FmsMenus.findAll({
    attributes: [
      'seq', 'parentMenuKey', 'menuCategoryKey', 'menuKey', 'menuName', 'menuDescription', 'sortNo',
      [db.Sequelize.fn('date_format', db.Sequelize.col('FmsMenus.createdAt'), '%Y-%m-%d %H:%i:%s'), 'createdAt'], 'createdIp',
      [db.Sequelize.fn('date_format', db.Sequelize.col('FmsMenus.updatedAt'), '%Y-%m-%d %H:%i:%s'), 'updatedAt'], 'updatedIp',
      'menuStatus',
    ],
    where: where,
    order: [
      ['menuCategoryKey', 'ASC'],
      ['sortNo', 'ASC'],
      ['createdAt', 'ASC'],
    ],
    include: [
      {
        model: db.FmsCodes,
        as: 'FmsCodesMenuStatus',
        attributes: [
          ['codeName', 'menuStatusString'],
        ],
      },
      {
        model: db.FmsMenus,
        as: 'FmsMenusParent',
        attributes: [
          'menuName',
        ],
        where: {
          [Op.and]: parentMenuWhereOpAndArray,
        },
        required: false,
      },
      {
        model: db.FmsMenuCategorys,
        attributes: [
          'menuCategoryName',
        ],
        where: {
          [Op.and]: menuCategoryWhereOpAndArray,
        },
      },
    ],
  });

  res.status(200).json(myValueLog({
    req: req,
    obj: {
      result: 'success',
      headTail: req.accessUniqueKey,
      code: 10001000,
      list: list,
    },
  }));
  return;
});

module.exports = getMenu;