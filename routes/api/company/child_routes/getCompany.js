const db = require('../../../../models');
const wrapper = require('../../../librarys/myAsyncWrapper');
const myCrypto = require('../../../librarys/myCrypto');
const myValueLog = require('../../../librarys/myValueLog');
const myResultCode = require('../../../librarys/myResultCode');
const myDate = require('../../../librarys/myDate');
const myGetMakeToken = require('../../../librarys/myGetMakeToken').myGetMakeToken;
const myCommon = require('../../../librarys/myCommon');
const myBoard = require('../../../librarys/myBoard');
const myRegularExpressCheck = require('../../../librarys/myRegularExpressCheck');
const { Op, Sequelize } = require('sequelize');

const getCompany = wrapper(async(req, res, next) => {
  const loginInfo = req.loginInfo;
  /*
    loginInfo.userKey: 'C1618033738099vtEiUg',
    loginInfo.userId: 'test123',
    loginInfo.userName: '홍길동',
    loginInfo.ip: '::ffff:172.17.0.1'
  */
  const isCompanyListPossible = await db.isActivePermission(loginInfo.userKey, 'flfE1617684930419rMf');
  if (!isCompanyListPossible) {
    res.status(200).json(myValueLog({
      req: req,
      obj: {
        result: 'failure',
        headTail: req.accessUniqueKey,
        code: 20020810,
        msg: myResultCode[20020810].msg,
      },
    }));
    return;
  }

  const isCompanyAllSearchPossible = await db.isActivePermission(loginInfo.userKey, 'nFIGS1617683501961lw');


  
  const {
    companyKey, // string 또는 string[]
    companyName, // string 또는 string[]
    companyCEOName, // string 또는 string[]
    companyCEOTel, // string 또는 string[]
    companyTel, // string 또는 string[]
    companyBusinessNumber, // string 또는 string[]
    companyAddress, // string 또는 string[]
    memo, // string 또는 string[]
    createdAtStart, // string 또는 string[]
    createdAtEnd, // string 또는 string[]
    createdIp, // string 또는 string[]
    // createrUserKey, // string 또는 string[]
    // createrUserName, // string 또는 string[]
    updatedAtStart, // string 또는 string[]
    updatedAtEnd, // string 또는 string[]
    updatedIp, // string 또는 string[]
    // updaterUserKey, // string 또는 string[]
    // updaterUserName, // string 또는 string[]
    companyStatus, // string 또는 string[]

    page, // 요청온 페이지 숫자
    pageViewCount, // 한번에 표시되는 페이징 수
    viewCount, // 한번에 표시되는 게시글 수
  } = req.body;

  let pageReal = Number(page);
  let pageViewCountReal = Number(pageViewCount);
  let viewCountReal = Number(viewCount);

  const where = {};
  const createrUserWhereOpAndArray = [];
  let createrUserRequired = false;
  const updaterUserWhereOpAndArray = [];
  let updaterUserRequired = false;
  const order = [];
  const OpAndArray = [];

  
  // companyKey 체크 : optional
  if (typeof companyKey === 'string') {
    if (companyKey.trim() !== '' && companyKey.length === 20) {
      OpAndArray.push({
        companyKey: {
          [Op.eq]: companyKey,
        },
      });
    }
  }

  if (Array.isArray(companyKey)) {
    const companyKeyReal = [];
    for (let i = 0; i < companyKey.length; i++) {
      if (typeof companyKey[i] !== 'string') {
        continue;
      }

      if (companyKey[i].trim() === '') {
        continue;
      }

      if (companyKey[i].length !== 20) {
        continue;
      }

      companyKeyReal.push(companyKey[i]);
    }

    if (companyKeyReal.length > 0) {
      OpAndArray.push({
        companyKey: {
          [Op.in]: companyKeyReal,
        },
      });
    }
  }

  // companyName 체크 : optional
  if (typeof companyName === 'string') {
    if (companyName.trim() !== '') {
      if (!isCompanyAllSearchPossible) {
        const isCompanyNameSearchPossible = await db.isActivePermission(loginInfo.userKey, 'wychQA1617683535981H');
        if (!isCompanyNameSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20041010,
              msg: myResultCode[20041010].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        companyName: {
          [Op.substring]: myCommon.specialCharEscape(companyName),
        },
      });
    }
  }

  if (Array.isArray(companyName)) {
    const companyNameReal = [];
    for (let i = 0; i < companyName.length; i++) {
      if (typeof companyName[i] !== 'string') {
        continue;
      }

      if (companyName[i].trim() === '') {
        continue;
      }

      companyNameReal.push(companyName[i]);
    }

    if (companyNameReal.length > 0) {
      if (!isCompanyAllSearchPossible) {
        const isCompanyNameSearchPossible = await db.isActivePermission(loginInfo.userKey, 'wychQA1617683535981H');
        if (!isCompanyNameSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20041020,
              msg: myResultCode[20041020].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        [Op.or]: companyNameReal.map((x) => {
          return {
            companyName: {
              [Op.substring]: myCommon.specialCharEscape(x),
            },
          };
        }),
      });
    }
  }

  // companyCEOName 체크 : optional
  if (typeof companyCEOName === 'string') {
    if (companyCEOName.trim() !== '') {
      if (!isCompanyAllSearchPossible) {
        const isCompanyCEONameSearchPossible = await db.isActivePermission(loginInfo.userKey, 'JGd1617683646183nWBz');
        if (!isCompanyCEONameSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20041030,
              msg: myResultCode[20041030].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        companyCEOName: {
          [Op.substring]: myCommon.specialCharEscape(companyCEOName),
        },
      });
    }
  }

  if (Array.isArray(companyCEOName)) {
    const companyCEONameReal = [];
    for (let i = 0; i < companyCEOName.length; i++) {
      if (typeof companyCEOName[i] !== 'string') {
        continue;
      }

      if (companyCEOName[i].trim() === '') {
        continue;
      }

      companyCEONameReal.push(companyCEOName[i]);
    }

    if (companyCEONameReal.length > 0) {
      if (!isCompanyAllSearchPossible) {
        const isCompanyCEONameSearchPossible = await db.isActivePermission(loginInfo.userKey, 'JGd1617683646183nWBz');
        if (!isCompanyCEONameSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20041040,
              msg: myResultCode[20041040].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        [Op.or]: companyCEONameReal.map((x) => {
          return {
            companyCEOName: {
              [Op.substring]: myCommon.specialCharEscape(x),
            },
          };
        }),
      });
    }
  }

  // companyCEOTel 체크 : optional
  if (typeof companyCEOTel === 'string') {
    if (companyCEOTel.trim() !== '') {
      if (!isCompanyAllSearchPossible) {
        const isCompanyCEOTelSearchPossible = await db.isActivePermission(loginInfo.userKey, 'jw1617683662584Mxqxo');
        if (!isCompanyCEOTelSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20041050,
              msg: myResultCode[20041050].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        companyCEOTel: {
          [Op.substring]: myCommon.specialCharEscape(companyCEOTel),
        },
      });
    }
  }

  if (Array.isArray(companyCEOTel)) {
    const companyCEOTelReal = [];
    for (let i = 0; i < companyCEOTel.length; i++) {
      if (typeof companyCEOTel[i] !== 'string') {
        continue;
      }

      if (companyCEOTel[i].trim() === '') {
        continue;
      }

      companyCEOTelReal.push(companyCEOTel[i]);
    }

    if (companyCEOTelReal.length > 0) {
      if (!isCompanyAllSearchPossible) {
        const isCompanyCEOTelSearchPossible = await db.isActivePermission(loginInfo.userKey, 'jw1617683662584Mxqxo');
        if (!isCompanyCEOTelSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20041060,
              msg: myResultCode[20041060].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        [Op.or]: companyCEOTelReal.map((x) => {
          return {
            companyCEOTel: {
              [Op.substring]: myCommon.specialCharEscape(x),
            },
          };
        }),
      });
    }
  }

  // companyTel 체크 : optional
  if (typeof companyTel === 'string') {
    if (companyTel.trim() !== '') {
      if (!isCompanyAllSearchPossible) {
        const isCompanyTelSearchPossible = await db.isActivePermission(loginInfo.userKey, 'VJ1617683688584sCaqN');
        if (!isCompanyTelSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20041070,
              msg: myResultCode[20041070].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        companyTel: {
          [Op.substring]: myCommon.specialCharEscape(companyTel),
        },
      });
    }
  }

  if (Array.isArray(companyTel)) {
    const companyTelReal = [];
    for (let i = 0; i < companyTel.length; i++) {
      if (typeof companyTel[i] !== 'string') {
        continue;
      }

      if (companyTel[i].trim() === '') {
        continue;
      }

      companyTelReal.push(companyTel[i]);
    }

    if (companyTelReal.length > 0) {
      if (!isCompanyAllSearchPossible) {
        const isCompanyTelSearchPossible = await db.isActivePermission(loginInfo.userKey, 'VJ1617683688584sCaqN');
        if (!isCompanyTelSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20041080,
              msg: myResultCode[20041080].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        [Op.or]: companyTelReal.map((x) => {
          return {
            companyTel: {
              [Op.substring]: myCommon.specialCharEscape(x),
            },
          };
        }),
      });
    }
  }

  // companyBusinessNumber 체크 : optional
  if (typeof companyBusinessNumber === 'string') {
    if (companyBusinessNumber.trim() !== '') {
      if (!isCompanyAllSearchPossible) {
        const isCompanyBusinessNumberSearchPossible = await db.isActivePermission(loginInfo.userKey, 'at1617683568543MQpfL');
        if (!isCompanyBusinessNumberSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20041090,
              msg: myResultCode[20041090].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        companyBusinessNumber: {
          [Op.substring]: myCommon.specialCharEscape(companyBusinessNumber),
        },
      });
    }
  }

  if (Array.isArray(companyBusinessNumber)) {
    const companyBusinessNumberReal = [];
    for (let i = 0; i < companyBusinessNumber.length; i++) {
      if (typeof companyBusinessNumber[i] !== 'string') {
        continue;
      }

      if (companyBusinessNumber[i].trim() === '') {
        continue;
      }

      companyBusinessNumberReal.push(companyBusinessNumber[i]);
    }

    if (companyBusinessNumberReal.length > 0) {
      if (!isCompanyAllSearchPossible) {
        const isCompanyBusinessNumberSearchPossible = await db.isActivePermission(loginInfo.userKey, 'at1617683568543MQpfL');
        if (!isCompanyBusinessNumberSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20041100,
              msg: myResultCode[20041100].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        [Op.or]: companyBusinessNumberReal.map((x) => {
          return {
            companyBusinessNumber: {
              [Op.substring]: myCommon.specialCharEscape(x),
            },
          };
        }),
      });
    }
  }

  // companyAddress 체크 : optional
  if (typeof companyAddress === 'string') {
    if (companyAddress.trim() !== '') {
      if (!isCompanyAllSearchPossible) {
        const isCompanyAddressSearchPossible = await db.isActivePermission(loginInfo.userKey, 'i1617683608391leidZG');
        if (!isCompanyAddressSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20041110,
              msg: myResultCode[20041110].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        companyAddress: {
          [Op.substring]: myCommon.specialCharEscape(companyAddress),
        },
      });
    }
  }

  if (Array.isArray(companyAddress)) {
    const companyAddressReal = [];
    for (let i = 0; i < companyAddress.length; i++) {
      if (typeof companyAddress[i] !== 'string') {
        continue;
      }

      if (companyAddress[i].trim() === '') {
        continue;
      }

      companyAddressReal.push(companyAddress[i]);
    }

    if (companyAddressReal.length > 0) {
      if (!isCompanyAllSearchPossible) {
        const isCompanyAddressSearchPossible = await db.isActivePermission(loginInfo.userKey, 'i1617683608391leidZG');
        if (!isCompanyAddressSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20041120,
              msg: myResultCode[20041120].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        [Op.or]: companyAddressReal.map((x) => {
          return {
            companyAddress: {
              [Op.substring]: myCommon.specialCharEscape(x),
            },
          };
        }),
      });
    }
  }

  // memo 체크 : optional
  if (typeof memo === 'string') {
    if (memo.trim() !== '') {
      if (!isCompanyAllSearchPossible) {
        const isCompanyMemoSearchPossible = await db.isActivePermission(loginInfo.userKey, 'GOH1617687091505GMAz');
        if (!isCompanyMemoSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20041130,
              msg: myResultCode[20041130].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        memo: {
          [Op.substring]: myCommon.specialCharEscape(memo),
        },
      });
    }
  }

  if (Array.isArray(memo)) {
    const memoReal = [];
    for (let i = 0; i < memo.length; i++) {
      if (typeof memo[i] !== 'string') {
        continue;
      }

      if (memo[i].trim() === '') {
        continue;
      }

      memoReal.push(memo[i]);
    }

    if (memoReal.length > 0) {
      if (!isCompanyAllSearchPossible) {
        const isCompanyMemoSearchPossible = await db.isActivePermission(loginInfo.userKey, 'GOH1617687091505GMAz');
        if (!isCompanyMemoSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20041140,
              msg: myResultCode[20041140].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        [Op.or]: memoReal.map((x) => {
          return {
            memo: {
              [Op.substring]: myCommon.specialCharEscape(x),
            },
          };
        }),
      });
    }
  }

  // createdAtStart 체크 : optional
  if (typeof createdAtStart === 'string') {
    if (myDate(createdAtStart).isValid()) {
      if (!isCompanyAllSearchPossible) {
        const isCompanyCreateSearchPossible = await db.isActivePermission(loginInfo.userKey, 'fWHJmEv1617684892794');
        if (!isCompanyCreateSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20041150,
              msg: myResultCode[20041150].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        createdAt: {
          [Op.gte]: createdAtStart,
        },
      });
    }
  }

  // createdAtEnd 체크 : optional
  if (typeof createdAtEnd === 'string') {
    if (myDate(createdAtEnd).isValid()) {
      if (!isCompanyAllSearchPossible) {
        const isCompanyCreateSearchPossible = await db.isActivePermission(loginInfo.userKey, 'fWHJmEv1617684892794');
        if (!isCompanyCreateSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20041160,
              msg: myResultCode[20041160].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        createdAt: {
          [Op.lte]: createdAtEnd,
        },
      });
    }
  }

  // createdIp 체크 : optional
  if (typeof createdIp === 'string') {
    if (createdIp.trim() !== '') {
      if (!isCompanyAllSearchPossible) {
        const isCompanyCreateAtIpSearchPossible = await db.isActivePermission(loginInfo.userKey, 'DUrVJAA1619312521414');
        if (!isCompanyCreateAtIpSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20041170,
              msg: myResultCode[20041170].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        createdIp: {
          [Op.substring]: myCommon.specialCharEscape(createdIp),
        },
      });
    }
  }

  if (Array.isArray(createdIp)) {
    const createdIpReal = [];
    for (let i = 0; i < createdIp.length; i++) {
      if (typeof createdIp[i] !== 'string') {
        continue;
      }

      if (createdIp[i].trim() === '') {
        continue;
      }

      createdIpReal.push(createdIp[i]);
    }

    if (createdIpReal.length > 0) {
      if (!isCompanyAllSearchPossible) {
        const isCompanyCreateAtIpSearchPossible = await db.isActivePermission(loginInfo.userKey, 'DUrVJAA1619312521414');
        if (!isCompanyCreateAtIpSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20041180,
              msg: myResultCode[20041180].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        [Op.or]: createdIpReal.map((x) => {
          return {
            createdIp: {
              [Op.substring]: myCommon.specialCharEscape(x),
            },
          };
        }),
      });
    }
  }

  // // createrUserKey 체크 : optional
  // if (typeof createrUserKey === 'string') {
  //   if (createrUserKey.trim() !== '' && createrUserKey.length === 20) {
  //     OpAndArray.push({
  //       createrUserKey: {
  //         [Op.eq]: createrUserKey,
  //       },
  //     });
  //   }
  // }

  // if (Array.isArray(createrUserKey)) {
  //   const createrUserKeyReal = [];
  //   for (let i = 0; i < createrUserKey.length; i++) {
  //     if (typeof createrUserKey[i] !== 'string') {
  //       continue;
  //     }

  //     if (createrUserKey[i].trim() === '') {
  //       continue;
  //     }

  //     if (createrUserKey[i].length !== 20) {
  //       continue;
  //     }

  //     createrUserKeyReal.push(createrUserKey[i]);
  //   }

  //   if (createrUserKeyReal.length > 0) {
  //     OpAndArray.push({
  //       createrUserKey: {
  //         [Op.in]: createrUserKeyReal,
  //       },
  //     });
  //   }
  // }

  // // createrUserName 체크 : optional
  // if (typeof createrUserName === 'string') {
  //   if (createrUserName.trim() !== '') {
  //     createrUserWhereOpAndArray.push({
  //       userName: {
  //         [Op.substring]: myCommon.specialCharEscape(createrUserName),
  //       },
  //     });
  //   }
  // }

  // if (Array.isArray(createrUserName)) {
  //   const createrUserNameReal = [];
  //   for (let i = 0; i < createrUserName.length; i++) {
  //     if (typeof createrUserName[i] !== 'string') {
  //       continue;
  //     }

  //     if (createrUserName[i].trim() === '') {
  //       continue;
  //     }

  //     createrUserNameReal.push(createrUserName[i]);
  //   }

  //   if (createrUserNameReal.length > 0) {
  //     createrUserWhereOpAndArray.push({
  //       [Op.or]: createrUserNameReal.map((x) => {
  //         return {
  //           userName: {
  //             [Op.substring]: myCommon.specialCharEscape(x),
  //           },
  //         };
  //       }),
  //     });
  //   }
  // }

  // updatedAtStart 체크 : optional
  if (typeof updatedAtStart === 'string') {
    if (myDate(updatedAtStart).isValid()) {
      if (!isCompanyAllSearchPossible) {
        const isCompanyUpdatedAtSearchPossible = await db.isActivePermission(loginInfo.userKey, 'gSutwYw1619312843781');
        if (!isCompanyUpdatedAtSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20041190,
              msg: myResultCode[20041190].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        updatedAt: {
          [Op.gte]: updatedAtStart,
        },
      });
    }
  }

  // updatedAtEnd 체크 : optional
  if (typeof updatedAtEnd === 'string') {
    if (myDate(updatedAtEnd).isValid()) {
      if (!isCompanyAllSearchPossible) {
        const isCompanyUpdatedAtSearchPossible = await db.isActivePermission(loginInfo.userKey, 'gSutwYw1619312843781');
        if (!isCompanyUpdatedAtSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20041200,
              msg: myResultCode[20041200].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        updatedAt: {
          [Op.lte]: updatedAtEnd,
        },
      });
    }
  }

  // updatedIp 체크 : optional
  if (typeof updatedIp === 'string') {
    if (updatedIp.trim() !== '') {
      if (!isCompanyAllSearchPossible) {
        const isCompanyUpdateIpSearchPossible = await db.isActivePermission(loginInfo.userKey, 'QC1619312971337AqYpN');
        if (!isCompanyUpdateIpSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20041210,
              msg: myResultCode[20041210].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        updatedIp: {
          [Op.substring]: myCommon.specialCharEscape(updatedIp),
        },
      });
    }
  }

  if (Array.isArray(updatedIp)) {
    const updatedIpReal = [];
    for (let i = 0; i < updatedIp.length; i++) {
      if (typeof updatedIp[i] !== 'string') {
        continue;
      }

      if (updatedIp[i].trim() === '') {
        continue;
      }

      updatedIpReal.push(updatedIp[i]);
    }

    if (updatedIpReal.length > 0) {
      if (!isCompanyAllSearchPossible) {
        const isCompanyUpdateIpSearchPossible = await db.isActivePermission(loginInfo.userKey, 'QC1619312971337AqYpN');
        if (!isCompanyUpdateIpSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20041220,
              msg: myResultCode[20041220].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        [Op.or]: updatedIpReal.map((x) => {
          return {
            updatedIp: {
              [Op.substring]: myCommon.specialCharEscape(x),
            },
          };
        }),
      });
    }
  }

  // // updaterUserKey 체크 : optional
  // if (typeof updaterUserKey === 'string') {
  //   if (updaterUserKey.trim() !== '' && updaterUserKey.length === 20) {
  //     OpAndArray.push({
  //       updaterUserKey: {
  //         [Op.eq]: updaterUserKey,
  //       },
  //     });
  //   }
  // }

  // if (Array.isArray(updaterUserKey)) {
  //   const updaterUserKeyReal = [];
  //   for (let i = 0; i < updaterUserKey.length; i++) {
  //     if (typeof updaterUserKey[i] !== 'string') {
  //       continue;
  //     }

  //     if (updaterUserKey[i].trim() === '') {
  //       continue;
  //     }

  //     if (updaterUserKey[i].length !== 20) {
  //       continue;
  //     }

  //     updaterUserKeyReal.push(updaterUserKey[i]);
  //   }

  //   if (updaterUserKeyReal.length > 0) {
  //     OpAndArray.push({
  //       updaterUserKey: {
  //         [Op.in]: updaterUserKeyReal,
  //       },
  //     });
  //   }
  // }

  // // updaterUserName 체크 : optional
  // if (typeof updaterUserName === 'string') {
  //   if (updaterUserName.trim() !== '') {
  //     updaterUserWhereOpAndArray.push({
  //       userName: {
  //         [Op.substring]: myCommon.specialCharEscape(updaterUserName),
  //       },
  //     });
  //   }
  // }

  // if (Array.isArray(updaterUserName)) {
  //   const updaterUserNameReal = [];
  //   for (let i = 0; i < updaterUserName.length; i++) {
  //     if (typeof updaterUserName[i] !== 'string') {
  //       continue;
  //     }

  //     if (updaterUserName[i].trim() === '') {
  //       continue;
  //     }

  //     updaterUserNameReal.push(updaterUserName[i]);
  //   }

  //   if (updaterUserNameReal.length > 0) {
  //     updaterUserWhereOpAndArray.push({
  //       [Op.or]: updaterUserNameReal.map((x) => {
  //         return {
  //           userName: {
  //             [Op.substring]: myCommon.specialCharEscape(x),
  //           },
  //         };
  //       }),
  //     });
  //   }
  // }

  // companyStatus 체크 : optional
  if (typeof companyStatus === 'string') {
    if (companyStatus.trim() !== '' && companyStatus.length === 20) {
      if (!isCompanyAllSearchPossible) {
        const isCompanyStatusSearchPossible = await db.isActivePermission(loginInfo.userKey, 'wReS1617684910526lEK');
        if (!isCompanyStatusSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20041230,
              msg: myResultCode[20041230].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        companyStatus: {
          [Op.eq]: companyStatus,
        },
      });
    }
  }

  if (Array.isArray(companyStatus)) {
    const companyStatusReal = [];
    for (let i = 0; i < companyStatus.length; i++) {
      if (typeof companyStatus[i] !== 'string') {
        continue;
      }

      if (companyStatus[i].trim() === '') {
        continue;
      }

      if (companyStatus[i].length !== 13) {
        continue;
      }

      companyStatusReal.push(companyStatus[i]);
    }

    if (companyStatusReal.length > 0) {
      if (!isCompanyAllSearchPossible) {
        const isCompanyStatusSearchPossible = await db.isActivePermission(loginInfo.userKey, 'wReS1617684910526lEK');
        if (!isCompanyStatusSearchPossible) {
          res.status(200).json(myValueLog({
            req: req,
            obj: {
              result: 'failure',
              headTail: req.accessUniqueKey,
              code: 20041240,
              msg: myResultCode[20041240].msg,
            },
          }));
          return;
        }
      }

      OpAndArray.push({
        companyStatus: {
          [Op.in]: companyStatusReal,
        },
      });
    }
  }





  // page 체크
  if (page === undefined) {
    pageReal = 1;
  }

  if (typeof page === 'string') {
    if (page.trim() === '') {
      pageReal = 1;
    }

    if (isNaN(Number(page))) {
      pageReal = 1;
    }
  }

  // pageViewCount 체크
  if (pageViewCount === undefined) {
    pageViewCountReal = 10;
  }

  if (typeof pageViewCount === 'string') {
    if (pageViewCount.trim() === '') {
      pageViewCountReal = 10;
    }

    if (isNaN(Number(pageViewCount))) {
      pageViewCountReal = 10;
    }
  }

  // viewCount 체크
  if (viewCount === undefined) {
    viewCountReal = 10;
  }

  if (typeof viewCount === 'string') {
    if (viewCount.trim() === '') {
      viewCountReal = 10;
    }

    if (isNaN(Number(viewCount))) {
      viewCountReal = 10;
    }
  }

  // 리스트 가져오기
  /*
    include (join) 대상에 대한 조건이 없다면, OUTER JOIN
    include (join) 대상에 대한 조건이 있다면, INNER JOIN
  */
  if (createrUserWhereOpAndArray.length > 0) {
    createrUserRequired = true;
  }
  if (updaterUserWhereOpAndArray.length > 0) {
    updaterUserRequired = true;
  }
  where[Op.and] = OpAndArray;
  where.isDeletedRow = 'N';
  order.push(['createdAt', 'DESC']);

  // 전체 리스트 가져오기 (전체 갯수)
  const totalResult = await db.FmsCompanys.findAndCountAll({
    where: where,
    order: order,
    include: [
      {
        as: 'FmsCompanyStatusCodes',
        model: db.FmsCodes,
        attributes: ['code', 'codeName'],
      },
    ],
  });
  const totalCount = totalResult.count;

  // (1)
  const getPageGroupInfo = myBoard.getPageGroupInfo({
    req: req,
    page: pageReal,
    pageViewCount: pageViewCountReal,
    viewCount: viewCountReal,
  });
  /*
    getPageGroupInfo.pageStartNumber
    getPageGroupInfo.pageEndNumber
    getPageGroupInfo.startIndex
    getPageGroupInfo.pageLength
  */

  // (2)
  const getBoardCountInfo = myBoard.getBoardCountInfo({
    req: req,
    page: pageReal,
    pageViewCount: pageViewCountReal,
    viewCount: viewCountReal,
    pageGroupTotalCount: 0,
    totalCount: totalCount,
    pageStartNumber: getPageGroupInfo.pageStartNumber,
    pageEndNumber: getPageGroupInfo.pageEndNumber,
  });
  /*
    getBoardCountInfo.showPages
    getBoardCountInfo.isPrevExist
    getBoardCountInfo.isNextExist
    getBoardCountInfo.prevPage
    getBoardCountInfo.nextPage
    getBoardCountInfo.lastPageNum
  */

  // (3)
  const getPageInfo = myBoard.getPageInfo({
    req: req,
    page: pageReal,
    pageViewCount: pageViewCountReal,
    viewCount: viewCountReal,
  });
  /*
    getPageInfo.startIndex
    getPageInfo.pageLength 
  */

  const activePermissionKeys = await db.isActivePermissions(loginInfo.userKey, [
    'S1617684955017JFIumn', // seq
    'KL1617684973373YzQOa', // 회사명
    'dNrN1617684996447qOA', // 사업자번호
    'BfX1617685011279bGbM', // 사업장주소
    'kCs1617685025399aUmD', // 대표자명
    'Ut1617685039971wJiPQ', // 대표자 연락처
    'BV1617685057809IWBVM', // 회사전화번호
    'mnNdpze1617685077300', // 등록일
    'ssO1617687189173zGlK', // 메모
    'uZdxER1617685091349q', // 상태
  ]);
  const FmsCompanyAttributes = [];
  const FmsCompanyStatusCodesAttributes = [];

  activePermissionKeys.includes('S1617684955017JFIumn') ? FmsCompanyAttributes.push('seq') : null;
  activePermissionKeys.includes('KL1617684973373YzQOa') ? FmsCompanyAttributes.push('companyName') : null;
  activePermissionKeys.includes('dNrN1617684996447qOA') ? FmsCompanyAttributes.push('companyBusinessNumber') : null;
  activePermissionKeys.includes('BfX1617685011279bGbM') ? FmsCompanyAttributes.push('companyAddress') : null;
  activePermissionKeys.includes('kCs1617685025399aUmD') ? FmsCompanyAttributes.push('companyCEOName') : null;
  activePermissionKeys.includes('Ut1617685039971wJiPQ') ? FmsCompanyAttributes.push('companyCEOTel') : null;
  activePermissionKeys.includes('BV1617685057809IWBVM') ? FmsCompanyAttributes.push('companyTel') : null;
  activePermissionKeys.includes('mnNdpze1617685077300') ? FmsCompanyAttributes.push('createdAt') : null;
  activePermissionKeys.includes('ssO1617687189173zGlK') ? FmsCompanyAttributes.push('memo') : null;
  if (activePermissionKeys.includes('uZdxER1617685091349q')) {
    FmsCompanyAttributes.push('companyStatus');
    FmsCompanyStatusCodesAttributes.push('code');
    FmsCompanyStatusCodesAttributes.push('codeName');
  }

  const list = await db.FmsCompanys.findAll({
    attributes: FmsCompanyAttributes,
    // attributes: [
    //   'companyKey', 'companyName', 'companyCEOName', 'companyCEOTel', 'companyTel', 'companyBusinessNumber',
    //   'companyAddress', 'memo', 'createdAt', 'createdIp', 'updatedAt', 'updatedIp', 'companyStatus',
    // ],
    where: where,
    order: order,
    include: [
      {
        as: 'FmsCompanyStatusCodes',
        model: db.FmsCodes,
        attributes: FmsCompanyStatusCodesAttributes,
        // attributes: ['code', 'codeName'],
      },
    ],
    offset: getPageInfo.startIndex,
    limit: getPageInfo.pageLength,
  });

  res.status(200).json(myValueLog({
    req: req,
    obj: {
      result: 'success',
      headTail: req.accessUniqueKey,
      code: 10001000,
      list: list,
      totalCount: totalCount,
      getBoardCountInfo: getBoardCountInfo,
    },
  }));
  return;
});

module.exports = getCompany;