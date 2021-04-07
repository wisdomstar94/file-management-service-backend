const myLogger = require('./myLogger');

/*
  1) 만약 요청온 페이지가 16이고, 한 화면에 보이는 페이지번호 수가 7이고, 한 화면에 보이는 게시글 수가 30개 이면


  15, [16], 17, 18, 19, 20, 21
  ↑                         ↑
  pageStartNumber           pageEndNumber


  15부터 21까지의 범위로 전체 글 수(2)번의 pageGroupTotalCount에 해당)를 가져오기 위한
  LIMIT A, B 에서 A와 B 정보를 반환하는 함수
*/
exports.getPageGroupInfo = function(params) {
  /*
    page: 요청온 페이지 숫자
    pageViewCount: 한번에 표시되는 페이징 수
    viewCount: 한번에 표시되는 게시글 수
  */

  params.page = Number(params.page);
  params.pageViewCount = Number(params.pageViewCount);
  params.viewCount = Number(params.viewCount);

  const remainNumber = params.page % params.pageViewCount;

  let pageStartNumber = 0;
  if (remainNumber === 0) {
    pageStartNumber = (params.page - params.pageViewCount) + 1;
  } else {
    pageStartNumber = (params.page - remainNumber) + 1;
  }

  const pageEndNumber = (pageStartNumber + params.pageViewCount) - 1;


  const startIndex = (pageStartNumber - 1) * params.viewCount;
  const pageLength = params.pageViewCount * params.viewCount;

  // myLogger.info('pageStartNumber는 분명 ', pageStartNumber);

  return {
    pageStartNumber: pageStartNumber,
    pageEndNumber: pageEndNumber,

    startIndex: startIndex, // A
    pageLength: pageLength + 1, // B (원래 가져와야할 갯수보다 1개 더 가져옴 (다음 페이지 존재 유무 확인을 위해))
  };
};







/*
  2) 1) 에서 반환된 정보로 가져온 범위 전체 글 수 정보와 페이지 시작 수, 페이지 종료 수 정보를 받아와
  표시되어야 할 페이지 수 정보를 반환하는 함수
*/
exports.getBoardCountInfo = function(params) {
  myLogger.info(params.req.logHeadTail + ' --- --- --- getBoardCountInfo --- --- --- ');
  /*
    page: 요청온 페이지 숫자
    pageViewCount: 한번에 표시되는 페이징 수
    viewCount: 한번에 표시되는 게시글 수
    pageGroupTotalCount: 한번에 표시되는 페이징 수와 게시글 수만큼 가져온 게시글 수
    (ex. 한번에 표시되는 페이징 수가 10이고 한번에 표시되는 게시글 수가 30이면, (10 * 30) + 1 개 만큼 가져오기를 시도한 결과수)
    totalCount: 조건에 부합하는 전체 게시물 수 (pageGroupTotalCount 또는 totalCount 둘 중 1개 사용)
    pageStartNumber: 요청온 페이지 숫자에 따라 한번에 표시되는 페이징의 시작 페이지 수
    (ex. 한번에 표시되는 페이징 수가 10이고 요청온 페이지 수가 18 이면, 시작 페이지 수는 11)
    pageEndNumber: 요청온 페이지 숫자에 따라 한번에 표시되는 페이징의 종료 페이지 수
    (ex. 한번에 표시되는 페이징 수가 10이고 요청온 페이지 수가 18 이면, 종료 페이지 수는 20)
  */

  params.page = Number(params.page);
  params.pageViewCount = Number(params.pageViewCount);
  params.viewCount = Number(params.viewCount);
  params.pageGroupTotalCount = Number(params.pageGroupTotalCount);
  params.totalCount = Number(params.totalCount);
  params.pageStartNumber = Number(params.pageStartNumber);
  params.pageEndNumber = Number(params.pageEndNumber);

  const showPages = [];

  myLogger.info(params.req.logHeadTail + 'pageGroupTotalCount', params.pageGroupTotalCount);
  myLogger.info(params.req.logHeadTail + 'pageViewCount', params.pageViewCount);

  let showPageCount = Math.ceil(params.pageGroupTotalCount / params.viewCount);

  if (params.pageGroupTotalCount > params.pageViewCount * params.viewCount) {
    myLogger.info('111');
    showPageCount = Math.ceil((params.pageGroupTotalCount - 1) / params.pageViewCount);
  }

  if (params.totalCount >= 0 && !isNaN(params.totalCount)) {
    showPageCount = 0;
    for (let i = params.pageStartNumber; i <= params.pageEndNumber; i++) {
      const prev_page_number = i - 1;
      const temp_count = (prev_page_number * params.viewCount) + 1;
      if (temp_count <= params.totalCount) {
        showPageCount++;
      }
    }
  }

  myLogger.info(params.req.logHeadTail + 'showPageCount', showPageCount);

  for (let i = 0; i < showPageCount; i++) {
    const page_num = params.pageStartNumber + i;

    showPages.push({
      page: params.pageStartNumber + i,
      isActive: (params.page === params.pageStartNumber + i) ? true : false,
    });

    if (page_num >= params.pageEndNumber) {
      break;
    }
  }

  let isPrevExist = false;
  let isNextExist = false;

  const prevPage = params.pageStartNumber - 1;
  const nextPage = params.pageEndNumber + 1;

  if ((params.pageViewCount * params.viewCount) < params.pageGroupTotalCount) {
    isNextExist = true;
  }

  let lastPageNum = 0;
  if (params.totalCount >= 0 && !isNaN(params.totalCount)) {
    const one_group_max_count = params.pageEndNumber * params.viewCount;
    if (params.totalCount > one_group_max_count) {
      isNextExist = true;
    }

    lastPageNum = Math.ceil(params.totalCount / params.viewCount);
  }

  if (params.pageStartNumber !== 1) {
    isPrevExist = true;
  }

  return {
    showPages: showPages, // array
    isPrevExist: isPrevExist, // boolean
    isNextExist: isNextExist, // boolean
    prevPage: prevPage, // number
    nextPage: nextPage, // number
    lastPageNum: lastPageNum, // number
  };
};









/*
  3) 이제 정말 요청 들어온 페이지 수에 맞는 데이터를 가져오기 위한
  LIMIT A, B 에서 A, B 수 정보를 반환하는 함수
*/
exports.getPageInfo = function(params) {
  /*
    page: 요청온 페이지 숫자
    pageViewCount: 한번에 표시되는 페이징 수
    viewCount: 한번에 표시되는 게시글 수
  */

  params.page = Number(params.page);
  params.pageViewCount = Number(params.pageViewCount);
  params.viewCount = Number(params.viewCount);

  const startIndex = (params.page - 1) * params.viewCount;
  const pageLength = params.viewCount;

  return {
    startIndex: startIndex,
    pageLength: pageLength,
  };
};