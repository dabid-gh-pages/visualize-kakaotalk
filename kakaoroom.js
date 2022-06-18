// 이름이 다 다른경우에만 돌아감

// output is object (data source of truth)
const kakaoRoomObject = function (txtString) {
  //helpers

  // 2021년 6월 22일 오후 10:11를 Date Object으로
  const dateFromString = function (dateString) {
    const r = dateString.split(" ");
    const year = r[0].slice(0, -1);
    const month = r[1].slice(0, -1);
    const day = r[2].slice(0, -1);
    const time =
      r[3] === "오후" && parseInt(r[4].split(":").slice(0)) < 12
        ? (parseInt(r[4].split(":").slice(0)) + 12).toString() +
          ":" +
          r[4].split(":").slice(1)
        : r[4];
    const finalString = `${year}-${month}-${day} ${time}:00`;
    return new Date(finalString);
  };

  // Date Object를 '2022년 6월 22일 형태로
  const dateToString = function (dateObject) {
    const year = dateObject.getFullYear().toString();
    const month = dateObject.getMonth() + 1;
    const day = dateObject.getDate();
    return `${year}년 ${month}월 ${day}일`;
  };

  // creating a function  that converts each message string to message object

  const messageToObject = function (messageString) {
    const dateString = messageString.split(/,/)[0];
    const date = dateFromString(messageString.split(/,/)[0]);
    const yearMonth =
      date.getFullYear().toString().slice(-2) +
      "-" +
      ("0" + (date.getMonth() + 1)).slice(-2);

    const year = date.getFullYear().toString().slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    // conver to date
    const name = messageString.match(/, (.*?) : /)[1];
    const content = messageString.split(/ : /).slice(1).join(" : ");
    const count = 1;

    return { name, date, yearMonth, year, month, content, count };
  };

  const inOutToObject = function (messageString) {
    const dateString = messageString.split(/,/)[0];
    const date = dateFromString(messageString.split(/,/)[0]);

    try {
      const name = messageString
        .match(/,(.*?)(님이 나갔습니다.|님이 들어왔습니다.)/)[1]
        .slice(1);
      let contentType;
      if (messageString.includes("님이 들어왔습니다.")) {
        contentType = "입장";
      } else {
        if (messageString.includes("내보냈습니다.")) {
          contentType = "강제퇴장";
        } else {
          contentType = "자진퇴장";
        }
      }

      return { date, name, contentType };
    } catch {
      return;
    }
  };

  ///////////////////////// start//////////

  const my_array = txtString
    .split(
      /(?=[0-9]{4}년 [0-9]{1,2}월 [0-9]{1,2}일 (오후|오전) [0-9]{1,2}:[0-9]{2}(.*?),)/
    )
    .filter((item) => item.length > 18) //날짜만 있는 항목 지우기
    .filter(
      (item) => !item.includes("채팅방 관리자가 메시지를 가렸습니다.") //분석에 불필요함
    )
    .filter(
      (item) => !item.includes("님을 초대했습니다.") //분석에 불필요함
    );
  const savedDate = dateFromString(
    my_array[0].split(/(?=저장한 날짜 : (.*?)\n\n)/)[1]
  ); // 내보내기 일자

  const roomTitle = my_array[0].split(" 님과 카카오톡 대화")[0].slice(0); // 방제목

  const items = my_array.slice(1);
  // items는  1) 입장 item, 2) 퇴장 아이템, 3) 메시지 아이템 3가지로 나뉨

  // 시작일,종료일
  const firstDate = dateFromString(items.slice(0)[0].split(/,/)[0]);
  const lastDate = dateFromString(items.slice(-1)[0].split(/,/)[0]);

  //일단 입장하기, 나가기 item만 건지고, 나머지는 message

  // 2022년 5월 29일 오후 9:05 -> date object
  const enterItems = items
    .filter((item) => /님이 들어왔습니다.(\r\n|\n운영정책을 위반한)/.test(item))
    .map((item) => inOutToObject(item)) // 입장내역
    .filter(Boolean);

  const exitItems = items
    // .filter((item) => item.includes("님이 나갔습니다.\r\n"))
    .filter((item) =>
      /(님이 나갔습니다.\r\n|님을 내보냈습니다.\r\n)/.test(item)
    )
    .map((item) => inOutToObject(item)) // 퇴장내역
    .filter(Boolean); // 오류 방지를 위해 undefined 없애주기

  const messageItems = items
    .filter(
      (item) =>
        !(
          /님이 들어왔습니다.(\r\n|\n운영정책을 위반한)/.test(item) ||
          /(님이 나갔습니다.\r\n|님을 내보냈습니다.\r\n)/.test(item)
        )
    ) // 나머지로직으로 (메시지내역)
    .map((item) => messageToObject(item));

  /// 일단 입출입기록으로 user list
  const userListFromIn = [
    ...new Set(enterItems.map((item) => item.name)), //.filter( Boolean ) filters undefined
  ];
  const userListFromOut = [...new Set(exitItems.map((item) => item.name))];

  // 그다음 message list
  const userListFromMessage = [
    ...new Set(messageItems.map((item) => item.name)),
  ];

  const inButNoMessage = userListFromIn.filter(
    (user) => !userListFromMessage.includes(user)
  );

  const targetUsers = [...userListFromMessage, ...inButNoMessage].filter(
    (user) => user != "방장봇" //방장 제외
  );

  const users = [];
  targetUsers.forEach((userName) => {
    let joinedDate, joinedBeforeFirst;

    if (enterItems.find((item) => item.name == userName) == undefined) {
      joinedDate = firstDate;
      joinedBeforeFirst = true;
    } else {
      joinedDate = enterItems.find((item) => item.name == userName).date;
      joinedBeforeFirst = false;
    }

    exitDate =
      exitItems.find((item) => item.name == userName) == undefined
        ? false
        : exitItems.find((item) => item.name == userName).date;
    messages = messageItems.filter((item) => item.name == userName);
    users.push({ userName, joinedDate, joinedBeforeFirst, exitDate, messages });
  });
  users.sort((userA, userB) => userB.messages.length - userA.messages.length); //메시지 수대로 정렬해두기

  /**
   * 개요 summary 부분
   */

  const summaryDiv1 = roomTitle + "방에서는 \n";
  const summaryDiv2 =
    dateToString(firstDate) + "부터 " + dateToString(lastDate) + "까지\n";
  const summaryDiv3 = `${users.length}명이 ${messageItems.length}개의 메시지를 주고받았어요.`;
  const summaryText = [summaryDiv1, summaryDiv2, summaryDiv3];
  console.log({
    savedDate,
    roomTitle,
    firstDate,
    lastDate,
    users,
    messageItems,
    summaryText,
  });
  return {
    savedDate,
    roomTitle,
    firstDate,
    lastDate,
    users,
    messageItems,
    summaryText,
  };
};

