//input is always 2d array  (separate the processing logic and creation logic)
async function loadTable(twoDimensionalArray, table) {
  //objectArray to table
  const tableHead = table.querySelector("thead");
  const tableBody = table.querySelector("tbody");

  // convert array of object to 2d array
  const headers = twoDimensionalArray[0];
  const rows = twoDimensionalArray.slice(1);

  // Clear the table
  tableHead.innerHTML = "<tr></tr>";
  tableBody.innerHTML = "";
  // Populate the headers
  for (const headerText of headers) {
    const headerElement = document.createElement("th");
    headerElement.textContent = headerText;
    tableHead.querySelector("tr").appendChild(headerElement);
  }
  // Populate the rows
  for (const row of rows) {
    const rowElement = document.createElement("tr");
    for (const cellText of row) {
      const cellElement = document.createElement("td");
      cellElement.textContent = cellText;
      rowElement.appendChild(cellElement);
    }
    tableBody.appendChild(rowElement);
  }
}

// the ta
async function createMonthlyTable(kakaoRoomObject, table) {
  function overrideTemplate(templateArray, inputArray, key) {
    const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));
    copiedTemplateArray = deepCopy(templateArray);
    var hash = Object.create(null);
    copiedTemplateArray.forEach((obj) => (hash[obj[key]] = obj));
    inputArray.forEach((obj) => Object.assign(hash[obj[key]], obj));
    return copiedTemplateArray;
  }
  const groupSumBy = (data, key, valueKey) =>
    data
      .sort((a, b) => a[key].localeCompare(b[key]))
      .reduce((total, currentValue) => {
        const newTotal = total;
        if (total.length && total[total.length - 1][key] === currentValue[key])
          newTotal[total.length - 1] = {
            ...total[total.length - 1],
            ...currentValue,
            [valueKey]:
              parseInt(total[total.length - 1][valueKey]) +
              parseInt(currentValue[valueKey]),
          };
        else newTotal[total.length] = currentValue;
        return newTotal;
      }, []);

  function dateRange(startDate, endDate) {
    var startYear = startDate.getFullYear();
    var endYear = endDate.getFullYear();
    var dates = [];

    for (var i = startYear; i <= endYear; i++) {
      var endMonth = i != endYear ? 11 : endDate.getMonth() - 1;
      var startMon = i === startYear ? startDate.getMonth() - 1 : 0;
      for (var j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j + 1) {
        console.log(j);
        var month = j + 1;
        var displayMonth = month < 10 ? "0" + month : month;
        console.log(i);
        dates.push(new Date(i, displayMonth, 1));
      }
    }

    return dates;
  }
  const firstDate = kakaoRoomObject.firstDate;
  const lastDate = kakaoRoomObject.lastDate;
  // change date object to YY-MM년
  const monthArray = dateRange(firstDate, lastDate).map(
    (date) =>
      date.getFullYear().toString().slice(-2) +
      "-" +
      ("0" + (date.getMonth() + 1)).slice(-2)
  );
  const templateArray = monthArray.map((yearMonth) => ({
    yearMonth,
    count: 0,
  }));
  const headers = ["유저", ...monthArray];
  let rows = [];
  //preprocess  messages so that we can 1) group by month, and 2) add count
  //   processedUsers = kakaoRoomObject.users.map(user=>{})
  kakaoRoomObject.users.forEach((user) => {
    const groupedMessages = groupSumBy(user.messages, "yearMonth", "count").map(
      (message) => ({ yearMonth: message.yearMonth, count: message.count })
    );
    const formattedMesages = overrideTemplate(
      templateArray,
      groupedMessages,
      "yearMonth"
    ).map((item) => item.count);
    rows.push([user.userName, ...formattedMesages]);

    // console.log(groupedMessages);
  });
  //   const rows = kakaoRoomObject.messageItems
  //     .filter((item) => item.name == user)
  //     .map((item) => Object.values(item));
  const tableArray = [headers, ...rows];
  loadTable(tableArray, table);
}

// the ta
async function createWeeklyTable(kakaoRoomObject, table) {
  function processData(object) {
    return [[1]];
  }

  const tableArray = processData(kakaoRoomObject);
  loadTable(tableArray, table);
}

// the ta
async function createUserTable(kakaoRoomObject, table) {
  let user = "EJ/영어교육, 재테크";
  const headers = Object.keys(kakaoRoomObject.messageItems[0]);
  const rows = kakaoRoomObject.messageItems
    // .filter((item) => item.name == user)
    .map((item) => Object.values(item))
    .slice(0, 1000);
  const tableArray = [headers, ...rows];
  //   loadTable(tableArray, table);
}

// async function loadIntoTable(objectArray, table) {
//     //objectArray to table
//     const tableHead = table.querySelector("thead");
//     const tableBody = table.querySelector("tbody");

//     // convert array of object to 2d array
//     const headers = Object.keys(objectArray[0]);
//     const rows = objectArray.map((object) => Object.values(object));

//     // put the headers,rows as global variable
//     globalMessageArray = [headers, ...rows];

//     // Clear the table
//     tableHead.innerHTML = "<tr></tr>";
//     tableBody.innerHTML = "";
//     // Populate the headers
//     for (const headerText of headers) {
//       const headerElement = document.createElement("th");
//       headerElement.textContent = headerText;
//       tableHead.querySelector("tr").appendChild(headerElement);
//     }
//     // Populate the rows
//     for (const row of rows) {
//       const rowElement = document.createElement("tr");
//       for (const cellText of row) {
//         const cellElement = document.createElement("td");
//         cellElement.textContent = cellText;
//         rowElement.appendChild(cellElement);
//       }
//       tableBody.appendChild(rowElement);
//     }
//   }
