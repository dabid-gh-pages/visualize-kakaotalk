//selecting all required elements
const dropArea = document.querySelector(".drag-area"),
  dragText = dropArea.querySelector("header"),
  button = dropArea.querySelector("button"),
  input = dropArea.querySelector("input");
let file; //this is a global variable and we'll use it inside multiple functions
let globalRoomObject;
button.onclick = () => {
  input.click(); //if user click on the button then the input also clicked
};
input.addEventListener("change", function () {
  //getting user select file and [0] this means if user select multiple files then we'll select only the first one
  file = this.files[0];
  dropArea.classList.add("active");
  showFile(); //calling function
});
//If user Drag File Over DropArea
dropArea.addEventListener("dragover", (event) => {
  event.preventDefault(); //preventing from default behaviour
  dropArea.classList.add("active");
  dragText.textContent = "Release to Upload File";
});
//If user leave dragged File from DropArea
dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("active");
  dragText.textContent = "Drag & Drop to Upload File";
});
//If user drop File on DropArea
dropArea.addEventListener("drop", (event) => {
  event.preventDefault(); //preventing from default behaviour
  //getting user select file and [0] this means if user select multiple files then we'll select only the first one
  file = event.dataTransfer.files[0];
  showFile(); //calling function
});

function showFile() {
  let fileType = file.type; //getting selected file type
  let validExtensions = ["message/rfc822"]; //adding some valid image extensions in array
  if (validExtensions.includes(fileType)) {
    let fileReader = new FileReader(); //creating new FileReader object
    // readAsText를 실행했을 때 읽기 시작하고, 모두 다 load한 후  onload가 callback으로 실행됨
    fileReader.onload = (e) => {
      globalRoomObject = kakaoRoomObject(e.target.result);
      console.log(globalRoomObject);
      createMonthlyTable(
        globalRoomObject,
        document.querySelector(".overview-table")
      );
      createUserTable(globalRoomObject, document.querySelector(".user-table"));
    };
    fileReader.readAsText(file);
  } else {
    alert(
      "카카오톡 메시지 형식이 아닙니다. eml 파일이 맞는지 다시 확인해주세요"
    );
    dropArea.classList.remove("active");
    dragText.textContent = "Drag & Drop to Upload File";
  }
}