// input is amessageItems, output is array of { text: "study", size: 40 },

const getWordCloudArray = function (messageItems) {
  const removeWords = [
    "사진",
    "=",
    "ㅋㅋ",
    "ㅎㅎ",
    "아",
    "제가",
    "혹시",
    "다",
    "저도",
    "이모티콘",
    "좋은",
    "그",
    "그냥",
    "저는",
    "수",
    "감사합니다",
    "질문",
    "잘",
    "됩니다.",
    "이렇게",
    "네",
    "저",
    "어떻게",
    "근데",
    "더",
    "ㅠㅠ",
    "ㅋㅋㅋ",
    "좀",
    "건너뛰고",
    "질문하셔도",
    "안녕하세요~~!!",
    "되나요?'라는",
    "때",
    "이거",
    "너무",
    "오전",
    "이",
    "시간",
    "하면",
    "에",
    "전",
    "있는",
    "많이",
    "다른",
    "&",
    "모아놓았습니다",
    ":",
    "이게",
    "삭제된",
    "것",
    "메시지입니다.",
    "공지를",
    "나실",
    "읽어보세요~",
    "다시",
    "한번",
    "하고",
    "ㅠ",
    "하는",
    "일단",
    "오",
    "ㅋㅋㅋㅋ",
    "+",
    "왜",
    "진짜",
    "그럼",
    "-",
    "지금",
    "있는데",
    "ㅋ",
    "하나",
    "해서",
    "음",
    "있을까요?",
    "ㅎ",
    "제",
    "할",
    "방법이",
    "아니면",
    "1",
    "이런",
    "와",
    "뭐",
    "같은",
    "어떤",
    "그래서",
    "한",
    "그리고",
    "후",
    "저희",
    "감사합니다.",
    "분들은",
    "확인",
    "서로",
    "환영합니다!",
    "작성",
    "및",
    "예정입니다.",
    "부탁드립니다.",
    "저녁",
    "부탁드려요^^",
    "와주셔서",
    "변경,",
    "댓글",
    '"이번주',
    "시간을",
    "가질",
    "가능하신",
    "​",
    "글",
    "꾸준히",
    "정말",
    "모두",
    "첫",
    "^^",
    ":)",
    "다들",
    "오늘",
    "안녕하세요!",
    "있습니다.",
    "ㅎㅎㅎ",
    "안녕하세요",
    "분들이",
    "앞으로",
    "싶은",
    "많은",
    "보고",
    "같습니다.",
    "관련",
    "것도",
    "거",
    "또",
    "입장",
    "참여",
    "함께",
    "꼭",
    "처음",
    "안녕하세요.",
    "앗",
    "같아요",
    "감사합니다!",
    "사람들을",
    "쓰고",
    "없는",
    "것을",
    "중",
    "대한",
    "혹시나",
    "ㅋㅋㅋㅋㅋ",
    "ㅜㅜ",
    "/",
    "넵",
    "...",
    "ㅜ",
    "로",
    "있어요",
    "..",
    "->",
    "~",
    "네네",
    "아직",
    "등",
  ];

  // 일단 하나의 text로 다 모으기
  const fullText = messageItems.map((item) => item.content).join(" ");
  const words = fullText.trim().split(/\s+/);
  const counts = {};

  for (const word of words) {
    counts[word] = counts[word] ? counts[word] + 1 : 1;
  }
  console.log(counts);

  const wordArray = Object.entries(counts)
    .map((item) => ({ text: item[0], size: item[1] }))
    .sort((itemA, itemB) => itemB.size - itemA.size)
    .filter((item) => !removeWords.includes(item.text))
    .filter((item) => !/^\d/.test(item.text)) //remove anything that starts with a number
    .filter((item) => !/^(https|www)/.test(item.text)) //remove url
    .filter((item, idx) => idx < 100); // 100까지의  숫자만 가져오기
  console.log(wordArray);
  return wordArray; //get only most frequent 100 entries
};
