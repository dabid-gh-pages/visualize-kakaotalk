//export to csv (input is 2d array)
const exportToCsv = function () {
  /** Convert a 2D array into a CSV string
   */
  function arrayToCsv(data) {
    return data
      .map(
        (row) =>
          row
            .map(String) // convert every value to String
            .map((v) => v.replaceAll('"', '""')) // escape double colons
            .map((v) => `"${v}"`) // quote it
            .join(",") // comma-separated
      )
      .join("\r\n"); // rows starting on new lines
  }

  /** Download contents as a file
   * Source: https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
   */
  function downloadBlob(content, filename, contentType) {
    // Create a blob
    var blob = new Blob([content], { type: contentType });
    var url = URL.createObjectURL(blob);

    // Create a link to download it
    var pom = document.createElement("a");
    pom.href = url;
    pom.setAttribute("download", filename);
    pom.click();
  }
  function toDateString(date) {
    return date.toISOString().replace("T", " ").substring(0, 19);
  }

  // preprocess so that we only get the wanted values
  let messageArray = globalRoomObject.messageItems.map((item) => ({
    이름: item.name,
    시간: toDateString(item.date),
    내용: item.content,
  }));

  // convert array of object to 2d array
  const headers = Object.keys(messageArray[0]);
  const rows = messageArray.map((object) => Object.values(object));

  // put the headers,rows as global variable
  twoDArray = [headers, ...rows];

  let csv = arrayToCsv(twoDArray);
  downloadBlob(csv, "export.csv", "text/csv;charset=utf-8;");
};

const exportToExcel = function () {
  let messageArray = globalRoomObject.messageItems.map((item) => ({
    이름: item.name,
    시간: item.date,
    내용: item.content,
  }));
  var workSheet1 = XLSX.utils.json_to_sheet(messageArray);

  var wscols = [
    { width: 10 }, // first column
    { width: 15 }, // second column
    { width: 40 },
  ];

  workSheet1["!cols"] = wscols;

  let users = globalRoomObject.users
    .map((item) => ({
      이름: item.userName,
      입장일: item.joinedDate,
      시작일_이전_입장: item.joinedBeforeFirst,
      퇴장일: item.exitDate,
      총_발신횟수: item.messages.length,
    }))
    .sort((userA, userB) => userB.총_발신횟수 - userA.총_발신횟수);
  var workSheet2 = XLSX.utils.json_to_sheet(users);
  var wscols = [
    { width: 20 }, // first column
    { width: 15 }, // second column
    { width: 8 }, // second column
    { width: 15 }, // second column
    { width: 8 }, // second column
  ];

  workSheet2["!cols"] = wscols;
  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, workSheet1, "messages");
  XLSX.utils.book_append_sheet(wb, workSheet2, "users");

  XLSX.writeFile(wb, "kakao.xlsx");
};
