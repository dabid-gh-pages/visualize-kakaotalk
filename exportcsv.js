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
