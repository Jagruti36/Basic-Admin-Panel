var loading = document.getElementById("overlay");
loading.style.display = "block";
var activeTr = document.getElementsByClassName("active");
var tableBody = document.getElementsByTagName("tbody");

// Function to sort data
function sortArray(arr) {
  var arrAns = [];
  var arrIndex = [];
  var arrRepeat = [];
  for (var i = 0; i < arr.length; i++) {
    for (var j = 0; j < arr.length; j++) {
      if (arr[i].id > arr[j].id) {
        if (arrIndex[i] === undefined) {
          arrIndex[i] = 0;
        }
        arrIndex[i] += 1;
      } else if (arr[i].id === arr[j].id) {
        if (arrRepeat[i] === undefined) {
          arrRepeat[i] = 0;
          if (arrIndex[i] === undefined) {
            arrIndex[i] = 0;
          }
        }
        arrRepeat[i] += 1;
      }
    }
    for (var k = 0; k < arrRepeat[i]; k++) {
      arrAns[arrIndex[i] + k] = arr[i];
    }
  }
  return arrAns;
}

// Function to show selected user data
function setData(element, keyValData) {
  var infoDiv = document.getElementById("info-content");
  infoDiv.style.display = "unset";
  if (document.getElementsByClassName("active").length > 0) {
    document.getElementsByClassName("active")[0].className = "data-row";
  }
  element.className += " active";
  var thisRowData = keyValData[element.firstChild.innerHTML];
  console.log(thisRowData);
  var userName = document.getElementById("userName");
  userName.innerHTML = thisRowData.firstName + " " + thisRowData.lastName;
  var userDesc = document.getElementById("userDesc");
  userDesc.innerHTML = thisRowData.description;
  var userAddr = document.getElementById("userAddr");
  userAddr.innerHTML = thisRowData.address.streetAddress;
  var userCity = document.getElementById("userCity");
  userCity.innerHTML = thisRowData.address.city;
  var userState = document.getElementById("userState");
  userState.innerHTML = thisRowData.address.state;
  var userZip = document.getElementById("userZip");
  userZip.innerHTML = thisRowData.address.zip;
}

// Function to Create Table Rows
function createTableRow(keys, data, keyValData) {
  data = sortArray(data);
  for (var i = 0; i < data.length; i++) {
    var tableRow = document.createElement("tr");
    for (var j = 0; j < keys.length - 2; j++) {
      var tableData = document.createElement("td");
      tableData.className = "column" + (j + 1);
      tableData.innerHTML = data[i][keys[j]];
      tableRow.append(tableData);
    }
    tableRow.addEventListener("click", function () {
      setData(this, keyValData);
    });
    if (i == 0) {
      tableRow.className = "data-row active";
      setData(tableRow, keyValData);
    } else {
      tableRow.className = "data-row";
    }
    tableBody[0].append(tableRow);
  }
}

// Api call to fetch data and setup page
var url =
  "http://www.filltext.com/?rows=32&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D";
var http = new XMLHttpRequest();
http.open("GET", url, true);
http.onreadystatechange = function () {
  if (this.readyState === 4) {
    loading.style.display = "none";
    var response = JSON.parse(this.responseText);
    var keyValMapRes = {};
    for (var i = 0; i < response.length; i++) {
      keyValMapRes[response[i].id] =
        keyValMapRes[response[i].id] || response[i];
    }
    var keys = Object.keys(response[0]);
    createTableRow(keys, response, keyValMapRes);
    var searchBox = document.getElementById("search-box");
    searchBox.addEventListener("keyup", function (e) {
      var tableRows = document.getElementsByClassName("data-row");
      [...tableRows].forEach((element) => tableBody[0].removeChild(element));
      var filteredArr = response.filter(
        ({ firstName, lastName, email, phone }) =>
          firstName.toLowerCase().includes(this.value.toLowerCase()) ||
          lastName.toLowerCase().includes(this.value.toLowerCase()) ||
          email.toLowerCase().includes(this.value.toLowerCase()) ||
          phone.includes(this.value)
      );
      createTableRow(keys, filteredArr, keyValMapRes);
    });
  }
};
http.send();