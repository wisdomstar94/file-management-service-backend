const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const myValueLog = require('../../../librarys/myValueLog');
const myResultCode = require('../../../librarys/myResultCode');
const myDate = require('../../../librarys/myDate');
const myGetMakeToken = require('../../../librarys/myGetMakeToken').myGetMakeToken;
const { Op } = require('sequelize');

const getPermission = wrapper(async(req, res, next) => {
  const {
    menuKey, // optional
    menuName, // optional
    permissionKey, // optional
    permissionName, // optional
    permissionDescription, // optional
    createdAtStart, // optional
    createdAtEnd, // optional
    createdIp, // optional
    updatedAtStart, // optional
    updatedAtEnd, // optional
    updatedIp, // optional
  } = req.body;


  const OpAndArray = [];
  const menuWhereOpAndArray = [];


  // menuKey 체크
  if (typeof menuKey === 'string') {
    if (menuKey.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20012010,
          msg: myResultCode[20012010].msg,
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
          code: 20012020,
          msg: myResultCode[20012020].msg,
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
          code: 20012030,
          msg: myResultCode[20012030].msg,
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
            code: 20012040,
            msg: myResultCode[20012040].msg,
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
            code: 20012050,
            msg: myResultCode[20012050].msg,
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
            code: 20012060,
            msg: myResultCode[20012060].msg,
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

  // menuName 체크
  if (typeof menuName === 'string') {
    menuWhereOpAndArray.push({
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
          code: 20012070,
          msg: myResultCode[20012070].msg,
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
            code: 20012080,
            msg: myResultCode[20012080].msg,
          },
        }));
        return;
      }
    }

    menuWhereOpAndArray.push({
      [Op.or]: menuName.map((x) => {
        return { 
          menuName: {
            [Op.substring]: x
          } 
        };
      }),
    });
  }

  // permissionKey 체크
  if (typeof permissionKey === 'string') {
    if (permissionKey.trim() === '') {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20012090,
          msg: myResultCode[20012090].msg,
        },
      }));
      return;
    }

    if (permissionKey.length !== 20) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20012100,
          msg: myResultCode[20012100].msg,
        },
      }));
      return;
    }

    OpAndArray.push({
      permissionKey: {
        [Op.eq]: permissionKey,
      },
    });
  } else if (Array.isArray(permissionKey)) {
    if (permissionKey.length === 0) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20012110,
          msg: myResultCode[20012110].msg,
        },
      }));
      return;
    }

    for (let i = 0; i < permissionKey.length; i++) {
      if (typeof permissionKey[i] !== 'string') {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20012120,
            msg: myResultCode[20012120].msg,
          },
        }));
        return;
      }

      if (permissionKey[i].trim() === '') {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20012130,
            msg: myResultCode[20012130].msg,
          },
        }));
        return;
      }

      if (permissionKey[i].length !== 20) {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20012140,
            msg: myResultCode[20012140].msg,
          },
        }));
        return;
      }
    }

    OpAndArray.push({
      permissionKey: {
        [Op.in]: permissionKey,
      },
    });
  }

  // permissionName 체크
  if (typeof permissionName === 'string') {
    OpAndArray.push({
      permissionName: {
        [Op.substring]: permissionName,
      },
    });
  } else if (Array.isArray(permissionName)) {
    if (permissionName.length === 0) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20012150,
          msg: myResultCode[20012150].msg,
        },
      }));
      return;
    }

    for (let i = 0; i < permissionName.length; i++) {
      if (typeof permissionName[i] !== 'string') {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20012160,
            msg: myResultCode[20012160].msg,
          },
        }));
        return;
      }
    }

    OpAndArray.push({
      [Op.or]: permissionName.map((x) => {
        return { 
          permissionName: {
            [Op.substring]: x
          } 
        };
      }),
    });
  }

  // permissionDescription 체크
  if (typeof permissionDescription === 'string') {
    OpAndArray.push({
      permissionDescription: {
        [Op.substring]: permissionDescription,
      },
    });
  } else if (Array.isArray(permissionDescription)) {
    if (permissionDescription.length === 0) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20012170,
          msg: myResultCode[20012170].msg,
        },
      }));
      return;
    }

    for (let i = 0; i < permissionDescription.length; i++) {
      if (typeof permissionDescription[i] !== 'string') {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20012180,
            msg: myResultCode[20012180].msg,
          },
        }));
        return;
      }
    }

    OpAndArray.push({
      [Op.or]: permissionDescription.map((x) => {
        return { 
          permissionDescription: {
            [Op.substring]: x,
          }, 
        };
      }),
    });
  }

  // createdAtStart 체크
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
          code: 20012190,
          msg: myResultCode[20012190].msg,
        },
      }));
      return;
    }
  }

  // createdAtEnd 체크
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
          code: 20012200,
          msg: myResultCode[20012200].msg,
        },
      }));
      return;
    }
  }

  // createdIp 체크
  if (typeof createdIp === 'string') {
    OpAndArray.push({
      createdIp: {
        [Op.substring]: createdIp,
      },
    });
  } else if (Array.isArray(createdIp)) {
    if (createdIp.length === 0) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20012210,
          msg: myResultCode[20012210].msg,
        },
      }));
      return;
    }

    for (let i = 0; i < createdIp.length; i++) {
      if (typeof createdIp[i] !== 'string') {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20012220,
            msg: myResultCode[20012220].msg,
          },
        }));
        return;
      }
    }

    OpAndArray.push({
      [Op.or]: createdIp.map((x) => {
        return { 
          createdIp: {
            [Op.substring]: x
          } 
        };
      }),
    });
  }

  // updatedAtStart 체크
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
          code: 20012230,
          msg: myResultCode[20012230].msg,
        },
      }));
      return;
    }
  }

  // updatedAtEnd 체크
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
          code: 20012240,
          msg: myResultCode[20012240].msg,
        },
      }));
      return;
    }
  }

  // updatedIp 체크
  if (typeof updatedIp === 'string') {
    OpAndArray.push({
      updatedIp: {
        [Op.substring]: updatedIp,
      },
    });
  } else if (Array.isArray(updatedIp)) {
    if (updatedIp.length === 0) {
      res.status(200).json(myValueLog({
        req: req,
        obj: {
          result: 'failure',
          headTail: req.accessUniqueKey,
          code: 20012250,
          msg: myResultCode[20012250].msg,
        },
      }));
      return;
    }

    for (let i = 0; i < updatedIp.length; i++) {
      if (typeof updatedIp[i] !== 'string') {
        res.status(200).json(myValueLog({
          req: req,
          obj: {
            result: 'failure',
            headTail: req.accessUniqueKey,
            code: 20012260,
            msg: myResultCode[20012260].msg,
          },
        }));
        return;
      }
    }

    OpAndArray.push({
      [Op.or]: updatedIp.map((x) => {
        return { 
          updatedIp: {
            [Op.substring]: x
          } 
        };
      }),
    });
  }
  

  // 권한 리스트 가져오기
  const where = {
    [Op.and]: OpAndArray,
    isDeletedRow: 'N',
  };

  const list = await db.FmsPermissions.findAll({
    where: where,
    order: [
      ['menuKey', 'ASC'],
      ['sortNo', 'ASC'],
    ],
    include: [
      {
        model: db.FmsMenus,
        attributes: [
          'menuName',
        ],
        where: {
          [Op.and]: menuWhereOpAndArray,
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

module.exports = getPermission;