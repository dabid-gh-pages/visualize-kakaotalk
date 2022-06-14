// 이름이 다 다른경우에만 돌아감

// 2d array형태로 넣어줘야 하는듯
var globalMessageArray = [];

// 주요 로직 -- create messagearray object
// output is object (data source of truth)
const kakaoRoomObject = function (txtString) {
  //helpers
  const dateToString = function (dateString) {
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
  // creating a function  that converts each message string to message object

  const messageToObject = function (messageString) {
    const dateString = messageString.split(/,/)[0];
    const date = dateToString(messageString.split(/,/)[0]);
    // conver to date
    const name = messageString.match(/, (.*?) : /)[1];
    const content = messageString.split(/ : /).slice(1).join(" : ");
    return { date, name, content };
  };

  const inOutToObject = function (messageString) {
    const dateString = messageString.split(/,/)[0];
    const date = dateToString(messageString.split(/,/)[0]);

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

  ///////////////////////// start////

  const my_array = txtString
    .split(
      /(?=[0-9]{4}년 [0-9]{1,2}월 [0-9]{1,2}일 (오후|오전) [0-9]{1,2}:[0-9]{2}(.*?),)/
    )
    .filter((item) => item.length > 18) //날짜만 있는 항목 지우기
    .filter(
      (item) => !item.includes("채팅방 관리자가 메시지를 가렸습니다.") //분석에 불필요함
    );
  const savedDate = dateToString(
    my_array[0].split(/(?=저장한 날짜 : (.*?)\n\n)/)[1]
  ); // 내보내기 일자

  const roomTitle = my_array[0].split(" 님과 카카오톡 대화")[0].slice(0); // 방제목

  const items = my_array.slice(1);
  // items는  1) 입장 item, 2) 퇴장 아이템, 3) 메시지 아이템 3가지로 나뉨

  // 시작일,종료일
  const firstDate = dateToString(items.slice(0)[0].split(/,/)[0]);
  const lastDate = dateToString(items.slice(-1)[0].split(/,/)[0]);

  //일단 입장하기, 나가기 item만 건지고, 나머지는 message

  // 2022년 5월 29일 오후 9:05 -> date object
  const enterItems = items
    .filter((item) => /님이 들어왔습니다.(\r\n|\n운영정책을 위반한)/.test(item))
    .map((item) => inOutToObject(item)); // 입장내역

  const exitItems = items
    // .filter((item) => item.includes("님이 나갔습니다.\r\n"))
    .filter((item) =>
      /(님이 나갔습니다.\r\n|님을 내보냈습니다.\r\n)/.test(item)
    )

    .map((item) => inOutToObject(item)); // 퇴장내역
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
    ...new Set(enterItems.filter(Boolean).map((item) => item.name)), //.filter( Boolean ) filters undefined
  ];
  const userListFromOut = [
    ...new Set(exitItems.filter(Boolean).map((item) => item.name)),
  ];

  // 그다음 message list
  const userListFromMessage = [
    ...new Set(messageItems.map((item) => item.name)),
  ];

  const inButNoMessage = userListFromIn.filter(
    (user) => !userListFromMessage.includes(user)
  );

  const targetUsers = [...userListFromMessage, ...inButNoMessage];

  let users = [];
  targetUsers.forEach((userName) => {
    console.log(userName);
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
    console.log({ joinedDate, joinedBeforeFirst, exitDate, messages });
  });

  return {
    savedDate,
    roomTitle,
    firstDate,
    lastDate,
    users,
    messageItems,
  };
};

/// table part

////class 로 추상화하는 것도 방법임

// class MessageVisualizer
// 아니면 kakaoMessageArray를 object로 만들어버리는 것도 가능
// class 같은 추상화를 원하는 이유 : encapsulation (그 기능을 하는 것은 그 scope안에서만 해결)

class ClassMates {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  displayInfo() {
    return this.name + "is " + this.age + " years old!";
  }
}

let classmate = new ClassMates("Mike Will", 15);
console.log(classmate);
