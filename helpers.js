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
  function processData(object) {
    return [[1]];
  }

  const tableArray = processData(kakaoRoomObject);
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
  function processData(object) {
    return [[1]];
  }

  const tableArray = processData(kakaoRoomObject);
  loadTable(tableArray, table);
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
  let csv = arrayToCsv(globalMessageArray);
  console.log(globalMessageArray);
  console.log(csv);
  downloadBlob(csv, "export.csv", "text/csv;charset=utf-8;");
};
