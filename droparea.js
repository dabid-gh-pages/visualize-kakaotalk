//selecting all required elements
let dropArea = document.querySelector(".drag-area");
const uploadButton = dropArea.querySelector(".upload-button");
const input = dropArea.querySelector("input");

let file; //this is a global variable and we'll use it inside multiple functions
let globalRoomObject; //global variable where we can reference it throughout the files

uploadButton.onclick = () => {
  input.click(); //if user click on the button then the input also clicked
};
input.addEventListener("change", function () {
  //getting user select file and [0] this means if user select multiple files then we'll select only the first one
  file = this.files[0];
  dropArea.classList.add("active");
  startWork(); //calling function
});
//If user Drag File Over DropArea
dropArea.addEventListener("dragover", (event) => {
  event.preventDefault(); //preventing from default behaviour
});
//If user leave dragged File from DropArea
//If user drop File on DropArea
dropArea.addEventListener("drop", (event) => {
  event.preventDefault(); //preventing from default behaviour
  //getting user select file and [0] this means if user select multiple files then we'll select only the first one
  file = event.dataTransfer.files[0];
  startWork(); //calling function
});

function startWork() {
  dropArea.innerHTML =
    '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>';
  setTimeout(showFile, 3000);
}

function showFile() {
  document.querySelector(".drag-area").style.display = "none";

  let fileType = file.type; //getting selected file type
  console.log(fileType);
  let validExtensions = ["message/rfc822", ""]; //adding some valid image extensions in array
  if (validExtensions.includes(fileType)) {
    let fileReader = new FileReader(); //creating new FileReader object
    // readAsText를 실행했을 때 읽기 시작하고, 모두 다 load한 후  onload가 callback으로 실행됨
    fileReader.onload = (e) => {
      globalRoomObject = kakaoRoomObject(e.target.result);
      console.log(globalRoomObject);
      getWordCloudArray(globalRoomObject.messageItems); //

      //create summary section
      createSummarySection(
        globalRoomObject,
        document.querySelector("section.overview-area")
      );
      createMonthlyTable(
        globalRoomObject,
        document.querySelector(".overview-table")
      );
      // show elements
      document.querySelector("section.overview-area").classList.toggle("show");
      document.querySelector("section.table-area").classList.toggle("show");
    };
    fileReader.readAsText(file);
  } else {
    alert(
      "카카오톡 메시지 형식이 아닙니다. eml 파일이 맞는지 다시 확인해주세요"
    );
    dropArea.classList.remove("active");
  }
}
